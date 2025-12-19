import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createHash } from 'crypto';

// Hash password using SHA-256
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // First, check if there's a custom password in the database
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const settings = await db.collection('adminSettings').findOne({ _id: 'main' } as any);
    
    const hashedInput = hashPassword(password);
    
    // Check database password first (if admin has set a custom password)
    if (settings?.adminPasswordHash) {
      if (hashedInput === settings.adminPasswordHash) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
      }
    }
    
    // Fallback to environment variable (for initial setup)
    const envPassword = process.env.ADMIN_PASSWORD;
    
    if (!envPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set and no custom password configured');
      return NextResponse.json({ 
        success: false, 
        error: 'Admin password not configured. Please set ADMIN_PASSWORD in environment variables.' 
      }, { status: 500 });
    }
    
    if (password === envPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
