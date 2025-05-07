import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth-utils';

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Skip auth for the actual auth endpoint
    if (req.nextUrl.pathname === '/api/admin/auth') {
      return handler(req);
    }
    
    if (!isAuthenticated(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return handler(req);
  };
}