import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatProps {
  title: string;
  value: React.ReactNode;
}

const Stat = ({ title, value }: StatProps) => {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl font-manrope'>
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default Stat;
