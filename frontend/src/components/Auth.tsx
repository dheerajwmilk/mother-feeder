import { useState } from 'react';
import { Eye, EyeOff, Heart, Mail, Lock, User, Phone, ArrowRight, Check, Shield, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ui/use-toast';
import { OTPInput } from './ui/otp-input';

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

interface AuthProps {
  onNavigate?: (view: AppView) => void;
}

export function Auth({ onNavigate }: AuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  // userType maps to backend role: use 'user' for parents
  const [userType, setUserType] = useState<'user' | 'caregiver'>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOTP, setForgotOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { elementRef: heroRef } = useScrollAnimation();
  const { login, register, sendOTP } = useAuth();
  const { sendResetOTP, resetPassword } = useAuth();
  const { toast } = useToast();

  // Controlled form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Caregivers',
      description: 'All caregivers are thoroughly background-checked and verified'
    },
    {
      icon: Heart,
      title: '24/7 Support',
      description: 'Round-the-clock support for emergency situations'
    },
    {
      icon: Star,
      title: 'AI-Powered Matching',
      description: 'Smart matching based on your specific needs and preferences'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'New Mother',
      content: 'NeoNest connected me with the perfect caregiver. The support during those first weeks was invaluable.',
      rating: 5
    },
    {
      name: 'Maria Rodriguez',
      role: 'Certified Caregiver',
      content: 'As a caregiver, NeoNest has provided me with meaningful work helping families during such an important time.',
      rating: 5
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(loginEmail, loginPassword);
      if (onNavigate) onNavigate('book-care');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    // Basic client-side email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!signupEmail || !emailRegex.test(signupEmail)) {
      setIsLoading(false);
      setError('Please enter a valid email address');
      return;
    }

    try {
      const result = await sendOTP(signupEmail);
      if (result && result.existingUser) {
        setActiveTab('login');
        setLoginEmail(signupEmail);
        toast.error('This email already exists. Try signing in.');
        return;
      }
      setShowOTPInput(true);
      toast.success('OTP sent! Please check your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (signupPassword !== signupConfirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Verify all required fields
      if (!signupFirstName || !signupLastName || !signupEmail || !signupPassword) {
        setError('Please fill in all required fields');
        return;
      }

      // Optional: validate phone format if provided
      if (signupPhone) {
        const phoneRegex = /^\+?\d{7,15}$/;
        if (!phoneRegex.test(signupPhone)) {
          setError('Please enter a valid phone number (digits, optional leading +)');
          return;
        }
      }

      if (!otp || otp.length !== 6) {
        setError('Please enter a valid OTP');
        return;
      }

      // Create account with OTP verification
      await register(
        signupEmail,
        signupPassword,
        signupFirstName,
        signupLastName,
        signupPhone,
        otp,
        userType
      );
      
      toast.success('Account created successfully!');
      
      if (onNavigate) {
        if (userType === 'caregiver') onNavigate('caregiver-signup');
        else onNavigate('book-care');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pt-16">
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side - Hero Content */}
  <div ref={heroRef as any} className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join the NeoNest Community
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with trusted caregivers or find meaningful work supporting families during their most important moments.
            </p>

            {/* Benefits */}
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">"{testimonial.content}"</p>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <p className="text-muted-foreground">Sign in to your NeoNest account</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email"
                          className="pl-10"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">Remember me</Label>
                      </div>
                      <Button variant="link" className="p-0 h-auto text-sm" onClick={() => { setForgotMode(true); setForgotEmail(loginEmail); }}>
                        Forgot password?
                      </Button>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    </form>

                    {/* Forgot Password Flow */}
                    {forgotMode && (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="forgotEmail">Email Address</Label>
                          <Input
                            id="forgotEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          />
                        </div>

                        {!forgotOTP ? (
                          <div className="flex gap-2">
                            <Button
                              onClick={async () => {
                                setIsLoading(true);
                                try {
                                  const res = await sendResetOTP(forgotEmail);
                                  // in dev, backend may return otp
                                  if (res && res.otp) setForgotOTP(res.otp);
                                } catch (err: any) {
                                  setError(err.message || 'Failed to send OTP');
                                } finally {
                                  setIsLoading(false);
                                }
                              }}
                              disabled={isLoading || !forgotEmail}
                            >
                              {isLoading ? 'Sending...' : 'Send Reset Code'}
                            </Button>
                            <Button variant="ghost" onClick={() => setForgotMode(false)}>Cancel</Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>Enter Reset Code</Label>
                            <OTPInput length={6} onComplete={(c) => setForgotOTP(c)} />
                            <div className="space-y-2">
                              <Label>New Password</Label>
                              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                              <Label>Confirm New Password</Label>
                              <Input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={async () => {
                                  setIsLoading(true);
                                  setError('');
                                  try {
                                    if (!newPassword || newPassword.length < 6) {
                                      setError('Password must be at least 6 characters');
                                      return;
                                    }
                                    if (newPassword !== confirmNewPassword) {
                                      setError('Passwords do not match');
                                      return;
                                    }
                                    await resetPassword(forgotEmail, forgotOTP, newPassword);
                                    toast.success('Password reset successful. You can now sign in.');
                                    setForgotMode(false);
                                    setForgotOTP('');
                                    setNewPassword('');
                                    setConfirmNewPassword('');
                                  } catch (err: any) {
                                    setError(err.message || 'Failed to reset password');
                                  } finally {
                                    setIsLoading(false);
                                  }
                                }}
                                disabled={isLoading || !forgotOTP || !newPassword}
                              >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                              </Button>
                              <Button variant="ghost" onClick={() => setForgotMode(false)}>Cancel</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup">
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">Create Account</CardTitle>
                    <p className="text-muted-foreground">Join the NeoNest community</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSignup} className="space-y-6">
                    {/* User Type Selection */}
                    <div className="space-y-3">
                      <Label>I am a:</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Card 
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            userType === 'user' ? 'ring-2 ring-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setUserType('user')}
                        >
                          <CardContent className="p-4 text-center">
                            <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                            <p className="font-medium">Parent</p>
                            <p className="text-xs text-muted-foreground">Looking for care</p>
                          </CardContent>
                        </Card>
                        <Card 
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            userType === 'caregiver' ? 'ring-2 ring-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setUserType('caregiver')}
                        >
                          <CardContent className="p-4 text-center">
                            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                            <p className="font-medium">Caregiver</p>
                            <p className="text-xs text-muted-foreground">Providing care</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input 
                            id="firstName" 
                            placeholder="First name"
                            className="pl-10"
                            value={signupFirstName}
                            onChange={(e) => setSignupFirstName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Last name"
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="signupEmail" 
                          type="email" 
                          placeholder="Enter your email"
                          className="pl-10"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="Enter your phone number"
                          className="pl-10"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="signupPassword" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                          id="confirmPassword" 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" className="mt-1" />
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          I agree to the <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox id="marketing" className="mt-1" />
                        <Label htmlFor="marketing" className="text-sm leading-relaxed">
                          I would like to receive updates and promotional emails from NeoNest
                        </Label>
                      </div>
                    </div>

                    {showOTPInput ? (
                      <div className="space-y-4">
                        <Label>Enter Verification Code</Label>
                        <OTPInput length={6} onComplete={(code) => setOTP(code)} />
                        <p className="text-sm text-muted-foreground text-center">A verification code has been sent to your email</p>
                      </div>
                    ) : null}

                    <div className="mt-4">
                      {!showOTPInput ? (
                        <Button
                          type="button"
                          onClick={handleSendOTP}
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                          disabled={isLoading || !signupEmail}
                        >
                          {isLoading ? 'Sending OTP...' : 'Send OTP'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <Button type="button" variant="outline" onClick={handleSendOTP} disabled={isLoading}>
                            Resend Code
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                            disabled={isLoading || !otp || otp.length !== 6}
                        
                          >
                            {isLoading ? 'Creating Account...' : 'Verify & Create Account'}
                          </Button>
                        </div>
                      )}
                    </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <Badge variant="outline" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Secure & HIPAA Compliant
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}