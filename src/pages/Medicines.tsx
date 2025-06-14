import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Pill, AlertTriangle, Info, Filter, SortAsc, SortDesc, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AddMedicineForm from '@/components/medicines/AddMedicineForm';

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
  active_ingredients: string | null;
  brand_names: string[] | null;
  interactions: string | null;
  manufacturer: string | null;
}

const Medicines = () => {
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'drug_class' | 'prescription_required'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterByPrescription, setFilterByPrescription] = useState<'all' | 'prescription' | 'otc'>('all');
  const [selectedDrugClass, setSelectedDrugClass] = useState('all');
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const itemsPerPage = 9;

  useEffect(() => {
    fetchMedicines();
    fetchUserRole();
  }, []);

  useEffect(() => {
    filterAndSortMedicines();
  }, [searchTerm, medicines, sortBy, sortOrder, filterByPrescription, selectedDrugClass]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_role');
      if (error) throw error;
      setUserRole(data);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      console.log('Fetched medicines:', data);
      setMedicines(data || []);
    } catch (error: any) {
      console.error('Error fetching medicines:', error);
      toast({
        title: "Error",
        description: "Failed to fetch medicines information",
        variant: "destructive",
      });
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMedicines = () => {
    let filtered = [...medicines];

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchLower) ||
        (medicine.generic_name && medicine.generic_name.toLowerCase().includes(searchLower)) ||
        (medicine.drug_class && medicine.drug_class.toLowerCase().includes(searchLower)) ||
        (medicine.active_ingredients && medicine.active_ingredients.toLowerCase().includes(searchLower))
      );
    }

    // Apply prescription filter
    if (filterByPrescription !== 'all') {
      filtered = filtered.filter(medicine => {
        if (filterByPrescription === 'prescription') {
          return medicine.prescription_required === true;
        } else {
          return medicine.prescription_required === false;
        }
      });
    }

    // Apply drug class filter
    if (selectedDrugClass !== 'all') {
      filtered = filtered.filter(medicine => 
        medicine.drug_class && medicine.drug_class.toLowerCase() === selectedDrugClass.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | boolean;
      let bValue: string | boolean;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'drug_class':
          aValue = (a.drug_class || '').toLowerCase();
          bValue = (b.drug_class || '').toLowerCase();
          break;
        case 'prescription_required':
          aValue = a.prescription_required || false;
          bValue = b.prescription_required || false;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      }
    });

    setFilteredMedicines(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSort = (field: 'name' | 'drug_class' | 'prescription_required') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleRefresh = () => {
    fetchMedicines();
    toast({
      title: "Refreshed",
      description: "Medicine data has been refreshed",
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterByPrescription('all');
    setSelectedDrugClass('all');
    setSortBy('name');
    setSortOrder('asc');
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    });
  };

  // Get unique drug classes for filter dropdown
  const uniqueDrugClasses = [...new Set(medicines.map(m => m.drug_class).filter(Boolean))];

  // Pagination logic with proper bounds checking
  const totalPages = Math.max(1, Math.ceil(filteredMedicines.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMedicines = filteredMedicines.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canAddMedicine = userRole && ['admin', 'doctor', 'nurse'].includes(userRole);

  const MedicineDetails = ({ medicine }: { medicine: Medicine }) => (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div>
        <h3 className="font-semibold text-lg">{medicine.name}</h3>
        {medicine.generic_name && (
          <p className="text-sm text-muted-foreground">Generic: {medicine.generic_name}</p>
        )}
        {medicine.manufacturer && (
          <p className="text-sm text-muted-foreground">Manufacturer: {medicine.manufacturer}</p>
        )}
      </div>

      {medicine.brand_names && medicine.brand_names.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Brand Names</h4>
          <div className="flex flex-wrap gap-1">
            {medicine.brand_names.map((brand, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {brand}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {medicine.active_ingredients && (
        <div>
          <h4 className="font-medium mb-2">Active Ingredients</h4>
          <p className="text-sm">{medicine.active_ingredients}</p>
        </div>
      )}
      
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

      {medicine.interactions && (
        <div>
          <h4 className="font-medium mb-2 text-yellow-700">Drug Interactions</h4>
          <p className="text-sm">{medicine.interactions}</p>
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-medical-blue rounded-md flex items-center justify-center">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-medical-blue">Medicine Information</h1>
              <p className="text-muted-foreground">
                Search and view detailed information for {filteredMedicines.length} medicines
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {canAddMedicine && (
              <AddMedicineForm onMedicineAdded={fetchMedicines} />
            )}
            <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Medicines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by medicine name, generic name, drug class, or active ingredients..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              {/* Prescription Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={filterByPrescription} onValueChange={(value: 'all' | 'prescription' | 'otc') => setFilterByPrescription(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="prescription">Prescription Only</SelectItem>
                    <SelectItem value="otc">Over-the-counter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Drug Class Filter */}
              <div className="flex items-center gap-2">
                <Select value={selectedDrugClass} onValueChange={setSelectedDrugClass}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by drug class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drug Classes</SelectItem>
                    {uniqueDrugClasses.map((drugClass) => (
                      <SelectItem key={drugClass} value={drugClass}>
                        {drugClass}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1"
                >
                  Name
                  {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('drug_class')}
                  className="flex items-center gap-1"
                >
                  Drug Class
                  {sortBy === 'drug_class' && (sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)}
                </Button>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Clear Filters
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Filters</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all search terms, filters, and sorting options. Are you sure?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearFilters}>Clear All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading medicines...</p>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentMedicines.map((medicine) => (
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
                            View Full Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Pill className="h-5 w-5" />
                              Complete Medicine Information
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

            {/* Pagination */}
            {totalPages > 1 && filteredMedicines.length > 0 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(safeCurrentPage - 1)}
                        className={safeCurrentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === safeCurrentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(safeCurrentPage + 1)}
                        className={safeCurrentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {!loading && filteredMedicines.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No medicines found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterByPrescription !== 'all' || selectedDrugClass !== 'all'
                  ? "Try adjusting your search terms or filters" 
                  : "No medicines available in the database"
                }
              </p>
              {(searchTerm || filterByPrescription !== 'all' || selectedDrugClass !== 'all') && (
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Medicines;
