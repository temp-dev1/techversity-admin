"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Testimonial } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon, PencilIcon, BuildingIcon, GraduationCapIcon, BriefcaseIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import TestimonialForm from './testimonial-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface TestimonialListProps {
  testimonials: Testimonial[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: FormData) => void;
}

export default function TestimonialList({ testimonials, onDelete, onUpdate }: TestimonialListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTestimonials = testimonials.filter(testimonial => 
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No testimonials found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search testimonials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Badge variant="secondary">
          {filteredTestimonials.length} {filteredTestimonials.length === 1 ? 'Testimonial' : 'Testimonials'}
        </Badge>
      </div>

      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No matching testimonials found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial._id} className="overflow-hidden">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">{testimonial.name}</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <BriefcaseIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{testimonial.role}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <BuildingIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{testimonial.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <GraduationCapIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{testimonial.course}</span>
                  </div>
                  
                  <div className="bg-muted/50 p-2 rounded-md">
                    <p className="text-sm italic">"{testimonial.testimonial}"</p>
                  </div>
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
                  <DialogContent className="sm:max-w-[425px]">
                    <TestimonialForm
                      testimonial={testimonial}
                      onSubmit={(data) => onUpdate(testimonial._id, data)}
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
                      <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this testimonial from {testimonial.name}? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(testimonial._id)}>
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