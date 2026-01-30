'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import type { Language } from '@/lib/types';

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function LanguageSelector({
  value,
  onValueChange,
  label = 'Target Language',
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="language-select" className="text-sm font-medium">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id="language-select" className="w-full">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((lang: Language) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
