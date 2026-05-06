import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  InsuranceApplication,
  INSURANCE_APPLICATIONS_COLLECTION,
  generateInsuranceApplicationId,
  getNextInsuranceSequenceNumber,
  validateInsuranceApplication,
} from '@/models/InsuranceApplication';
import {
  sendEmail,
  createFormSubmissionNotificationEmail,
} from '@/lib/email';
import { detectSource } from '@/lib/source-detection';

const FORM_NOTIFICATION_EMAIL = 'login@smartsolutionsmumbai.com';

// POST /api/applications/insurance - Submit a new insurance application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the application data
    const validation = validateInsuranceApplication(body);
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
    const sequenceNumber = await getNextInsuranceSequenceNumber(db);
    const applicationId = generateInsuranceApplicationId(sequenceNumber);
    
    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Detect source (loan-sarathi or smartmumbaisolutions)
    const source = detectSource(request);
    
    // Create application document
    const application: InsuranceApplication = {
      applicationId,
      userId: undefined,
      userEmail: body.basicInfo.email || `${body.basicInfo.mobileNumber}@temp.com`,
      insuranceType: body.insuranceType,
      basicInfo: {
        ...body.basicInfo,
        dob: body.basicInfo.dob ? new Date(body.basicInfo.dob) : undefined,
      },
      sumInsured: body.sumInsured,
      vehicleInfo: body.vehicleInfo,
      loanInfo: body.loanInfo,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          updatedAt: new Date(),
          updatedBy: 'system',
          notes: `Quote request submitted from ${source}`,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress,
      source: source,
    };
    
    // Insert into database
    const collection = db.collection<InsuranceApplication>(INSURANCE_APPLICATIONS_COLLECTION);
    const result = await collection.insertOne(application);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert application');
    }
    
    // Send ONLY ONE form submission notification email
    try {
      const formNotification = createFormSubmissionNotificationEmail(
        FORM_NOTIFICATION_EMAIL,
        {
          applicationId,
          source: source as 'smartmumbaisolutions' | 'loan-sarathi',
          type: 'insurance',
          applicantName: body.basicInfo.fullName,
          mobileNumber: body.basicInfo.mobileNumber,
          email: body.basicInfo.email,
          insuranceType: body.insuranceType,
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
        message: 'Quote request submitted successfully',
        data: {
          applicationId,
          status: 'pending',
          createdAt: application.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting insurance application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit quote request. Please try again.',
      },
      { status: 500 }
    );
  }
}


