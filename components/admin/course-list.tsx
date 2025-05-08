"use client";

import { useState } from 'react';
import { Course } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon, PencilIcon, StarIcon, ClockIcon, BookIcon, UsersIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CourseListProps {
  courses: Course[];
  onDelete: (id: string) => void;
}

export default function CourseList({ courses, onDelete }: CourseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  
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

  const handleEditClick = (courseId: string) => {
    router.push(`/admin/dashboard/courses/${courseId}`);
  };

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
            <Card key={course._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{course.title}</CardTitle>
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
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">{course.rating} ({course.reviews} reviews)</span>
                    </div>
                    <Badge>{course.category}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                      <ClockIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                      <BookIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{course.level}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <UsersIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm">Next Batch: {new Date(course.nextBatch).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">₹{course.discountedPrice}</span>
                    {course.price !== course.discountedPrice && (
                      <span className="text-lg text-muted-foreground line-through">₹{course.price}</span>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-muted/50 p-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditClick(course._id)}
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </Button>

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
                      <AlertDialogAction onClick={() => onDelete(course._id)}>
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
