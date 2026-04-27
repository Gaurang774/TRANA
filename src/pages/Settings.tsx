import ComingSoon from '@/components/ComingSoon';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => (
  <ComingSoon
    title="Settings"
    description="Configure system preferences, user roles, notification rules, and integration settings for your EMS deployment."
    icon={<SettingsIcon className="h-8 w-8" />}
  />
);

export default Settings;
