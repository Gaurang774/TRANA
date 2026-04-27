import ComingSoon from '@/components/ComingSoon';
import { Calendar } from 'lucide-react';

const Appointments = () => (
  <ComingSoon
    title="Appointments"
    description="Schedule, manage, and track patient appointments with smart calendar integration and automated reminders."
    icon={<Calendar className="h-8 w-8" />}
  />
);

export default Appointments;
