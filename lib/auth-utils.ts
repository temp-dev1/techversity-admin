import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export function isAuthenticated(req: NextRequest) {
  const sessionCookie = req.cookies.get('admin-session');
  
  if (!sessionCookie) {
    return false;
  }
  
  try {
    const session = JSON.parse(sessionCookie.value);
    const timeNow = Date.now();
    
    // If session is valid and not expired (30 min timeout)
    return session.isAuthenticated && 
           timeNow - session.lastActivity < 30 * 60 * 1000;
  } catch (error) {
    return false;
  }
}

export function getAuthCookie() {
  return cookies().get('admin-session');
}

export function clearAuthCookie() {
  cookies().delete('admin-session');
}