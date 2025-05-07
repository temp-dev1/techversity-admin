"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LockIcon } from 'lucide-react';
import AdminAuthForm from '@/components/admin/auth-form';

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is already authenticated
    const session = localStorage.getItem('admin-session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        const timeNow = Date.now();
        // If session is valid and not expired (30 min timeout)
        if (sessionData.isAuthenticated && timeNow - sessionData.lastActivity < 30 * 60 * 1000) {
          router.push('/admin/dashboard');
        }
      } catch (error) {
        localStorage.removeItem('admin-session');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <LockIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>Enter password to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminAuthForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}