import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockInventory } from '@/services/api';
import { toast } from 'sonner';

export default function StockUpdate() {
  const [selectedItem, setSelectedItem] = useState('');
  const [updateType, setUpdateType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recentTransactions = [
    { id: '1', item: 'A4 Paper', type: 'in', quantity: 500, date: new Date().toISOString(), user: 'Admin' },
    { id: '2', item: 'Toner Cartridge', type: 'out', quantity: 2, date: new Date().toISOString(), user: 'Admin' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success(`Stock ${updateType === 'in' ? 'added' : 'removed'} successfully`);
      setIsSubmitting(false);
      setSelectedItem('');
      setQuantity('');
      setNotes('');
    }, 1000);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Update</h1>
        <p className="text-muted-foreground mt-2">Record stock in and stock out transactions</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Update Stock</CardTitle>
            <CardDescription>
              Add or remove items from inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Transaction Type</Label>
                  <RadioGroup value={updateType} onValueChange={(value) => setUpdateType(value as 'in' | 'out')}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="in" id="in" />
                        <Label htmlFor="in" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-success" />
                            <div>
                              <p className="font-medium">Stock In</p>
                              <p className="text-sm text-muted-foreground">Add to inventory</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="out" id="out" />
                        <Label htmlFor="out" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-destructive" />
                            <div>
                              <p className="font-medium">Stock Out</p>
                              <p className="text-sm text-muted-foreground">Remove from inventory</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item">Select Item *</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockInventory.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} ({item.quantity} {item.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Add any additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button type="submit" disabled={isSubmitting} size="lg">
                  <Package className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Updating...' : 'Update Stock'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="hover:bg-accent/50"
                    >
                      <TableCell className="font-medium">{transaction.item}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'in' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {transaction.type === 'in' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {transaction.type === 'in' ? 'Stock In' : 'Stock Out'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium">{transaction.quantity}</TableCell>
                      <TableCell className="text-center text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">{transaction.user}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
