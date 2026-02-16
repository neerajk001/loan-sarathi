import clientPromise from './mongodb';

// Admin settings collection name
const SETTINGS_COLLECTION = 'adminSettings';

// Default admin emails - fallback if database doesn't have any
const DEFAULT_ADMIN_EMAILS = [
  'admin@smartsolutionsmumbai.com',
  'shashichanyal@gmail.com',
  'pratik@smartsolutionsmumbai.com',
  'neerajkushwaha0401@gmail.com',
  'workwithneeraj.01@gmail.com',
];

/**
 * Get admin emails from database or fallback to defaults
 * @returns Promise<string[]> - Array of admin email addresses
 */
export async function getAdminEmails(): Promise<string[]> {
  // Always include default admin emails
  const defaultEmails = DEFAULT_ADMIN_EMAILS.map(email => email.toLowerCase().trim());

  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const settings = await db.collection(SETTINGS_COLLECTION).findOne({ _id: 'main' } as any);

    if (settings?.settings?.adminEmails && Array.isArray(settings.settings.adminEmails)) {
      // Normalize all emails to lowercase and trim whitespace
      const dbEmails = settings.settings.adminEmails
        .map((email: string) => email.toLowerCase().trim())
        .filter((email: string) => email.length > 0);

      // Merge default emails with database emails (remove duplicates)
      const allEmails = [...new Set([...defaultEmails, ...dbEmails])];
      return allEmails;
    }

    return defaultEmails;
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return defaultEmails;
  }
}

/**
 * Update admin emails in database
 * @param emails - Array of email addresses
 * @returns Promise<boolean> - Success status
 */
export async function updateAdminEmails(emails: string[]): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const normalizedEmails = emails
      .map(email => email.toLowerCase().trim())
      .filter(email => email.length > 0);

    await db.collection(SETTINGS_COLLECTION).updateOne(
      { _id: 'main' } as any,
      { 
        $set: { 
          'settings.adminEmails': normalizedEmails,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return true;
  } catch (error) {
    console.error('Error updating admin emails:', error);
    return false;
  }
}

/**
 * Check if an email is an admin email
 * @param email - Email to check
 * @returns Promise<boolean> - True if email is an admin
 */
export async function isAdminEmail(email: string): Promise<boolean> {
  const adminEmails = await getAdminEmails();
  const normalizedEmail = email.toLowerCase().trim();
  return adminEmails.some(adminEmail => adminEmail === normalizedEmail);
}
