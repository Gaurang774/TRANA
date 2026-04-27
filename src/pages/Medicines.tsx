import ComingSoon from '@/components/ComingSoon';
import { Pill } from 'lucide-react';

const Medicines = () => (
  <ComingSoon
    title="Medicine Management"
    description="Track medicine inventory, manage prescriptions, and get alerts for low stock and expiry dates."
    icon={<Pill className="h-8 w-8" />}
  />
);

export default Medicines;
