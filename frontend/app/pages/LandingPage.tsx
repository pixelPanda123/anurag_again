'use client';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FileText, Mic, MessageSquare, Languages, FileImage, ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
}

export default function LandingPage({ onNavigateToDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <FileText className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">DocAccess</h1>
          </div>
          <Button onClick={onNavigateToDashboard} size="lg">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Understand Government & Medical Documents in Your Language
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Upload documents, speak in your language, and get simplified explanations instantly. Break language barriers for critical government orders, medical reports, and legal documents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button onClick={onNavigateToDashboard} size="lg" className="flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Upload Document
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button onClick={onNavigateToDashboard} variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                <Mic className="w-5 h-5" />
                Try Voice Input
              </Button>
            </div>

            {/* Trust signals */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Supports 16+ languages and regional dialects</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Government and medical domain expertise</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Zap className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Instant processing with voice output</span>
              </div>
            </div>
          </div>

          {/* Visual mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl" />
            <div className="bg-white rounded-xl shadow-2xl p-8 border border-slate-200">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <FileImage className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Drag and drop your document</p>
                  <p className="text-sm text-slate-500">or click to browse</p>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-slate-200 rounded-full" />
                  <div className="h-2 bg-slate-200 rounded-full w-5/6" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Translation</span>
                  <Languages className="w-4 h-4 text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Simplification</span>
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 sm:py-32 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A simple, four-step process to understand any government or medical document
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Upload or Speak',
                description: 'Upload a document image or speak into your device. Supports images, scanned documents, and voice.',
                icon: FileImage,
              },
              {
                step: '2',
                title: 'Extract Text',
                description: 'Advanced OCR technology digitizes scanned documents and transcribes voice input into text.',
                icon: FileText,
              },
              {
                step: '3',
                title: 'Translate & Simplify',
                description: 'Translate to your language and simplify complex government/medical terminology into everyday language.',
                icon: Languages,
              },
              {
                step: '4',
                title: 'Listen & Understand',
                description: 'Read the simplified text or listen to it in your language with natural voice synthesis.',
                icon: Mic,
              },
            ].map(({ step, title, description, icon: Icon }) => (
              <Card key={step} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-blue-700 font-bold">{step}</span>
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Built for Accessibility</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Designed with accessibility-first principles to ensure everyone can access critical information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Voice-First Design',
                description: 'Full voice input and output support. No typing required. Ideal for low-literacy users.',
              },
              {
                title: 'Multiple Formats',
                description: 'Accept documents as images, PDFs, spoken text, or typed input. Process them all.',
              },
              {
                title: 'Regional Languages',
                description: 'Support for Indian regional languages, dialects, and minority languages.',
              },
              {
                title: 'Medical Expertise',
                description: 'Specialized knowledge for medical terms, diseases, treatments, and procedures.',
              },
              {
                title: 'Government Documents',
                description: 'Deep understanding of government orders, policies, schemes, and legal terminology.',
              },
              {
                title: 'Offline Ready',
                description: 'Works with or without internet. No data is stored on servers.',
              },
            ].map((feature, idx) => (
              <Card key={idx} className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Access Documents in Your Language?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start uploading documents or using voice input right now. No signup required for demo.
          </p>
          <Button onClick={onNavigateToDashboard} size="lg" variant="secondary" className="flex items-center gap-2 mx-auto">
            Open Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={onNavigateToDashboard} className="hover:text-white transition">Dashboard</button></li>
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Languages</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <FileText className="text-white w-4 h-4" />
                </div>
                <span className="font-semibold text-white">DocAccess</span>
              </div>
              <p className="text-sm text-slate-400">
                © 2024 Document Accessibility System. Built for social impact.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
