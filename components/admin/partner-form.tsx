"use client";

import { useState } from 'react';
import { Partner } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface PartnerFormProps {
  partner?: Partner;
  onSubmit: (data: FormData) => void;
}

export default function PartnerForm({ partner, onSubmit }: PartnerFormProps) {
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
          defaultValue={partner?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Partner Logo</Label>
        {partner?.logo && (
          <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
            <Image
              src={partner.logo}
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
          required={!partner}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {partner ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          partner ? 'Update Partner' : 'Create Partner'
        )}
      </Button>
    </form>
      </ScrollArea>
  );
}
