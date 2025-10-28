# Razorpay Payment Integration Setup

## Environment Variables Required

Add the following credentials to your `.env` file in the backend directory:

```env
# Razorpay Keys
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## How to Get Razorpay Credentials

1. **Sign up for Razorpay Account**
   - Go to https://razorpay.com/
   - Click on "Sign Up" or "Register"
   - Create your account with email, password, and business details

2. **Get Test/Live Keys**
   - After registration, navigate to your Razorpay Dashboard
   - Go to Settings → API Keys
   - Generate API Keys if you haven't already
   - You'll see:
     - **Key ID**: `rzp_test_xxxxxxxxxxxxx` (for test mode)
     - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxx` (for test mode)
   
3. **Test Mode vs Live Mode**
   - Use test keys for development (starts with `rzp_test_`)
   - Use live keys for production (starts with `rzp_live_`)
   - Test mode allows you to test payments without real transactions

4. **Add to .env file**
   ```env
   # Example (replace with your actual keys)
   RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
   RAZORPAY_KEY_SECRET=abcdef1234567890abcdef1234567890
   ```

## Frontend Setup

The Razorpay script will be loaded dynamically in the PaymentForm component. No additional environment variables needed in the frontend.

## Testing Payments

Use these test card details for testing:
- **Card Number**: `4111 1111 1111 1111`
- **CVV**: `123`
- **Expiry**: Any future date
- **Name**: Any name

## Important Notes

- **Never commit your .env file** to version control
- Keep your **Key Secret** secure and private
- Use **Test Mode** during development
- Switch to **Live Mode** only when ready for production
- Test thoroughly before going live

## Installation

If you haven't already, install Razorpay in your backend:

```bash
npm install razorpay
```

