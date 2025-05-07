"use client";

import { useState } from 'react';
import { CertPartner } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon, PencilIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import CertPartnerForm from './certpartner-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface CertPartnerListProps {
  certPartners: CertPartner[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: FormData) => void;
}

export default function CertPartnerList({ certPartners, onDelete, onUpdate }: CertPartnerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCertPartners = certPartners.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (certPartners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No certification partners found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search certification partners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Badge variant="secondary">
          {filteredCertPartners.length} {filteredCertPartners.length === 1 ? 'Partner' : 'Partners'}
        </Badge>
      </div>

      {filteredCertPartners.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No matching certification partners found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertPartners.map((partner) => (
            <Card key={partner._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{partner.name}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-muted/50 p-4 flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <CertPartnerForm
                      certPartner={partner}
                      onSubmit={(data) => onUpdate(partner._id, data)}
                    />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Certification Partner</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {partner.name}? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(partner._id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}