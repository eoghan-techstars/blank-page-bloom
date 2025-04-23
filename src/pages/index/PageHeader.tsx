
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

const PageHeader = ({ onRefresh, loading }: PageHeaderProps) => {
  return (
    <div className="text-center mb-12 mt-8">
      <div className="inline-block px-3 py-1 text-xs rounded-full bg-techstars-phosphor/10 text-techstars-phosphor font-medium mb-3 animate-fade-in">
        Meet Your Mentors
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-down">
        Techstars London Mentors
      </h1>
      <p className="text-techstars-slate max-w-2xl mx-auto animate-slide-down" style={{ animationDelay: '0.1s' }}>
        Tech leaders, founders, engineers, investors, customers, and startup guides from across Europe and around the world
      </p>
      
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={onRefresh}
          variant="outline"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
