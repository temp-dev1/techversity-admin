"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Testimonial } from '@/lib/types';
import TestimonialList from '@/components/admin/testimonial-list';
import TestimonialForm from '@/components/admin/testimonial-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LogOutIcon, ArrowLeftIcon, Loader2, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
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
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/testimonials');
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTestimonials(data);
      } else if (data.success === false) {
        throw new Error(data.message || 'Failed to fetch testimonials');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load testimonials';
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
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setTestimonials([...testimonials, data.testimonial]);
        toast({
          title: "Success",
          description: "Testimonial created successfully",
          variant: "default",
        });
      } else {
        throw new Error(data.message || 'Failed to create testimonial');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create testimonial';
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
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setTestimonials(testimonials.map(t => 
          t._id === id ? data.testimonial : t
        ));
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
          variant: "default",
        });
      } else {
        throw new Error(data.message || 'Failed to update testimonial');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update testimonial';
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
        body: JSON.stringify({ id, type: 'testimonial' }),
      });

      if (response.ok) {
        setTestimonials(testimonials.filter(testimonial => testimonial._id !== id));
        toast({
          title: "Successfully deleted",
          description: "The testimonial has been removed",
          variant: "default",
        });
      } else {
        toast({
          title: "Failed to delete",
          description: "Unable to delete the testimonial",
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
            <h1 className="text-2xl font-bold">Testimonials</h1>
          </div>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent>
                <TestimonialForm onSubmit={handleCreate} />
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
              onClick={fetchTestimonials} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <TestimonialList 
            testimonials={testimonials} 
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </main>
    </div>
  );
}