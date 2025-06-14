
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, File, Code, Database, Zap } from 'lucide-react';

export function ProjectStructure() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span>Modern Emergency Management System</span>
        </CardTitle>
        <CardDescription>
          Built with React, TypeScript, Tailwind CSS, shadcn/ui, Supabase, and modern best practices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>Tech Stack</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="font-medium">Frontend</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">React 18 + TypeScript</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="font-medium">Styling</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Tailwind CSS + shadcn/ui</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="font-medium">Forms</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">react-hook-form + Zod</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="font-medium">Backend</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Supabase + PostgreSQL</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="font-medium">State Management</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">TanStack Query</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="font-medium">Maps</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Google Maps API</div>
              </div>
            </div>
          </div>

          {/* Folder Structure */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Folder className="h-5 w-5 text-yellow-500" />
              <span>Project Structure</span>
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm space-y-1">
              <div>📁 src/</div>
              <div className="ml-4">📁 components/</div>
              <div className="ml-8">📁 ui/ (shadcn/ui components)</div>
              <div className="ml-8">📁 enhanced/ (custom React components)</div>
              <div className="ml-8">📁 dashboard/ (dashboard components)</div>
              <div className="ml-4">📁 hooks/ (custom React hooks)</div>
              <div className="ml-4">📁 pages/ (React Router pages)</div>
              <div className="ml-4">📁 lib/ (utilities)</div>
              <div className="ml-4">📁 integrations/supabase/</div>
              <div className="ml-4">📄 App.tsx</div>
              <div className="ml-4">📄 main.tsx</div>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-500" />
              <span>Key Features Implemented</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-medium">✅ Enhanced Components</div>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• InteractiveForm with validation</li>
                  <li>• DataTable with sorting/filtering</li>
                  <li>• RealTimeData with live updates</li>
                  <li>• ModalForm for quick actions</li>
                  <li>• AuthProvider for secure auth</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-medium">✅ Modern Practices</div>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• TypeScript for type safety</li>
                  <li>• Responsive design</li>
                  <li>• Error handling & loading states</li>
                  <li>• Toast notifications</li>
                  <li>• Real-time data syncing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="text-lg font-semibold mb-3">🚀 Next Steps & Recommendations</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <div className="font-medium text-blue-900 dark:text-blue-100">Testing</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Add Jest + React Testing Library for component testing
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                <div className="font-medium text-purple-900 dark:text-purple-100">AI Integration</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  Integrate OpenAI + LangChain for intelligent emergency triage
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                <div className="font-medium text-green-900 dark:text-green-100">Deployment</div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Deploy to Vercel or Netlify with environment variables
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
