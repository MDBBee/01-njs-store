import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl">HomePage</h1>
      <Button
        variant="outline"
        size="lg"
        className="capitalize m-8 hover:bg-slate-500 rounded-3xl"
      >
        ClickMe
      </Button>
    </div>
  );
};
export default HomePage;
