"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/lib/types';
import CourseForm from '@/components/admin/course-form';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UpdateCoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch course details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    try {
      formData.append('id', params.id);
      const response = await fetch('/api/admin/courses', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Course updated successfully",
          variant: "default",
        });
        router.push('/admin/dashboard/courses');
      } else {
        throw new Error(data.message || 'Failed to update course');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update course';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-lg text-destructive">Course not found</p>
          <Button onClick={() => router.push('/admin/dashboard/courses')}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/admin/dashboard/courses')}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Update Course</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <CourseForm course={course} onSubmit={handleUpdate} />
      </main>
    </div>
  );
}
