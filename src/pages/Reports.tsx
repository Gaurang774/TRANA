import ComingSoon from '@/components/ComingSoon';
import { FileText } from 'lucide-react';

const Reports = () => (
  <ComingSoon
    title="Reports"
    description="Generate comprehensive analytics reports, incident summaries, and compliance documentation with one click."
    icon={<FileText className="h-8 w-8" />}
  />
);

export default Reports;
