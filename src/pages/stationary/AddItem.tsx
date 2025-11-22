import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AddItem() {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minThreshold, setMinThreshold] = useState('');
  const [unit, setUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Item added to inventory successfully');
      setIsSubmitting(false);
      // Reset form
      setItemName('');
      setCategory('');
      setQuantity('');
      setMinThreshold('');
      setUnit('');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Inventory Item</h1>
        <p className="text-muted-foreground mt-2">Add new items to the inventory</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>
              Enter the details of the new inventory item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    placeholder="e.g., A4 Paper"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paper">Paper</SelectItem>
                        <SelectItem value="toner">Toner</SelectItem>
                        <SelectItem value="binding">Binding</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Select value={unit} onValueChange={setUnit} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sheets">Sheets</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="boxes">Boxes</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Initial Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minThreshold">Minimum Threshold *</Label>
                    <Input
                      id="minThreshold"
                      type="number"
                      min="0"
                      placeholder="100"
                      value={minThreshold}
                      onChange={(e) => setMinThreshold(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Alert when stock falls below this level
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button type="submit" disabled={isSubmitting} size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
