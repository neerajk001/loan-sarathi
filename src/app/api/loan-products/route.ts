import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { apiCache, CACHE_TTL } from '@/lib/cache';

const LOAN_PRODUCTS_COLLECTION = 'loanProducts';

// Cache key for loan products
const CACHE_KEY_ALL = 'loan_products:all';
const CACHE_KEY_PREFIX = 'loan_products:';

interface LoanProduct {
  _id: string;
  slug: string;
  title: string;
  maxAmount: string;
  interestRate: string;
  updatedAt?: Date;
  updatedBy?: string;
}

const DEFAULT_LOAN_PRODUCTS = [
  {
    slug: 'personal-loan',
    title: 'Personal Loan',
    maxAmount: 'Loans up to ₹50 Lakhs',
    interestRate: 'Interest rates starting @ 10.49% p.a.',
  },
  {
    slug: 'business-loan',
    title: 'Business Loan',
    maxAmount: 'Loans up to ₹2 Crores',
    interestRate: 'Interest rates starting @ 14.00% p.a.',
  },
  {
    slug: 'home-loan',
    title: 'Home Loan',
    maxAmount: 'Loans up to ₹5 Crores',
    interestRate: 'Low interest rates starting @ 7.15% p.a.',
  },
  {
    slug: 'loan-against-property',
    title: 'Loan Against Property',
    maxAmount: 'Loans up to 70%',
    interestRate: 'Interest rates starting @ 8.75% p.a.',
  },
  {
    slug: 'education-loan',
    title: 'Education Loan',
    maxAmount: 'Loans up to ₹2 Crores',
    interestRate: 'Interest rates starting @ 9.50% p.a.',
  },
  {
    slug: 'car-loan',
    title: 'Car Loan',
    maxAmount: 'Loans up to 90%',
    interestRate: 'Interest rates starting @ 8.50% p.a.',
  },
];

// GET /api/loan-products - Get all loan products or a specific one
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // Generate cache key
    const cacheKey = slug ? `${CACHE_KEY_PREFIX}${slug}` : CACHE_KEY_ALL;

    // Check cache first
    const cachedData = apiCache.get<any>(cacheKey);
    if (cachedData) {
      const response = NextResponse.json(cachedData);
      response.headers.set('X-Cache', 'HIT');
      return response;
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<LoanProduct>(LOAN_PRODUCTS_COLLECTION);

    if (slug) {
      // Get specific loan product
      const product = await collection.findOne({ slug });
      let responseData;

      if (product) {
        responseData = {
          success: true,
          product: {
            maxAmount: product.maxAmount,
            interestRate: product.interestRate,
          },
        };
      } else {
        // Return default if not found in DB
        const defaultProduct = DEFAULT_LOAN_PRODUCTS.find(p => p.slug === slug);
        if (defaultProduct) {
          responseData = {
            success: true,
            product: {
              maxAmount: defaultProduct.maxAmount,
              interestRate: defaultProduct.interestRate,
            },
          };
        } else {
          return NextResponse.json(
            { success: false, error: 'Loan product not found' },
            { status: 404 }
          );
        }
      }

      // Cache the response
      apiCache.set(cacheKey, responseData, CACHE_TTL.MEDIUM);

      const response = NextResponse.json(responseData);
      response.headers.set('X-Cache', 'MISS');
      return response;
    } else {
      // Get all loan products
      const products = await collection.find({}).toArray();

      // Merge with defaults for any missing products
      const allProducts = DEFAULT_LOAN_PRODUCTS.map(defaultProduct => {
        const dbProduct = products.find(p => p.slug === defaultProduct.slug);
        return {
          slug: defaultProduct.slug,
          title: defaultProduct.title,
          maxAmount: dbProduct?.maxAmount || defaultProduct.maxAmount,
          interestRate: dbProduct?.interestRate || defaultProduct.interestRate,
        };
      });

      const responseData = {
        success: true,
        products: allProducts,
      };

      // Cache the response
      apiCache.set(cacheKey, responseData, CACHE_TTL.MEDIUM);

      const response = NextResponse.json(responseData);
      response.headers.set('X-Cache', 'MISS');
      return response;
    }
  } catch (error) {
    console.error('Error fetching loan products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/loan-products - Update loan product details (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, maxAmount, interestRate } = body;

    if (!slug || !maxAmount || !interestRate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: slug, maxAmount, interestRate' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<LoanProduct>(LOAN_PRODUCTS_COLLECTION);

    // Find the default product to get the title
    const defaultProduct = DEFAULT_LOAN_PRODUCTS.find(p => p.slug === slug);
    if (!defaultProduct) {
      return NextResponse.json(
        { success: false, error: 'Invalid loan product slug' },
        { status: 400 }
      );
    }

    // Update or insert the product
    await collection.updateOne(
      { slug },
      {
        $set: {
          slug,
          title: defaultProduct.title,
          maxAmount,
          interestRate,
          updatedAt: new Date(),
          updatedBy: 'admin@loansarathi.com',
        },
      },
      { upsert: true }
    );

    // Invalidate loan products cache
    apiCache.deletePattern('loan_products');

    return NextResponse.json({
      success: true,
      message: 'Loan product updated successfully',
      product: {
        slug,
        title: defaultProduct.title,
        maxAmount,
        interestRate,
      },
    });
  } catch (error) {
    console.error('Error updating loan product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

