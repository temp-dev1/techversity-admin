"use client";

import { useState } from 'react';
import { Testimonial } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface TestimonialFormProps {
  testimonial?: Testimonial;
  onSubmit: (data: FormData) => void;
}

export default function TestimonialForm({ testimonial, onSubmit }: TestimonialFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
    
    setIsLoading(false);
  };

  return (
    <ScrollArea className="h-[80vh] pr-4">
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={testimonial?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          name="role"
          defaultValue={testimonial?.role}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          defaultValue={testimonial?.company}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="course">Course</Label>
        <Input
          id="course"
          name="course"
          defaultValue={testimonial?.course}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="testimonial">Testimonial</Label>
        <Textarea
          id="testimonial"
          name="testimonial"
          defaultValue={testimonial?.testimonial}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Profile Image</Label>
        {testimonial?.image && (
          <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
            <Image
              src={testimonial.image}
              alt="Current profile image"
              fill
              className="object-cover"
            />
          </div>
        )}
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required={!testimonial}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {testimonial ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          testimonial ? 'Update Testimonial' : 'Create Testimonial'
        )}
      </Button>
    </form>
      </ScrollArea>
  );
}
