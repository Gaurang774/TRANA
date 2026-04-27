
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Monitor, Database, Save, Key, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <Layout>
      <div className="mesh-bg" />
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-black medical-gradient-text tracking-tighter">System Configuration</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage global system settings, security protocols, and integration keys.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="glass-card p-2">
              <CardContent className="p-2 space-y-1">
                {[
                  { icon: <User />, label: 'Profile' },
                  { icon: <Monitor />, label: 'Appearance', active: true },
                  { icon: <Bell />, label: 'Notifications' },
                  { icon: <Shield />, label: 'Security' },
                  { icon: <Globe />, label: 'Localization' },
                  { icon: <Database />, label: 'Data Sync' },
                  { icon: <Key />, label: 'API Keys' },
                ].map((item, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start rounded-xl h-12 font-bold px-4 transition-all duration-300",
                      item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <span className="mr-3">{React.cloneElement(item.icon as React.ReactElement, { size: 18 })}</span>
                    {item.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card className="glass-card border-none">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-black tracking-tight">Appearance & Theme</CardTitle>
                </div>
                <CardDescription className="font-medium">Customize how the TRANA Command Center looks on your workstation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-black text-sm">Glassmorphism Intensity</h4>
                    <p className="text-xs text-muted-foreground">Adjust the background blur and transparency of UI elements.</p>
                  </div>
                  <div className="w-48">
                    <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div className="h-full w-[75%] bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-black text-sm">Real-time Animations</h4>
                    <p className="text-xs text-muted-foreground">Show micro-animations for data updates and status changes.</p>
                  </div>
                  <Switch checked={true} />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-black text-sm">High Contrast Mode</h4>
                    <p className="text-xs text-muted-foreground">Increase legibility for critical emergency dispatching.</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <Globe className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl font-black tracking-tight">Regional Settings</CardTitle>
                </div>
                <CardDescription className="font-medium">Set your primary operational city and map defaults.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Primary City</label>
                    <Input placeholder="e.g. Mumbai, Maharashtra" className="rounded-xl border-white/20 bg-white/40 dark:bg-black/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Emergency Radius (KM)</label>
                    <Input type="number" defaultValue={50} className="rounded-xl border-white/20 bg-white/40 dark:bg-black/20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-6">
              <Button variant="ghost" className="rounded-xl px-8 font-bold text-muted-foreground">Discard</Button>
              <Button className="rounded-xl px-10 h-12 bg-primary hover:bg-primary/90 font-black shadow-xl shadow-primary/20">
                <Save className="h-5 w-5 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default Settings;
