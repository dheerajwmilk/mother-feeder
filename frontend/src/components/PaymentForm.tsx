import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { CreditCard, Smartphone, Building2, Shield, Loader2 } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

export function PaymentForm({ amount, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    selectedBank: '',
    selectedWallet: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  const validateCardForm = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = formData;
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      return 'Please enter a valid 16-digit card number';
    }
    if (!expiryDate || expiryDate.length !== 5) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    if (!cvv || cvv.length < 3) {
      return 'Please enter a valid CVV';
    }
    if (!cardholderName.trim()) {
      return 'Please enter cardholder name';
    }
    return null;
  };

  const validateUPIForm = () => {
    const { upiId } = formData;
    if (!upiId || !upiId.includes('@')) {
      return 'Please enter a valid UPI ID (e.g., 1234567890@paytm)';
    }
    return null;
  };

  const validateNetBankingForm = () => {
    const { selectedBank } = formData;
    if (!selectedBank) {
      return 'Please select a bank';
    }
    return null;
  };

  const validateWalletForm = () => {
    const { selectedWallet } = formData;
    if (!selectedWallet) {
      return 'Please select a wallet';
    }
    return null;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      let validationError = null;
      
      switch (selectedMethod) {
        case 'card':
          validationError = validateCardForm();
          break;
        case 'upi':
          validationError = validateUPIForm();
          break;
        case 'netbanking':
          validationError = validateNetBankingForm();
          break;
        case 'wallet':
          validationError = validateWalletForm();
          break;
      }

      if (validationError) {
        onPaymentError(validationError);
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      const paymentData = {
        method: selectedMethod,
        amount: amount,
        transactionId: `TXN${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'success'
      };
      
      onPaymentSuccess(paymentData);
    } catch (error) {
      onPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India', 'IndusInd Bank'
  ];

  const wallets = [
    'Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay', 'Mobikwik', 'Freecharge'
  ];

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Choose Payment Method</h3>
        <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
          <div className="grid gap-4">
            {/* Credit/Debit Card */}
            <Card className={`cursor-pointer transition-all duration-200 ${
              selectedMethod === 'card' ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="card" id="card" />
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="card" className="font-semibold cursor-pointer">Credit/Debit Card</Label>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay, American Express</p>
                  </div>
                  <Badge variant="secondary">Popular</Badge>
                </div>
              </CardContent>
            </Card>

            {/* UPI */}
            <Card className={`cursor-pointer transition-all duration-200 ${
              selectedMethod === 'upi' ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="upi" id="upi" />
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="upi" className="font-semibold cursor-pointer">UPI Payment</Label>
                    <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Net Banking */}
            <Card className={`cursor-pointer transition-all duration-200 ${
              selectedMethod === 'netbanking' ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="netbanking" className="font-semibold cursor-pointer">Net Banking</Label>
                    <p className="text-sm text-muted-foreground">All major banks supported</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Wallets */}
            <Card className={`cursor-pointer transition-all duration-200 ${
              selectedMethod === 'wallet' ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="wallet" className="font-semibold cursor-pointer">Digital Wallets</Label>
                    <p className="text-sm text-muted-foreground">Paytm, PhonePe, Google Pay, Amazon Pay</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </RadioGroup>
      </div>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cardholderName">Cardholder Name *</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                />
              </div>
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="upiId">UPI ID *</Label>
                <Input
                  id="upiId"
                  placeholder="1234567890@paytm"
                  value={formData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your UPI ID (e.g., 1234567890@paytm, 9876543210@ybl)
                </p>
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="selectedBank">Select Bank *</Label>
                <Select value={formData.selectedBank} onValueChange={(value) => handleInputChange('selectedBank', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedMethod === 'wallet' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="selectedWallet">Select Wallet *</Label>
                <Select value={formData.selectedWallet} onValueChange={(value) => handleInputChange('selectedWallet', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet} value={wallet}>
                        {wallet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Your payment is protected by 256-bit SSL encryption. We never store your payment details.
            </p>
          </div>

          {/* Payment Button */}
          <Button 
            className="w-full bg-gradient-to-r from-primary to-secondary text-lg py-3"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ₹${amount}`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
