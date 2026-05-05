import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  LoanApplication,
  LOAN_APPLICATIONS_COLLECTION,
  generateLoanApplicationId,
  getNextLoanSequenceNumber,
  validateLoanApplication,
} from '@/models/LoanApplication';
import {
  sendEmail,
  createLoanApplicationConfirmationEmail,
  createAdminNotificationEmail,
  createFormSubmissionNotificationEmail,
} from '@/lib/email';
import { detectSource } from '@/lib/source-detection';
import { getAdminEmails, getFormNotificationEmail } from '@/lib/adminSettings';

function normalizeEmploymentType(value: any): 'salaried' | 'self-employed' | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase().replace(/[_\s]+/g, '-');
  if (normalized === 'salaried' || normalized === 'salary') return 'salaried';
  if (
    normalized === 'self-employed' ||
    normalized === 'selfemployed' ||
    normalized === 'self-employed/owner' ||
    normalized === 'self-employed-business'
  ) {
    return 'self-employed';
  }
  // Common variants
  if (normalized.includes('self') && normalized.includes('employ')) return 'self-employed';
  return undefined;
}

function toCleanString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function toNumber(value: any): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/[^0-9.]/g, '');
  if (!cleaned) return undefined;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeLoanApplicationBody(raw: any) {
  const body = raw && typeof raw === 'object' ? { ...raw } : {};

  // Allow flat payloads from external sources (e.g., SmartSolution)
  if (!body.personalInfo) {
    const fullName =
      body.customerName ?? body.customer_name ?? body.fullName ?? body.name ?? '';
    const mobileNumber =
      body.mobileNo ?? body.mobile_number ?? body.mobileNumber ?? body.mobile ?? body.phone ?? '';
    const pincode = body.pincode ?? body.pinCode ?? body.pin_code ?? '';
    const email = body.email ?? body.userEmail;

    if (fullName || mobileNumber || pincode || email) {
      body.personalInfo = {
        fullName: toCleanString(fullName),
        mobileNumber: toCleanString(mobileNumber),
        pincode: toCleanString(pincode),
        ...(email ? { email: toCleanString(email) } : {}),
      };
    }
  } else {
    body.personalInfo = {
      ...body.personalInfo,
      fullName: toCleanString(body.personalInfo.fullName),
      mobileNumber: toCleanString(body.personalInfo.mobileNumber),
      pincode: toCleanString(body.personalInfo.pincode),
      ...(body.personalInfo.email ? { email: toCleanString(body.personalInfo.email) } : {}),
    };
  }

  if (!body.employmentInfo) {
    const employmentType =
      body.employmentType ?? body.employment_type ?? body.jobType ?? body.job_type;
    const annualIncome = body.annualIncome ?? body.annual_income ?? body.income;

    if (employmentType || annualIncome !== undefined) {
      body.employmentInfo = {
        employmentType: normalizeEmploymentType(employmentType),
        annualIncome: toNumber(annualIncome),
      };
    }
  } else {
    body.employmentInfo = {
      ...body.employmentInfo,
      employmentType: normalizeEmploymentType(body.employmentInfo.employmentType),
      annualIncome:
        typeof body.employmentInfo.annualIncome === 'number'
          ? body.employmentInfo.annualIncome
          : toNumber(body.employmentInfo.annualIncome),
    };
  }

  // Defaults for lightweight lead forms
  if (!body.loanType) body.loanType = 'personal';
  if (!body.loanRequirement) body.loanRequirement = {};

  return body;
}

// POST /api/applications/loan - Submit a new loan application
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const body = normalizeLoanApplicationBody(rawBody);
    
    // Validate the application data
    const validation = validateLoanApplication(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Connect to database
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    // Generate unique application ID
    const sequenceNumber = await getNextLoanSequenceNumber(db);
    const applicationId = generateLoanApplicationId(sequenceNumber);
    
    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Detect source (loan-sarathi or smartmumbaisolutions)
    const source = detectSource(request);
    
    // Create application document
    const application: LoanApplication = {
      applicationId,
      userId: undefined,
      userEmail: body.personalInfo?.email || 'N/A',
      loanType: body.loanType,
      personalInfo: {
        ...body.personalInfo,
        dob: body.personalInfo?.dob ? new Date(body.personalInfo.dob) : undefined,
      },
      employmentInfo: body.employmentInfo,
      businessDetails: body.businessDetails,
      propertyDetails: body.propertyDetails,
      loanRequirement: body.loanRequirement || {},
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          updatedAt: new Date(),
          updatedBy: 'system',
          notes: `Application submitted from ${source}`,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress,
      source: source,
    };
    
    // Insert into database
    const collection = db.collection<LoanApplication>(LOAN_APPLICATIONS_COLLECTION);
    const result = await collection.insertOne(application);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert application');
    }
    
    // Send confirmation email to applicant
    try {
      if (body.personalInfo?.email) {
        const confirmationEmail = createLoanApplicationConfirmationEmail(
          body.personalInfo.fullName,
          applicationId,
          body.personalInfo.email,
          body.loanType,
          body.loanRequirement?.loanAmount || 0
        );
        await sendEmail(confirmationEmail);
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }
    
    // Send notification to admins
    try {
      const adminEmails = await getAdminEmails();
      for (const adminEmail of adminEmails) {
        const adminEmail_notification = createAdminNotificationEmail(
          adminEmail,
          applicationId,
          body.personalInfo.fullName,
          'loan'
        );
        await sendEmail(adminEmail_notification);
      }
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }
    
    // Send form submission notification to designated email
    try {
      const notificationEmail = await getFormNotificationEmail();
      const formNotification = createFormSubmissionNotificationEmail(
        notificationEmail,
        {
          applicationId,
          source: source as 'smartmumbaisolutions' | 'loan-sarathi',
          type: 'loan',
          applicantName: body.personalInfo.fullName,
          mobileNumber: body.personalInfo.mobileNumber,
          email: body.personalInfo.email,
          loanType: body.loanType,
          loanAmount: body.loanRequirement?.loanAmount,
        }
      );
      await sendEmail(formNotification);
    } catch (emailError) {
      console.error('Failed to send form notification:', emailError);
    }
    
    // Return success response with application ID
    return NextResponse.json(
      {
        success: true,
        applicationId,
        message: 'Application submitted successfully',
        data: {
          applicationId,
          status: 'pending',
          createdAt: application.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting loan application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit application. Please try again.',
      },
      { status: 500 }
    );
  }
}


