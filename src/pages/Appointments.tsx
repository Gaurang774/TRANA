
import React from 'react';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { useAppointments } from '@/hooks/useSupabaseQuery';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Filter, Plus, Clock, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const Appointments = () => {
  const { data: appointments, isLoading } = useAppointments();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <Layout>
      <div className="mesh-bg" />
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black medical-gradient-text tracking-tighter">Appointments</h1>
            <p className="text-muted-foreground font-medium mt-1">Manage outpatient schedules, telemedicine calls, and surgery bookings.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5 mr-2" /> Book Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-black tracking-tight">Today's Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold">Upcoming</span>
                  </div>
                  <Badge className="font-black">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold">Completed</span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">8</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold">Cancelled</span>
                  </div>
                  <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20">2</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent">
                <h3 className="font-black uppercase tracking-widest text-[10px] text-primary mb-2">Smart Schedule</h3>
                <p className="text-sm font-bold leading-tight">You have 4 back-to-back appointments starting in 20 minutes.</p>
                <Button size="sm" className="mt-4 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 w-full h-10 shadow-lg">
                  View Full Timeline
                </Button>
              </div>
            </Card>
          </div>

          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by patient name, ID, or doctor..." 
                  className="pl-12 h-12 rounded-xl border-white/20 bg-white/40 dark:bg-black/20" 
                />
              </div>
              <Button variant="outline" className="h-12 px-6 rounded-xl border-white/20 glass">
                <Filter className="h-5 w-5 mr-2" /> Filter
              </Button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-white/10 rounded-2xl animate-pulse" />
                ))
              ) : (
                appointments?.map((appointment) => (
                  <Card key={appointment.id} className="glass-card group hover:scale-[1.01] overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div className="w-2 h-24 bg-primary group-hover:w-4 transition-all duration-500 shrink-0" />
                        <div className="flex-1 p-6 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/50 dark:bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black tracking-tight">{appointment.patient_name || 'Anonymous Patient'}</h4>
                              <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                                <span className="flex items-center text-xs font-bold uppercase tracking-tight">
                                  <Clock className="h-3.5 w-3.5 mr-1 text-primary" /> 
                                  {format(new Date(appointment.appointment_date), 'MMM dd, h:mm a')}
                                </span>
                                <span className="flex items-center text-xs font-bold uppercase tracking-tight">
                                  <Phone className="h-3.5 w-3.5 mr-1 text-primary" /> 
                                  {appointment.contact_number || 'No Contact'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70 mb-1">Reason</p>
                              <p className="text-xs font-bold">{appointment.reason || 'General Checkup'}</p>
                            </div>
                            <Badge className={cn("px-3 py-1 font-black uppercase text-[10px]", getStatusStyle(appointment.status))}>
                              {appointment.status}
                            </Badge>
                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary">
                              <CheckCircle2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
