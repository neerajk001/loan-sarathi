import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Assuming you have an 'applications' collection
    // For now, we'll return mock data if collection is empty
    const applications = await db.collection('applications').find({}).toArray();

    if (applications.length === 0) {
       // Return mock data for the UI to show something
       return NextResponse.json([
         { id: 1, name: 'John Doe', loanType: 'Personal', amount: 500000, status: 'Pending', date: new Date() },
         { id: 2, name: 'Jane Smith', loanType: 'Home', amount: 2500000, status: 'Verified', date: new Date() },
       ]);
    }

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

