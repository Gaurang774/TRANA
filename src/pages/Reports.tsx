
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Clock, FileText, Download, Share2, Filter, PieChart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Reports = () => {
  return (
    <Layout>
      <div className="mesh-bg" />
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black medical-gradient-text tracking-tighter">System Analytics</h1>
            <p className="text-muted-foreground font-medium mt-1">Operational performance, response times, and healthcare outcomes.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="glass border-white/20 rounded-2xl h-12 px-6 font-bold">
              <Share2 className="h-5 w-5 mr-2" /> Share
            </Button>
            <Button className="bg-primary hover:bg-primary/90 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
              <Download className="h-5 w-5 mr-2" /> Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card p-2 border-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none">+12%</Badge>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avg. Response Time</p>
              <h3 className="text-3xl font-black mt-1">8.4 <span className="text-sm font-bold opacity-50">min</span></h3>
            </CardContent>
          </Card>

          <Card className="glass-card p-2 border-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <Users className="h-6 w-6" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none">+5.4%</Badge>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Patient Satisfaction</p>
              <h3 className="text-3xl font-black mt-1">96.2 <span className="text-sm font-bold opacity-50">%</span></h3>
            </CardContent>
          </Card>

          <Card className="glass-card p-2 border-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                  <Activity className="h-6 w-6" />
                </div>
                <Badge className="bg-red-500/10 text-red-600 border-none">-2%</Badge>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Critical Survival</p>
              <h3 className="text-3xl font-black mt-1">89.4 <span className="text-sm font-bold opacity-50">%</span></h3>
            </CardContent>
          </Card>

          <Card className="glass-card p-2 border-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none">+18%</Badge>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service Capacity</p>
              <h3 className="text-3xl font-black mt-1">1,240 <span className="text-sm font-bold opacity-50">ops</span></h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glass-card border-none overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black tracking-tight">Emergency Trends</CardTitle>
                <CardDescription className="font-medium text-xs">Last 30 days operational volume</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="rounded-lg h-8 text-[10px] font-black uppercase bg-primary/10 text-primary">DAILY</Button>
                <Button variant="ghost" size="sm" className="rounded-lg h-8 text-[10px] font-black uppercase">WEEKLY</Button>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] flex items-end justify-between gap-2 pt-10 px-8">
              {[40, 60, 45, 90, 65, 80, 50, 70, 85, 40, 55, 75].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-lg transition-all duration-500 group-hover:from-emerald-500 group-hover:to-emerald-400 cursor-pointer" 
                    style={{ height: `${h}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-xl font-black tracking-tight">Outcome Metrics</CardTitle>
              <CardDescription className="font-medium text-xs">Quality of care indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Successful Triage</span>
                  <span className="text-sm font-black">94.2%</span>
                </div>
                <Progress value={94.2} className="h-2 bg-primary/10" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">On-Time Dispatch</span>
                  <span className="text-sm font-black">88.7%</span>
                </div>
                <Progress value={88.7} className="h-2 bg-blue-500/10" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Medicine Availability</span>
                  <span className="text-sm font-black">99.1%</span>
                </div>
                <Progress value={99.1} className="h-2 bg-emerald-500/10" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Telemedicine Success</span>
                  <span className="text-sm font-black">82.4%</span>
                </div>
                <Progress value={82.4} className="h-2 bg-orange-500/10" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Response Efficiency', val: '9.2/10', icon: <TrendingUp className="h-5 w-5" /> },
            { title: 'Resource Utilization', val: '84%', icon: <PieChart className="h-5 w-5" /> },
            { title: 'Critical Incident Rate', val: '0.02%', icon: <AlertCircle className="h-5 w-5" /> }
          ].map((item, i) => (
            <Card key={i} className="glass-card border-none group hover:bg-primary/5 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl group-hover:text-primary transition-colors shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.title}</p>
                    <p className="text-xl font-black mt-0.5">{item.val}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

const AlertCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default Reports;
