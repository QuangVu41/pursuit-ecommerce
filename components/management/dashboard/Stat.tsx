import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

const Stat = ({ title, value, icon }: StatProps) => {
  return (
    <Card className='@container/card'>
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
