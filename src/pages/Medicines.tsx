
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Pill, AlertTriangle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Medicine {
  id: string;
  name: string;
  generic_name: string | null;
  description: string | null;
  uses: string | null;
  dosage: string | null;
  side_effects: string | null;
  warnings: string | null;
  drug_class: string | null;
  prescription_required: boolean | null;
}

const Medicines = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMedicines();
  }, [user, navigate]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (medicine.generic_name && medicine.generic_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (medicine.drug_class && medicine.drug_class.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMedicines(filtered);
    }
  }, [searchTerm, medicines]);

  const fetchMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setMedicines(data || []);
      setFilteredMedicines(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch medicines information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const MedicineDetails = ({ medicine }: { medicine: Medicine }) => (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{medicine.name}</h3>
        {medicine.generic_name && (
          <p className="text-sm text-muted-foreground">Generic: {medicine.generic_name}</p>
        )}
      </div>
      
      {medicine.description && (
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm">{medicine.description}</p>
        </div>
      )}

      {medicine.uses && (
        <div>
          <h4 className="font-medium mb-2">Uses</h4>
          <p className="text-sm">{medicine.uses}</p>
        </div>
      )}

      {medicine.dosage && (
        <div>
          <h4 className="font-medium mb-2">Dosage</h4>
          <p className="text-sm">{medicine.dosage}</p>
        </div>
      )}

      {medicine.side_effects && (
        <div>
          <h4 className="font-medium mb-2 text-orange-700">Side Effects</h4>
          <p className="text-sm">{medicine.side_effects}</p>
        </div>
      )}

      {medicine.warnings && (
        <div>
          <h4 className="font-medium mb-2 text-red-700">Warnings</h4>
          <p className="text-sm">{medicine.warnings}</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {medicine.drug_class && (
          <Badge variant="outline">{medicine.drug_class}</Badge>
        )}
        <Badge variant={medicine.prescription_required ? "destructive" : "secondary"}>
          {medicine.prescription_required ? "Prescription Required" : "Over-the-counter"}
        </Badge>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-medical-blue rounded-md flex items-center justify-center">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-medical-blue">Medicine Information</h1>
            <p className="text-muted-foreground">Search and view detailed medicine information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Medicines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by medicine name, generic name, or drug class..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading medicines...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{medicine.name}</CardTitle>
                      {medicine.generic_name && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Generic: {medicine.generic_name}
                        </p>
                      )}
                    </div>
                    <Pill className="h-5 w-5 text-medical-blue flex-shrink-0 mt-1" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {medicine.description && (
                      <p className="text-sm line-clamp-2">{medicine.description}</p>
                    )}
                    
                    <div className="flex gap-2 flex-wrap">
                      {medicine.drug_class && (
                        <Badge variant="outline" className="text-xs">
                          {medicine.drug_class}
                        </Badge>
                      )}
                      <Badge 
                        variant={medicine.prescription_required ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {medicine.prescription_required ? "Rx" : "OTC"}
                      </Badge>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Info className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5" />
                            Medicine Information
                          </DialogTitle>
                        </DialogHeader>
                        <MedicineDetails medicine={medicine} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredMedicines.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No medicines found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "No medicines available in the database"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Medicines;
