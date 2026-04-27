import ComingSoon from '@/components/ComingSoon';
import { Puzzle } from 'lucide-react';

const PluginManagement = () => (
  <ComingSoon
    title="Plugins"
    description="Extend TRANA's capabilities with modular plugins for lab integration, telemedicine, and third-party health systems."
    icon={<Puzzle className="h-8 w-8" />}
  />
);

export default PluginManagement;
