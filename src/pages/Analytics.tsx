import ComingSoon from '@/components/ComingSoon';
import { BarChart3 } from 'lucide-react';

const Analytics = () => (
  <ComingSoon
    title="Analytics Dashboard"
    description="Deep insights into response times, resource utilization, and operational performance with interactive charts."
    icon={<BarChart3 className="h-8 w-8" />}
  />
);

export default Analytics;
