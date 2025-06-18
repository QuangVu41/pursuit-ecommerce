'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUrl } from '@/hooks/use-url';

const DateRangePicker = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const { router, pathname, searchParams } = useUrl();

  const handleSelectedDate = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    const params = new URLSearchParams(searchParams.toString());

    if (selectedDate?.from) {
      params.set('from', format(selectedDate.from, 'yyyy-MM-dd'));
    } else {
      params.delete('from');
    }

    if (selectedDate?.to) {
      params.set('to', format(selectedDate.to, 'yyyy-MM-dd'));
    } else {
      params.delete('to');
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn('justify-start text-left font-manrope', !date && 'text-muted-foreground')}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelectedDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
