'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { DOMAINS } from '@/lib/constants';
import type { DomainType } from '@/lib/types';

interface DomainSelectorProps {
  value: DomainType;
  onValueChange: (value: DomainType) => void;
  disabled?: boolean;
}

export default function DomainSelector({
  value,
  onValueChange,
  disabled = false,
}: DomainSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="domain-select" className="text-sm font-medium">
        Document Type
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id="domain-select" className="w-full">
          <SelectValue placeholder="Select document type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(DOMAINS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
