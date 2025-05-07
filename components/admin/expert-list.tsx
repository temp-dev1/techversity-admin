"use client";

import { useState } from 'react';
import { Expert } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon, PencilIcon, BuildingIcon, BriefcaseIcon, LinkedinIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import ExpertForm from './expert-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ExpertListProps {
  experts: Expert[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: FormData) => void;
}

export default function ExpertList({ experts, onDelete, onUpdate }: ExpertListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredExperts = experts.filter(expert => 
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (experts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No experts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search experts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Badge variant="secondary">
          {filteredExperts.length} {filteredExperts.length === 1 ? 'Expert' : 'Experts'}
        </Badge>
      </div>

      {filteredExperts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No matching experts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <Card key={expert._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{expert.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <BriefcaseIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{expert.role}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <BuildingIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{expert.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <span className="text-sm">{expert.experience} Years Experience</span>
                  </div>
                  
                  <div className="h-12 relative rounded-md overflow-hidden bg-muted/50">
                    <Image
                      src={expert.companyLogo}
                      alt={expert.company}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  
                  <a 
                    href={expert.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-muted/50 p-2 rounded-md hover:bg-muted"
                  >
                    <LinkedinIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">LinkedIn Profile</span>
                  </a>
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
                    <ExpertForm
                      expert={expert}
                      onSubmit={(data) => onUpdate(expert._id, data)}
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
                      <AlertDialogTitle>Delete Expert</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {expert.name}? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(expert._id)}>
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