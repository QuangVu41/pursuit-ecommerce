import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}

const Stat = ({ title, value, icon, className }: StatProps) => {
  return (
    <Card className={cn('@container/card', className)}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl font-manrope'>
          {value}
        </CardTitle>
        <CardAction>{icon}</CardAction>
      </CardHeader>
    </Card>
  );
};

export default Stat;
