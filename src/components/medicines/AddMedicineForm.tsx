
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AddMedicineFormProps {
  onMedicineAdded: () => void;
}

const AddMedicineForm = ({ onMedicineAdded }: AddMedicineFormProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandNames, setBrandNames] = useState<string[]>([]);
  const [currentBrandName, setCurrentBrandName] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    description: '',
    uses: '',
    dosage: '',
    side_effects: '',
    warnings: '',
    drug_class: '',
    prescription_required: true,
    active_ingredients: '',
    interactions: '',
    manufacturer: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addBrandName = () => {
    if (currentBrandName.trim() && !brandNames.includes(currentBrandName.trim())) {
      setBrandNames(prev => [...prev, currentBrandName.trim()]);
      setCurrentBrandName('');
    }
  };

  const removeBrandName = (brandName: string) => {
    setBrandNames(prev => prev.filter(name => name !== brandName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Medicine name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('add_medicine', {
        p_name: formData.name,
        p_generic_name: formData.generic_name || null,
        p_description: formData.description || null,
        p_uses: formData.uses || null,
        p_dosage: formData.dosage || null,
        p_side_effects: formData.side_effects || null,
        p_warnings: formData.warnings || null,
        p_drug_class: formData.drug_class || null,
        p_prescription_required: formData.prescription_required,
        p_active_ingredients: formData.active_ingredients || null,
        p_brand_names: brandNames.length > 0 ? brandNames : null,
        p_interactions: formData.interactions || null,
        p_manufacturer: formData.manufacturer || null
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medicine added successfully",
      });

      // Reset form
      setFormData({
        name: '',
        generic_name: '',
        description: '',
        uses: '',
        dosage: '',
        side_effects: '',
        warnings: '',
        drug_class: '',
        prescription_required: true,
        active_ingredients: '',
        interactions: '',
        manufacturer: ''
      });
      setBrandNames([]);
      setOpen(false);
      onMedicineAdded();

    } catch (error: any) {
      console.error('Error adding medicine:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add medicine",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Medicine
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="required">Medicine Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter medicine name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="generic_name">Generic Name</Label>
                  <Input
                    id="generic_name"
                    value={formData.generic_name}
                    onChange={(e) => handleInputChange('generic_name', e.target.value)}
                    placeholder="Enter generic name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="drug_class">Drug Class</Label>
                  <Input
                    id="drug_class"
                    value={formData.drug_class}
                    onChange={(e) => handleInputChange('drug_class', e.target.value)}
                    placeholder="e.g., Antibiotic, Analgesic"
                  />
                </div>
                
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    placeholder="Enter manufacturer name"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="prescription_required"
                    checked={formData.prescription_required}
                    onCheckedChange={(checked) => handleInputChange('prescription_required', checked)}
                  />
                  <Label htmlFor="prescription_required">Prescription Required</Label>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="active_ingredients">Active Ingredients</Label>
                  <Textarea
                    id="active_ingredients"
                    value={formData.active_ingredients}
                    onChange={(e) => handleInputChange('active_ingredients', e.target.value)}
                    placeholder="List active ingredients"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="brand_names">Brand Names</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={currentBrandName}
                        onChange={(e) => setCurrentBrandName(e.target.value)}
                        placeholder="Enter brand name"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBrandName())}
                      />
                      <Button type="button" onClick={addBrandName} size="sm">
                        Add
                      </Button>
                    </div>
                    {brandNames.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {brandNames.map((brand, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {brand}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeBrandName(brand)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the medicine"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage and Safety Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage & Safety Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="uses">Uses</Label>
                  <Textarea
                    id="uses"
                    value={formData.uses}
                    onChange={(e) => handleInputChange('uses', e.target.value)}
                    placeholder="What is this medicine used for?"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Textarea
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => handleInputChange('dosage', e.target.value)}
                    placeholder="Recommended dosage and administration"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="side_effects">Side Effects</Label>
                  <Textarea
                    id="side_effects"
                    value={formData.side_effects}
                    onChange={(e) => handleInputChange('side_effects', e.target.value)}
                    placeholder="Known side effects"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="warnings">Warnings</Label>
                  <Textarea
                    id="warnings"
                    value={formData.warnings}
                    onChange={(e) => handleInputChange('warnings', e.target.value)}
                    placeholder="Important warnings and contraindications"
                    rows={3}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="interactions">Drug Interactions</Label>
                <Textarea
                  id="interactions"
                  value={formData.interactions}
                  onChange={(e) => handleInputChange('interactions', e.target.value)}
                  placeholder="Known drug interactions"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Medicine'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicineForm;
