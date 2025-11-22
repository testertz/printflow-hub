import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Settings() {
  const [bwCost, setBwCost] = useState('2');
  const [colorCost, setColorCost] = useState('10');
  const [collectionFee, setCollectionFee] = useState('5');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully');
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-2">Configure system-wide printing costs and fees</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Printing Costs</CardTitle>
            <CardDescription>
              Set the cost per page for different print types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bwCost">B/W Cost per Page (₹)</Label>
                    <Input
                      id="bwCost"
                      type="number"
                      min="0"
                      step="0.5"
                      value={bwCost}
                      onChange={(e) => setBwCost(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Current: ₹{bwCost} per page
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colorCost">Color Cost per Page (₹)</Label>
                    <Input
                      id="colorCost"
                      type="number"
                      min="0"
                      step="0.5"
                      value={colorCost}
                      onChange={(e) => setColorCost(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Current: ₹{colorCost} per page
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collectionFee">Collection Fee (₹)</Label>
                  <Input
                    id="collectionFee"
                    type="number"
                    min="0"
                    step="0.5"
                    value={collectionFee}
                    onChange={(e) => setCollectionFee(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Fixed fee added to each order
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button type="submit" disabled={isSaving} size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Settings'}
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
            <CardTitle>Cost Breakdown Example</CardTitle>
            <CardDescription>
              Example calculation based on current settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">10 pages B/W</span>
                <span className="font-medium">₹{parseInt(bwCost) * 10}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">5 pages Color</span>
                <span className="font-medium">₹{parseInt(colorCost) * 5}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Collection Fee</span>
                <span className="font-medium">₹{collectionFee}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between p-3 rounded-lg bg-primary/10 font-bold">
                <span>Total</span>
                <span className="text-primary">
                  ₹{parseInt(bwCost) * 10 + parseInt(colorCost) * 5 + parseInt(collectionFee)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
