"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Partner } from '@/lib/types';
import PartnerList from '@/components/admin/partner-list';
import PartnerForm from '@/components/admin/partner-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LogOutIcon, ArrowLeftIcon, Loader2, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

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

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/partners');
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setPartners(data);
      } else if (data.success === false) {
        throw new Error(data.message || 'Failed to fetch partners');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load partners';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (formData: FormData) => {
    try {
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPartners([...partners, data.partner]);
        toast({
          title: "Success",
          description: "Partner created successfully",
          variant: "default",
        });
      } else {
        throw new Error(data.message || 'Failed to create partner');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create partner';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      formData.append('id', id);
      const response = await fetch('/api/admin/partners', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPartners(partners.map(p => 
          p._id === id ? data.partner : p
        ));
        toast({
          title: "Success",
          description: "Partner updated successfully",
          variant: "default",
        });
      } else {
        throw new Error(data.message || 'Failed to update partner');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update partner';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'partner' }),
      });

      if (response.ok) {
        setPartners(partners.filter(partner => partner._id !== id));
        toast({
          title: "Successfully deleted",
          description: "The partner has been removed",
          variant: "default",
        });
      } else {
        toast({
          title: "Failed to delete",
          description: "Unable to delete the partner",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-session');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Partners</h1>
          </div>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </DialogTrigger>
              <DialogContent>
                <PartnerForm onSubmit={handleCreate} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-destructive">{error}</p>
            <Button 
              variant="outline" 
              onClick={fetchPartners} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <PartnerList 
            partners={partners} 
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </main>
    </div>
  );
}