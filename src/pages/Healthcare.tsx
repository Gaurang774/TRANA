import ComingSoon from '@/components/ComingSoon';
import { Globe } from 'lucide-react';

const Healthcare = () => (
  <ComingSoon
    title="Healthcare Portal"
    description="A unified patient-facing portal for health records, telemedicine consultations, and prescription management."
    icon={<Globe className="h-8 w-8" />}
  />
);

export default Healthcare;
