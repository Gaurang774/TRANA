
import React from 'react';
import Layout from '@/components/Layout';
import { useMedicines } from '@/hooks/useSupabaseQuery';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, Search, Filter, Plus, AlertTriangle, Package, History } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Medicines = () => {
  const { data: medicines, isLoading } = useMedicines();

  const lowStockCount = medicines?.filter(m => m.stock_quantity < m.min_stock_level).length || 0;

  return (
    <Layout>
      <div className="mesh-bg" />
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black medical-gradient-text tracking-tighter">Pharmacy Inventory</h1>
            <p className="text-muted-foreground font-medium mt-1">Manage medicine stock, drug interactions, and prescription fulfillment.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="glass border-white/20 rounded-2xl h-12 px-6 font-bold">
              <History className="h-5 w-5 mr-2" /> Logs
            </Button>
            <Button className="bg-primary hover:bg-primary/90 rounded-2xl px-6 h-12 font-bold shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5 mr-2" /> New Medicine
            </Button>
          </div>
        </div>

        {lowStockCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex items-center justify-between backdrop-blur-xl animate-pulse-medical">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-2xl">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-red-600 dark:text-red-400 font-black text-lg">Critical Stock Alert</h4>
                <p className="text-red-500/70 font-bold text-sm uppercase tracking-tight">{lowStockCount} medicines are below minimum safety levels.</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl font-black uppercase text-xs">
              Restock All
            </Button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by medicine name, SKU, or category..." 
              className="pl-12 h-14 rounded-2xl border-white/20 bg-white/40 dark:bg-black/20 focus:ring-primary backdrop-blur-md font-medium" 
            />
          </div>
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-white/20 glass">
            <Filter className="h-5 w-5 mr-2" /> Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-white/10 rounded-3xl animate-pulse" />
            ))
          ) : (
            medicines?.map((med) => (
              <Card key={med.id} className="glass-card group hover:scale-[1.03]">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <Pill className="h-6 w-6" />
                    </div>
                    <Badge variant={med.stock_quantity < med.min_stock_level ? "destructive" : "outline"} className="font-black uppercase text-[10px]">
                      {med.stock_quantity < med.min_stock_level ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <CardTitle className="text-xl font-black tracking-tight">{med.name}</CardTitle>
                    <CardDescription className="font-bold uppercase tracking-widest text-[10px] mt-1">{med.category}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Stock</p>
                      <p className="text-2xl font-black">{med.stock_quantity} <span className="text-sm text-muted-foreground font-bold">units</span></p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Storage</p>
                      <p className="text-sm font-bold">{med.storage_location || 'Main Vault'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tight text-muted-foreground">
                      <span>Inventory Capacity</span>
                      <span>{Math.round((med.stock_quantity / (med.min_stock_level * 3)) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          med.stock_quantity < med.min_stock_level ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-primary"
                        )} 
                        style={{ width: `${Math.min((med.stock_quantity / (med.min_stock_level * 3)) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button variant="ghost" className="flex-1 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
                      Manage
                    </Button>
                    <Button variant="ghost" className="flex-1 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
                      Restock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Medicines;
