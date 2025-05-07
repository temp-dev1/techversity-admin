"use client";

import { useState } from 'react';
import { Expert } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ExpertFormProps {
  expert?: Expert;
  onSubmit: (data: FormData) => void;
}

export default function ExpertForm({ expert, onSubmit }: ExpertFormProps) {
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
          defaultValue={expert?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          name="role"
          defaultValue={expert?.role}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          defaultValue={expert?.company}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Experience</Label>
        <Input
          id="experience"
          name="experience"
          defaultValue={expert?.experience}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile</Label>
        <Input
          id="linkedin"
          name="linkedin"
          type="url"
          defaultValue={expert?.linkedin}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Profile Image</Label>
        {expert?.image && (
          <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
            <Image
              src={expert.image}
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
          required={!expert}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyLogo">Company Logo</Label>
        {expert?.companyLogo && (
          <div className="relative w-full h-20 mb-4 rounded-lg overflow-hidden">
            <Image
              src={expert.companyLogo}
              alt="Current company logo"
              fill
              className="object-contain"
            />
          </div>
        )}
        <Input
          id="companyLogo"
          name="companyLogo"
          type="file"
          accept="image/*"
          required={!expert}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {expert ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          expert ? 'Update Expert' : 'Create Expert'
        )}
      </Button>
    </form>
    </ScrollArea>
  );
}
