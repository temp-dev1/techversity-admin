"use client";

import { useState } from 'react';
import { CertPartner } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface CertPartnerFormProps {
  certPartner?: CertPartner;
  onSubmit: (data: FormData) => void;
}

export default function CertPartnerForm({ certPartner, onSubmit }: CertPartnerFormProps) {
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
        <Label htmlFor="name">Partner Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={certPartner?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Partner Logo</Label>
        {certPartner?.logo && (
          <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
            <Image
              src={certPartner.logo}
              alt="Current partner logo"
              fill
              className="object-contain"
            />
          </div>
        )}
        <Input
          id="logo"
          name="logo"
          type="file"
          accept="image/*"
          required={!certPartner}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {certPartner ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          certPartner ? 'Update Certification Partner' : 'Create Certification Partner'
        )}
      </Button>
    </form>
      </ScrollArea>
  );
}
