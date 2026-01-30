'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import type { ProcessedDocument, ChatMessage } from '@/lib/contexts/app-context';

interface ChatPanelProps {
  document: ProcessedDocument;
}

export default function ChatPanel({ document }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Explain in simpler terms',
    'What should I do next?',
    'Summarize in bullets',
    'What does this mean?',
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! Ask me any questions about the document. I can help explain terms, summarize sections, or provide more details.',
      timestamp: new Date(),
    },
  ]);

  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call - in production, this would call the backend
    setTimeout(() => {
      const responses: Record<string, string> = {
        default:
          "I understand your question. Based on the document content, I can provide more context and explanation. In a production environment, this would be powered by AI to analyze the specific document and provide relevant answers.",
        'Explain in simpler terms':
          'The main idea is that this document provides important information you need to know. The key points are written here to help you understand what you need to do.',
        'What should I do next?':
          'The next steps depend on your specific situation. Based on the document, you should carefully review all the requirements and gather the necessary documents or information mentioned.',
        'Summarize in bullets':
          '• Key Point 1: Important information from the document\n• Key Point 2: Action items you need to complete\n• Key Point 3: Timeline or deadlines to remember\n• Key Point 4: Where to go or contact for more help',
        'What does this mean?':
          'This refers to the important terms and concepts mentioned in the document. The document explains these in formal language, and I can help break them down into simpler everyday language that is easier to understand.',
      };

      const response = responses[textToSend] || responses.default;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Questions & Answers</CardTitle>
        <CardDescription className="text-xs">
          Ask about the document content
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 dark:bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg rounded-bl-none px-3 py-2">
                  <Loader2 className="w-4 h-4 text-slate-600 dark:text-slate-400 animate-spin" />
                </div>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 1 && !isLoading && (
          <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Suggestions:
            </p>
            <div className="grid grid-cols-2 gap-1">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSendMessage(question)}
                  disabled={isLoading}
                  className="text-xs p-1.5 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex gap-2">
          <Input
            placeholder="Ask about the document..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="text-sm h-9"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
            className="h-9 w-9 p-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
