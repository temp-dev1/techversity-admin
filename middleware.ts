import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/api/admin') && !path.includes('/api/admin/auth')) {
    const session = request.cookies.get('admin-session');
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    try {
      const sessionData = JSON.parse(session.value);
      const timeNow = Date.now();
      
      if (!sessionData.isAuthenticated || timeNow - sessionData.lastActivity > 30 * 60 * 1000) {
        return NextResponse.json(
          { success: false, message: 'Session expired' },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};