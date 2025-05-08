"use client";

import { useState } from 'react';
import { Course } from '@/lib/models/course';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon, PencilIcon, ClockIcon, BookIcon, StarIcon, UsersIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import CourseForm from './course-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface CourseListProps {
  courses: Course[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: FormData) => void;
}

export default function CourseList({ courses, onDelete, onUpdate }: CourseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No courses found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Badge variant="secondary">
          {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
        </Badge>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No matching courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id.toString()} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{course.title}</CardTitle>
                <Badge>{course.category}</Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <StarIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{course.rating} ({course.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <ClockIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <BookIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{course.level}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <UsersIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{course.mentors.length} Mentors</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">₹{course.discountedPrice}</span>
                    <span className="text-lg line-through text-muted-foreground">₹{course.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Next Batch: {new Date(course.nextBatch).toLocaleDateString()}
                  </p>
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
                  <DialogContent className="max-w-4xl">
                    <CourseForm
                      course={course}
                      onSubmit={(data) => onUpdate(course.id.toString(), data)}
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
                      <AlertDialogTitle>Delete Course</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {course.title}? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(course.id.toString())}>
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
