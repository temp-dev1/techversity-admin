"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Enquiry } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon, MailIcon, PhoneIcon, SchoolIcon, BookOpenIcon, CheckCircleIcon, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EnquiryListProps {
  enquiries: Enquiry[];
  onDelete: (id: string) => void;
}

export default function EnquiryList({ enquiries, onDelete }: EnquiryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEnquiries = enquiries.filter(enquiry => 
    enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.phone.includes(searchTerm) ||
    (enquiry.college && enquiry.college.toLowerCase().includes(searchTerm.toLowerCase())) ||
    enquiry.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (enquiries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No enquiries found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search enquiries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Badge variant="secondary">
          {filteredEnquiries.length} {filteredEnquiries.length === 1 ? 'Enquiry' : 'Enquiries'}
        </Badge>
      </div>

      {filteredEnquiries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No matching enquiries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnquiries.map((enquiry) => (
            <Card key={enquiry._id} className="overflow-hidden">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">{enquiry.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(enquiry.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <MailIcon className="h-4 w-4 text-primary" />
                    <a href={`mailto:${enquiry.email}`} className="text-sm hover:underline">
                      {enquiry.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <PhoneIcon className="h-4 w-4 text-primary" />
                    <a href={`tel:${enquiry.phone}`} className="text-sm hover:underline">
                      {enquiry.phone}
                    </a>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <BookOpenIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{enquiry.courseTitle}</span>
                  </div>
                  
                  {enquiry.college && (
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                      <SchoolIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{enquiry.college}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <CheckCircleIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm flex items-center gap-2">
                      Terms Accepted
                      <Badge variant={enquiry.acceptTerms ? "default" : "destructive"}>
                        {enquiry.acceptTerms ? "Yes" : "No"}
                      </Badge>
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-muted/50 p-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="ml-auto">
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Delete Enquiry
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Enquiry</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this enquiry from {enquiry.name}? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(enquiry._id)}>
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