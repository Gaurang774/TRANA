
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, User, Shield, Activity, FileText, Download, Play, Video, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Healthcare = () => {
  return (
    <Layout>
      <div className="mesh-bg" />
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-black px-3">PATIENT PORTAL</Badge>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 font-black">ENCRYPTED</Badge>
            </div>
            <h1 className="text-4xl font-black medical-gradient-text tracking-tighter">My Health Central</h1>
            <p className="text-muted-foreground font-medium">Your personal health records, digital prescriptions, and telemedicine hub.</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
              <Video className="h-5 w-5 mr-2" /> Start Tele-Consult
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black">Next Consultation</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                      <Play className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/50 dark:bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-black">Dr. Sarah Johnson</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cardiology Specialist</p>
                      </div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Schedule</p>
                      <p className="text-lg font-black tracking-tight">Today • 2:30 PM</p>
                    </div>
                    <Button className="w-full rounded-xl font-bold bg-primary text-white h-11">Join Waiting Room</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black">Health Vitals</CardTitle>
                    <Activity className="h-5 w-5 text-emerald-500 animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Blood Pressure</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">120/80 <span className="text-[10px] opacity-50">mmHg</span></span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Heart Rate</span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">72 <span className="text-[10px] opacity-50">BPM</span></span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SpO2 Level</span>
                    <span className="text-xl font-black text-orange-600 dark:text-orange-400">98 <span className="text-[10px] opacity-50">%</span></span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">Digital Records</CardTitle>
                  <CardDescription className="font-medium">Access your prescriptions, lab reports, and imaging.</CardDescription>
                </div>
                <Button variant="ghost" className="rounded-xl font-bold text-primary">View All</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/20 group hover:bg-white/60 dark:hover:bg-black/40 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-white/20">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h5 className="font-black text-foreground">Lab Report: Lipid Profile</h5>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Oct 24, 2024 • Apollo Diagnostics</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-primary text-white rounded-[32px] overflow-hidden border-none shadow-2xl shadow-primary/20">
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8" />
                  <h3 className="text-2xl font-black tracking-tighter leading-none">Trana <br/>Premium</h3>
                </div>
                <p className="font-bold text-white/80 leading-snug">Unlock direct 24/7 access to priority emergency dispatch and remote monitoring.</p>
                <div className="pt-4">
                  <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl h-12 font-black uppercase text-xs tracking-widest">Upgrade Now</Button>
                </div>
              </div>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-black tracking-tight">Active Prescriptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black">Atorvastatin 20mg</p>
                    <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 text-primary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black">Metformin 500mg</p>
                    <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 text-primary">Active</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 rounded-xl border-white/20 font-bold text-xs uppercase tracking-widest h-11">
                  Request Refill
                </Button>
              </CardContent>
            </Card>

            <div className="p-8 rounded-[32px] bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/10">
              <h4 className="font-black text-xl tracking-tight mb-2">Did you know?</h4>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">Walking just 30 minutes a day can reduce your risk of cardiovascular disease by up to 35%.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Healthcare;
