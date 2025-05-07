"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Query } from '@/lib/types';
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger, Button, Badge, Input
} from '@/components/ui';
import { Trash2Icon, MailIcon, PhoneIcon, MessageSquareIcon, CalendarIcon } from 'lucide-react';

interface QueryListProps {
  onDelete: (id: string) => void;
}

export default function QueryList({ onDelete }: QueryListProps) {
  const [queries, setQueries] = useState<Query[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQueries = async () => {
    try {
      const res = await fetch('/api/queries');
      const data = await res.json();
      setQueries(data);
    } catch (err) {
      console.error('Failed to fetch queries:', err);
    }
  };

  useEffect(() => {
    fetchQueries(); // initial fetch
    const interval = setInterval(fetchQueries, 5000); // every 5s
    return () => clearInterval(interval); // cleanup
  }, []);

  const filteredQueries = queries.filter(query =>
    query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.phone.includes(searchTerm) ||
    query.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Badge variant="secondary">
          {filteredQueries.length} {filteredQueries.length === 1 ? 'Query' : 'Queries'}
        </Badge>
      </div>

      {filteredQueries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No matching queries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQueries.map((query) => (
            <Card key={query._id} className="overflow-hidden">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">{query.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(query.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <MailIcon className="h-4 w-4 text-primary" />
                    <a href={`mailto:${query.email}`} className="text-sm hover:underline">
                      {query.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                    <PhoneIcon className="h-4 w-4 text-primary" />
                    <a href={`tel:${query.phone}`} className="text-sm hover:underline">
                      {query.phone}
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Message</span>
                  </div>
                  <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {query.message}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="border-t bg-muted/50 p-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="ml-auto">
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Delete Query
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Query</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this query from {query.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(query._id)}>
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
