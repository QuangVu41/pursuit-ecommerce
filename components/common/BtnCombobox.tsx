'use client';

import { Check, ChevronsUpDown, ScrollText } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUrl } from '@/hooks/use-url';
import { useState } from 'react';

interface BtnComboboxProps {
  items: { id: string; name: string }[];
  inputText: string;
}

const BtnCombobox = ({ items, inputText }: BtnComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const { router, pathname, searchParams } = useUrl();

  const handleValueChange = (currentValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const newValue = currentValue === value ? '' : currentValue;
    setValue(newValue);
    setOpen(false);

    if (newValue) {
      params.set('item', newValue);
    } else {
      params.delete('item');
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('justify-between capitalize', !value && 'text-muted-foreground')}
        >
          <ScrollText className='opacity-50' />
          {value ? items.find((item) => item.name === value)?.name : inputText}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={inputText} className='h-9' />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={(currentValue) => {
                    handleValueChange(currentValue);
                  }}
                  className='capitalize'
                >
                  {item.name}
                  <Check className={cn('ml-auto', value === item.name ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BtnCombobox;
