'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useApp } from '@/lib/contexts/app-context';
import { formatDistanceToNow } from 'date-fns';
import { Search, Trash2, Eye, Download } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function HistoryPage() {
  const { documents, removeDocument, setCurrentDocument } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.includes(searchQuery);
    const matchesDomain = filterDomain === 'all' || doc.domain === filterDomain;
    const matchesLanguage = filterLanguage === 'all' || doc.language === filterLanguage;

    return matchesSearch && matchesDomain && matchesLanguage;
  });

  const handleDelete = (id: string) => {
    removeDocument(id);
    toast.success('Document deleted');
  };

  const handleView = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      setCurrentDocument(doc);
      toast.success('Document loaded');
    }
  };

  const handleDownload = (doc: any) => {
    const content = `
Original Text:
${doc.originalText}

Translated Text:
${doc.translatedText}

Simplified Text:
${doc.simplifiedText}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', `docaccess-${doc.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Document downloaded');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Processing History
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View and manage your previously processed documents
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {documents.length === 0 ? (
          <Card className="flex items-center justify-center">
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📋</div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                No History Yet
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Your processed documents will appear here
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Domain Filter */}
                  <Select value={filterDomain} onValueChange={setFilterDomain}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domains</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Language Filter */}
                  <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredDocuments.length} of {documents.length} documents
            </p>

            {/* Documents List */}
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-2 pr-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{doc.domain}</Badge>
                            <Badge variant="secondary">{doc.language.toUpperCase()}</Badge>
                          </div>
                          <p className="font-semibold text-slate-900 dark:text-slate-50 line-clamp-2">
                            {doc.originalText.slice(0, 100)}...
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {formatDistanceToNow(doc.timestamp, { addSuffix: true })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(doc.id)}
                            aria-label="View document"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            aria-label="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                aria-label="Delete document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this document? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="flex justify-end gap-4">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(doc.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
