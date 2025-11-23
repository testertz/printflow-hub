import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type PaymentMethod = 'mpesa' | 'halotel' | 'card';

interface PaymentGatewayProps {
  amount: number;
  onPaymentComplete: (method: PaymentMethod, reference: string) => void;
  onCancel: () => void;
}

export const PaymentGateway = ({ amount, onPaymentComplete, onCancel }: PaymentGatewayProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      onPaymentComplete(paymentMethod, reference);
      setIsProcessing(false);
    }, 2000);
  };

  const isFormValid = () => {
    if (paymentMethod === 'mpesa' || paymentMethod === 'halotel') {
      return phoneNumber.length >= 10;
    }
    return cardNumber.length === 16 && cardExpiry.length === 5 && cardCvv.length === 3;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-accent/50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">{amount.toLocaleString()} TSH</span>
          </div>
        </div>

        <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Label
                htmlFor="mpesa"
                className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <RadioGroupItem value="mpesa" id="mpesa" />
                <Smartphone className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">M-Pesa</p>
                  <p className="text-xs text-muted-foreground">Pay with M-Pesa mobile money</p>
                </div>
                {paymentMethod === 'mpesa' && <Check className="h-5 w-5 text-primary" />}
              </Label>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Label
                htmlFor="halotel"
                className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'halotel' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <RadioGroupItem value="halotel" id="halotel" />
                <Smartphone className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Halotel Money</p>
                  <p className="text-xs text-muted-foreground">Pay with Halotel mobile money</p>
                </div>
                {paymentMethod === 'halotel' && <Check className="h-5 w-5 text-primary" />}
              </Label>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Label
                htmlFor="card"
                className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-xs text-muted-foreground">Pay with Visa or Mastercard</p>
                </div>
                {paymentMethod === 'card' && <Check className="h-5 w-5 text-primary" />}
              </Label>
            </motion.div>
          </div>
        </RadioGroup>

        <AnimatePresence mode="wait">
          {(paymentMethod === 'mpesa' || paymentMethod === 'halotel') && (
            <motion.div
              key="mobile-money"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="0XXX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                You will receive a prompt on your phone to complete the payment
              </p>
            </motion.div>
          )}

          {paymentMethod === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={16}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setCardExpiry(value);
                    }}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handlePayment}
            disabled={!isFormValid() || isProcessing}
            className="flex-1"
            size="lg"
          >
            {isProcessing ? 'Processing...' : `Pay ${amount.toLocaleString()} TSH`}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isProcessing}
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
