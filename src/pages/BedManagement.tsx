
import React from 'react';
import Layout from '@/components/Layout';
import { useHospitalBeds } from '@/hooks/useSupabaseQuery';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Search, Filter, Plus, Building2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const BedManagement = () => {
  const { data: beds, isLoading } = useHospitalBeds();

  const totalBeds = beds?.length || 0;
  const occupiedBeds = beds?.filter(b => b.status === 'occupied').length || 0;
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

  return (
    <Layout>
      <div className="mesh-bg" />
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black medical-gradient-text tracking-tighter">Bed Management</h1>
            <p className="text-muted-foreground font-medium mt-1">Real-time hospital capacity and patient placement tracking.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl px-6 h-12 font-bold shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5 mr-2" /> Add New Unit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-70">Total Capacity</p>
                  <h3 className="text-4xl font-black mt-1">{totalBeds}</h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <Progress value={100} className="h-1.5 mt-6 bg-blue-500/10" />
            </CardContent>
          </Card>

          <Card className="glass-card border-emerald-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-500 opacity-70">Available</p>
                  <h3 className="text-4xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{availableBeds}</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Bed className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              <Progress value={(availableBeds/totalBeds)*100} className="h-1.5 mt-6 bg-emerald-500/10" />
            </CardContent>
          </Card>

          <Card className="glass-card border-orange-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-orange-500 opacity-70">Occupancy Rate</p>
                  <h3 className="text-4xl font-black mt-1 text-orange-600 dark:text-orange-400">{Math.round(occupancyRate)}%</h3>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-2xl">
                  <User className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <Progress value={occupancyRate} className="h-1.5 mt-6 bg-orange-500/10" />
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black tracking-tight">Active Bed Inventory</CardTitle>
              <CardDescription className="font-medium">Filter by ward, type, or availability.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search units..." className="pl-10 w-64 rounded-xl border-white/20 bg-white/50 dark:bg-black/20 focus:ring-primary" />
              </div>
              <Button variant="outline" className="rounded-xl border-white/20">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {isLoading ? (
                Array(12).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-white/10 rounded-2xl animate-pulse" />
                ))
              ) : (
                beds?.map((bed) => (
                  <div 
                    key={bed.id} 
                    className={cn(
                      "p-5 rounded-2xl border transition-all duration-300 group cursor-pointer",
                      bed.status === 'available' 
                        ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10" 
                        : "bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Bed className={cn(
                        "h-6 w-6 transition-transform duration-500 group-hover:scale-125",
                        bed.status === 'available' ? "text-emerald-500" : "text-orange-500"
                      )} />
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-black uppercase tracking-tighter px-1.5 py-0",
                        bed.status === 'available' ? "border-emerald-500/30 text-emerald-600" : "border-orange-500/30 text-orange-600"
                      )}>
                        {bed.status}
                      </Badge>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-lg font-black tracking-tight">{bed.bed_number}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{bed.type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BedManagement;
