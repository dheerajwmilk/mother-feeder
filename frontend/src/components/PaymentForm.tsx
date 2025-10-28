import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, Loader2 } from 'lucide-react';

declare const Razorpay: any;

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}


export function PaymentForm({ amount, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('neonest_token');
      
      if (!token) {
        onPaymentError('Please sign in to continue');
        setIsProcessing(false);
        return;
      }

      // Create Razorpay order
      const orderResponse = await fetch('http://localhost:5000/api/bookings/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, currency: 'INR' }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'NeoNest',
        description: 'Caregiver Booking Payment',
        handler: async function (response: any) {
          try {
            // Get token again for payment verification
            const verifyToken = localStorage.getItem('neonest_token');
            
            // Verify payment
            const verifyResponse = await fetch('http://localhost:5000/api/bookings/verify-razorpay-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${verifyToken}`,
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verification = await verifyResponse.json();

            if (verification.verified) {
      const paymentData = {
                method: 'razorpay',
        amount: amount,
                transactionId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
        timestamp: new Date().toISOString(),
                status: 'success',
              };
              onPaymentSuccess(paymentData);
            } else {
              onPaymentError('Payment verification failed');
            }
          } catch (error) {
            onPaymentError('Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function() {
            onPaymentError('Payment cancelled');
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      onPaymentError(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Payment Method Information */}
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
              <div>
              <h3 className="font-semibold">Secure Payment via Razorpay</h3>
              <p className="text-sm text-muted-foreground">Pay securely with any payment method</p>
            </div>
              </div>
              </div>
            </div>

          {/* Security Notice */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
          Your payment is protected by Razorpay's 256-bit SSL encryption. We never store your payment details.
            </p>
          </div>

          {/* Payment Button */}
          <Button 
        className="w-full bg-gradient-to-r from-primary to-secondary text-lg py-6"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
          <>
            <Shield className="w-5 h-5 mr-2" />
            Pay ₹{amount} Securely
          </>
            )}
          </Button>

      <p className="text-sm text-center text-muted-foreground">
        By proceeding, you agree to Razorpay's Terms & Conditions
      </p>
    </div>
  );
}
