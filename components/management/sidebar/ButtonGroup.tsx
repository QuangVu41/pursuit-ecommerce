import { Button } from '@/components/ui/button';
import ToggleDark from '@/components/common/ToggleDark';
import { Bell } from 'lucide-react';

const ButtonGroup = () => {
  return (
    <div className='flex items-center gap-x-2 bg-muted rounded-md p-1'>
      <Button variant='lighterGhost' size='icon' className='text-2xl rounded-sm'>
        <Bell className='size-5 text-muted-foreground' />
      </Button>
      <ToggleDark />
    </div>
  );
};

export default ButtonGroup;
