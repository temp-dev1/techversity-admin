"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CertPartner } from '@/lib/types';
import CertPartnerList from '@/components/admin/certpartner-list';
import CertPartnerForm from '@/components/admin/certpartner-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LogOutIcon, ArrowLeftIcon, Loader2, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CertPartnersPage() {
  const [certPartners, setCertPartners] = useState<CertPartner[]>([]);
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
    fetchCertPartners();
  }, []);

  const fetchCertPartners = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/certpartners');
      if (!response.ok) {
        throw new Error('Failed to fetch certification partners');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setCertPartners(data);
      } else if (data.success === false) {
        throw new Error(data.message || 'Failed to fetch certification partners');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load certification partners';
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
      const response = await fetch('/api/admin/certpartners', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setCertPartners([...certPartners, data.certPartner]);
        toast({
          title: "Success",
          description: "Certification partner created successfully",
          variant: "default",
        });
      } else {
        throw new Error(data.message || 'Failed to create certification partner');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create certification partner';
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
      const response = await fetch('/api/admin/certpartners', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setCertPartners(certPartners.map(p => 
          p._id === id ? data.certPartner : p
        ));
        toast({
          title: "Success",
          description: "Certification partner updated successfully",
          variant: "default",
        });
      } else {
        throw new Error(data.message || 'Failed to update certification partner');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update certification partner';
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
        body: JSON.stringify({ id, type: 'certpartner' }),
      });

      if (response.ok) {
        setCertPartners(certPartners.filter(partner => partner._id !== id));
        toast({
          title: "Successfully deleted",
          description: "The certification partner has been removed",
          variant: "default",
        });
      } else {
        toast({
          title: "Failed to delete",
          description: "Unable to delete the certification partner",
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
            <h1 className="text-2xl font-bold">Certification Partners</h1>
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
                <CertPartnerForm onSubmit={handleCreate} />
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
              onClick={fetchCertPartners} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <CertPartnerList 
            certPartners={certPartners} 
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </main>
    </div>
  );
}