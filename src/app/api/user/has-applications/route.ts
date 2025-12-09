import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { LOAN_APPLICATIONS_COLLECTION, type LoanApplication } from '@/models/LoanApplication';
import { INSURANCE_APPLICATIONS_COLLECTION, type InsuranceApplication } from '@/models/InsuranceApplication';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ hasApplications: false }, { status: 200 });
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');

    // Check for loan applications
    const loanCount = await db.collection<LoanApplication>(LOAN_APPLICATIONS_COLLECTION).countDocuments({
      'personalInfo.email': session.user.email
    });

    // Check for insurance applications
    const insuranceCount = await db.collection<InsuranceApplication>(INSURANCE_APPLICATIONS_COLLECTION).countDocuments({
      'basicInfo.email': session.user.email
    });

    const hasApplications = loanCount > 0 || insuranceCount > 0;

    return NextResponse.json({ 
      hasApplications,
      loanCount,
      insuranceCount 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error checking applications:', error);
    return NextResponse.json(
      { error: 'Failed to check applications', hasApplications: false },
      { status: 500 }
    );
  }
}
