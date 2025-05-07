"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOutIcon, DatabaseIcon, ClipboardListIcon, UsersIcon, AwardIcon, BuildingIcon, MessageSquareIcon, BookOpenIcon, UploadIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    
    if (!session) {
      router.push('/admin');
      return;
    }
    
    try {
      const sessionData = JSON.parse(session);
      const timeNow = Date.now();
      
      if (!sessionData.isAuthenticated || timeNow - sessionData.lastActivity > 30 * 60 * 1000) {
        localStorage.removeItem('admin-session');
        router.push('/admin');
      }
    } catch (error) {
      localStorage.removeItem('admin-session');
      router.push('/admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-session');
    router.push('/admin');
  };

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to trigger deployment');
      }

      toast({
        title: "Deployment Started",
        description: "Your site is being updated. This may take a few minutes.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Failed to trigger deployment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCardClick = (type: 'queries' | 'enquiries' | 'partners' | 'certpartners' | 'testimonials' | 'experts' | 'courses') => {
    router.push(`/admin/dashboard/${type}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              {isDeploying ? 'Deploying...' : 'Submit to Site'}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('queries')}
          >
            <CardContent className="flex flex-col items-center justify-center p-12">
              <DatabaseIcon className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold">Queries</h2>
              <p className="text-muted-foreground mt-2">View and manage queries</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('enquiries')}
          >
            <CardContent className="flex flex-col items-center justify-center p-12">
              <ClipboardListIcon className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold">Inquiries</h2>
              <p className="text-muted-foreground mt-2">View and manage inquiries</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('partners')}
          >
            <CardContent className="flex flex-col items-center justify-center p-12">
              <BuildingIcon className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold">Partners</h2>
              <p className="text-muted-foreground mt-2">Manage partner organizations</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('certpartners')}
          >
            <CardContent className="flex flex-col items-center justify-center p-12">
              <AwardIcon className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold">Certification Partners</h2>
              <p className="text-muted-foreground mt-2">Manage certification partners</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('testimonials')}
          >
            <CardContent className="flex flex-col items-center justify-center p-12">
              <MessageSquareIcon className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold">Testimonials</h2>
              <p className="text-muted-foreground mt-2">Manage student testimonials</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('experts')}
          >
            <CardContent className="flex flex-col items-center justify-center p-12">
              <UsersIcon className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold">Experts</h2>
              <p className="text-muted-foreground mt-2">Manage industry experts</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick('courses')}
          >
            <CardContent className="flex flex-col items-center justify-center p-12">
              <BookOpenIcon className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold">Courses</h2>
              <p className="text-muted-foreground mt-2">Manage course catalog</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}