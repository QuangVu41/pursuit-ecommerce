'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dispatch, SetStateAction, useRef } from 'react';
import { PopoverClose } from '@radix-ui/react-popover';

interface DatePickerProps {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  placeholder?: string;
}

const DatePicker = ({ date, setDate, placeholder }: DatePickerProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal text-base font-manrope',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon />
          {date ? format(date, 'PPP') : <span>{placeholder || 'Pick a date'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          className='font-manrope'
          mode='single'
          selected={date}
          onSelect={(date) => {
            setDate(date);
            ref.current?.click();
          }}
          initialFocus
        />
        <PopoverClose asChild>
          <button ref={ref} hidden>
            Close
          </button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
