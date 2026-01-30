'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, Calendar, Globe, Trash2 } from 'lucide-react';
import { DOMAINS } from '@/lib/constants';
import type { DomainType } from '@/lib/types';

interface ProcessedDocument {
  id: string;
  title: string;
  date: Date;
  domain: DomainType;
  language: string;
  content: string;
}

interface HistoryPageProps {
  onBackToDashboard: () => void;
  documents?: ProcessedDocument[];
}

export default function HistoryPage({ onBackToDashboard, documents = [] }: HistoryPageProps) {
  const getDomainColor = (domain: DomainType) => {
    return domain === 'government' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Processing History</h1>
          <Button variant="outline" onClick={onBackToDashboard} className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {documents.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-slate-600 mb-4">No documents processed yet</p>
              <Button onClick={onBackToDashboard}>
                Start Processing Documents
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {doc.title}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className={getDomainColor(doc.domain)}>
                          {DOMAINS[doc.domain]}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {doc.language}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(doc.date)}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                        {doc.content}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
