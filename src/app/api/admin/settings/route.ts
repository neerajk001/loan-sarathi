import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';

const SETTINGS_COLLECTION = 'adminSettings';
const DEFAULT_SETTINGS = {
  emailNotifications: {
    newApplication: true,
    newConsultancy: true,
    statusUpdate: true,
  },
  adminEmails: ['workwithneeraj.01@gmail.com', 'shashichanyal@gmail.com'],
  systemSettings: {
    maintenanceMode: false,
    allowPublicApplications: true,
  },
};

interface AdminSettings {
  _id: string;
  settings: typeof DEFAULT_SETTINGS;
  updatedAt?: Date;
  updatedBy?: string;
}

// GET /api/admin/settings - Get current settings
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<AdminSettings>(SETTINGS_COLLECTION);
    
    const settings = await collection.findOne({ _id: 'main' } as any);
    
    return NextResponse.json({
      success: true,
      settings: settings?.settings || DEFAULT_SETTINGS,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings - Update settings
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<AdminSettings>(SETTINGS_COLLECTION);
    
    // Validate admin emails
    if (body.adminEmails && Array.isArray(body.adminEmails)) {
      // Ensure at least one admin email
      if (body.adminEmails.length === 0) {
        return NextResponse.json(
          { success: false, error: 'At least one admin email is required' },
          { status: 400 }
        );
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of body.adminEmails) {
        if (!emailRegex.test(email)) {
          return NextResponse.json(
            { success: false, error: `Invalid email format: ${email}` },
            { status: 400 }
          );
        }
      }
    }
    
    // Merge with existing settings
    const existing = await collection.findOne({ _id: 'main' } as any);
    const mergedSettings = {
      ...DEFAULT_SETTINGS,
      ...(existing?.settings || {}),
      ...body,
    };
    
    // Update or insert settings
    await collection.updateOne(
      { _id: 'main' } as any,
      {
        $set: {
          settings: mergedSettings,
          updatedAt: new Date(),
          updatedBy: session.user.email || 'unknown',
        },
      },
      { upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: mergedSettings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

