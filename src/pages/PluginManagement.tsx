
import React from 'react';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Puzzle, Search, Filter, Plus, Power, Settings, Download, Trash2, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const PluginManagement = () => {
  const plugins = [
    { id: 1, name: 'AI Triage Core', version: 'v2.4.1', author: 'Trana AI Lab', status: true, description: 'Neural network model for classifying emergency priority based on speech and text.' },
    { id: 2, name: 'Google Maps Premium', version: 'v1.0.5', author: 'Google Cloud', status: true, description: 'Advanced route planning, traffic prediction, and satellite hybrid visualization.' },
    { id: 3, name: 'Telemedicine Bridge', version: 'v0.9.2', author: 'MedConnect', status: false, description: 'Encrypted WebRTC video bridge for remote patient consultations.' },
    { id: 4, name: 'Pharmacy Sync', version: 'v3.1.0', author: 'Local Health', status: true, description: 'Auto-sync local pharmacy inventory with government centralized medicine database.' },
    { id: 5, name: 'Audit Logger', version: 'v1.2.0', author: 'Trana Core', status: true, description: 'Compliance-grade logging for all dispatcher and healthcare professional actions.' },
    { id: 6, name: 'Legacy HL7 Connector', version: 'v0.1.4', author: 'Interop Labs', status: false, description: 'Bridge for connecting to older hospital information systems using HL7 protocols.' },
  ];

  return (
    <Layout>
      <div className="mesh-bg" />
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black medical-gradient-text tracking-tighter">Plugin Management</h1>
            <p className="text-muted-foreground font-medium mt-1">Extend system capabilities with modular healthcare integrations and AI tools.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5 mr-2" /> Marketplace
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search plugins by name, developer, or functionality..." 
              className="pl-12 h-14 rounded-2xl border-white/20 bg-white/40 dark:bg-black/20 backdrop-blur-md" 
            />
          </div>
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-white/20 glass">
            <Filter className="h-5 w-5 mr-2" /> Categories
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plugins.map((plugin) => (
            <Card key={plugin.id} className="glass-card group hover:scale-[1.02] border-white/10">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Puzzle className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={plugin.status ? "outline" : "secondary"} className={cn(
                      "font-black uppercase text-[10px]",
                      plugin.status ? "border-emerald-500/30 text-emerald-600" : "opacity-50"
                    )}>
                      {plugin.status ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground">{plugin.version}</span>
                  </div>
                </div>
                <div className="pt-4">
                  <CardTitle className="text-xl font-black tracking-tight">{plugin.name}</CardTitle>
                  <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-primary mt-1">By {plugin.author}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-xs font-medium text-muted-foreground leading-relaxed h-12 overflow-hidden">
                  {plugin.description}
                </p>
                
                <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <Power className={cn("h-4 w-4", plugin.status ? "text-emerald-500" : "text-muted-foreground")} />
                    <span className="text-xs font-black uppercase tracking-tight">Enabled</span>
                  </div>
                  <Switch checked={plugin.status} />
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
                    <Settings className="h-3.5 w-3.5 mr-1.5" /> Config
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="border-2 border-dashed border-primary/20 rounded-[32px] flex flex-col items-center justify-center p-10 group hover:border-primary/40 transition-all cursor-pointer bg-primary/5 hover:bg-primary/10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-black text-lg tracking-tight">Install Plugin</h4>
            <p className="text-xs font-medium text-muted-foreground mt-1">Upload a .zip or .json file</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PluginManagement;
