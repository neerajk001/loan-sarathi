import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createHash } from 'crypto';

// Hash password using SHA-256
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// POST /api/admin/password - Change admin password
export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection('adminSettings');
    
    const settings = await collection.findOne({ _id: 'main' } as any);
    
    // Verify current password
    const hashedCurrentInput = hashPassword(currentPassword);
    let isCurrentPasswordValid = false;
    
    if (settings?.adminPasswordHash) {
      // Check against stored hash
      isCurrentPasswordValid = hashedCurrentInput === settings.adminPasswordHash;
    } else {
      // Check against environment variable (for first-time password change)
      const envPassword = process.env.ADMIN_PASSWORD;
      if (envPassword) {
        isCurrentPasswordValid = currentPassword === envPassword;
      }
    }
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }
    
    // Hash and store the new password
    const newPasswordHash = hashPassword(newPassword);
    
    await collection.updateOne(
      { _id: 'main' } as any,
      {
        $set: {
          adminPasswordHash: newPasswordHash,
          passwordUpdatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
