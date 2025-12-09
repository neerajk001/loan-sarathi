import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { LOAN_APPLICATIONS_COLLECTION, LoanApplication } from '@/models/LoanApplication';
import { INSURANCE_APPLICATIONS_COLLECTION, InsuranceApplication } from '@/models/InsuranceApplication';

// GET /api/track - Track application status by reference ID or mobile number
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Please login to track your applications' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const referenceId = searchParams.get('referenceId');
    const mobile = searchParams.get('mobile');

    if (!referenceId && !mobile) {
      return NextResponse.json(
        { success: false, error: 'Please provide either referenceId or mobile number' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');

    let application: any = null;
    let applicationType: 'loan' | 'insurance' | null = null;

    // Search by reference ID
    if (referenceId) {
      // Try loan applications
      const loanCollection = db.collection<LoanApplication>(LOAN_APPLICATIONS_COLLECTION);
      const loanApp = await loanCollection.findOne({ applicationId: referenceId });

      if (loanApp) {
        application = loanApp;
        applicationType = 'loan';
      } else {
        // Try insurance applications
        const insuranceCollection = db.collection<InsuranceApplication>(INSURANCE_APPLICATIONS_COLLECTION);
        const insuranceApp = await insuranceCollection.findOne({ applicationId: referenceId });

        if (insuranceApp) {
          application = insuranceApp;
          applicationType = 'insurance';
        }
      }
    }
    // Search by mobile number
    else if (mobile) {
      // Try loan applications
      const loanCollection = db.collection<LoanApplication>(LOAN_APPLICATIONS_COLLECTION);
      const loanApps = await loanCollection
        .find({ 'personalInfo.mobileNumber': mobile })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      if (loanApps.length > 0) {
        // Return the most recent application
        application = loanApps[0];
        applicationType = 'loan';
      } else {
        // Try insurance applications
        const insuranceCollection = db.collection<InsuranceApplication>(INSURANCE_APPLICATIONS_COLLECTION);
        const insuranceApps = await insuranceCollection
          .find({ 'basicInfo.mobileNumber': mobile })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray();

        if (insuranceApps.length > 0) {
          application = insuranceApps[0];
          applicationType = 'insurance';
        }
      }
    }

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'No application found with the provided details' },
        { status: 404 }
      );
    }

    // Verify that the application belongs to the logged-in user
    const applicationEmail = applicationType === 'loan' 
      ? application.personalInfo?.email 
      : application.basicInfo?.email;

    if (applicationEmail !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'You can only track your own applications' },
        { status: 403 }
      );
    }

    // Calculate progress percentage based on status
    const statusProgress: Record<string, number> = {
      pending: 20,
      reviewing: 40,
      'in-review': 40,
      verified: 60,
      approved: 80,
      'quote-sent': 60,
      purchased: 100,
      rejected: 100,
      disbursed: 100,
    };

    const progress = statusProgress[application.status] || 20;

    // Format the response
    const response = {
      success: true,
      application: {
        applicationId: application.applicationId,
        type: applicationType,
        status: application.status,
        progress,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        statusHistory: application.statusHistory.map((entry: any) => ({
          status: entry.status,
          date: entry.updatedAt,
          notes: entry.notes,
        })),
      },
    };

    // Add type-specific details
    if (applicationType === 'loan') {
      const loanApp = application as LoanApplication;
      response.application = {
        ...response.application,
        ...{
          applicantName: loanApp.personalInfo.fullName,
          loanType: loanApp.loanType,
          loanAmount: loanApp.loanRequirement.loanAmount,
          tenure: loanApp.loanRequirement.tenure,
          email: loanApp.personalInfo.email,
          phone: loanApp.personalInfo.mobileNumber,
        },
      };
    } else if (applicationType === 'insurance') {
      const insuranceApp = application as InsuranceApplication;
      response.application = {
        ...response.application,
        ...{
          applicantName: insuranceApp.basicInfo.fullName,
          insuranceType: insuranceApp.insuranceType,
          sumInsured: insuranceApp.sumInsured,
          phone: insuranceApp.basicInfo.mobileNumber,
          quotedPremium: insuranceApp.quotedPremium,
        },
      };
    }

    // Add next steps based on status
    const nextSteps: Record<string, string> = {
      pending: 'Your application is being reviewed by our team. We will contact you within 24-48 hours.',
      reviewing: 'Our team is verifying your documents and details. You may be contacted for additional information.',
      'in-review': 'Our team is verifying your details. You may be contacted for additional information.',
      verified: 'Your application has been verified. We are connecting you with our lending partners.',
      approved: 'Congratulations! Your application has been approved. Our team will contact you for the next steps.',
      'quote-sent': 'We have sent you personalized insurance quotes. Please review and choose the best option.',
      rejected: 'We regret to inform you that your application could not be processed at this time. Please contact us for more details.',
      disbursed: 'Your loan has been successfully disbursed. Thank you for choosing us!',
      purchased: 'Thank you for purchasing the insurance policy. You will receive the policy documents shortly.',
    };

    response.application = {
      ...response.application,
      ...{
        nextSteps: nextSteps[application.status] || 'Please check back later for updates.',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error tracking application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track application' },
      { status: 500 }
    );
  }
}
