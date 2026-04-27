import ComingSoon from '@/components/ComingSoon';
import { Bed } from 'lucide-react';

const BedManagement = () => (
  <ComingSoon
    title="Bed Management"
    description="Real-time hospital bed allocation, department-wise availability tracking, and automated patient assignment."
    icon={<Bed className="h-8 w-8" />}
  />
);

export default BedManagement;
