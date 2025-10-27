import { useState, useEffect } from 'react';
import { ArrowRight, Calendar, MapPin, Heart, Clock, Star, User, Baby, Shield, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PaymentForm } from './PaymentForm';

export function BookCareWorkflow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState('');
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string>('');
  
  const { elementRef: heroRef } = useScrollAnimation();

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Validation functions
  const validateStep1 = () => {
    return selectedCity && selectedServices.length > 0;
  };

  const validateStep2 = () => {
    return selectedCaregiver !== '';
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return true; // Step 3 doesn't have required fields for now
      case 4:
        return true; // Payment step - can proceed after payment
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(Math.min(steps.length, currentStep + 1));
      setShowValidationErrors(false);
    } else {
      setShowValidationErrors(true);
    }
  };

  const handleCardClick = (caregiverId: string) => {
    // Only allow card selection if we're on step 2 and step 1 is completed
    if (currentStep === 2 && validateStep1()) {
      setSelectedCaregiver(caregiverId);
    }
  };

  const handlePaymentSuccess = (data: any) => {
    setPaymentData(data);
    setPaymentCompleted(true);
    setPaymentError('');
    // Go to confirmation step
    setTimeout(() => {
      setCurrentStep(5);
    }, 1000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setPaymentCompleted(false);
  };

  const cities = [
    { id: 'mumbai', name: 'Mumbai', caregivers: 156, avgRate: '₹300-500/hour' },
    { id: 'delhi', name: 'Delhi', caregivers: 134, avgRate: '₹250-450/hour' },
    { id: 'bangalore', name: 'Bangalore', caregivers: 98, avgRate: '₹200-400/hour' },
    { id: 'pune', name: 'Pune', caregivers: 76, avgRate: '₹180-350/hour' },
    { id: 'hyderabad', name: 'Hyderabad', caregivers: 62, avgRate: '₹150-300/hour' },
    { id: 'chennai', name: 'Chennai', caregivers: 54, avgRate: '₹160-320/hour' },
  ];

  const services = [
    {
      id: 'newborn-care',
      name: 'Newborn Care',
      description: 'Comprehensive care for babies 0-3 months',
      rate: '₹300-500/hour',
      duration: 'Minimum 4 hours',
      popular: true
    },
    {
      id: 'postpartum-support',
      name: 'Postpartum Support',
      description: 'Support for new mothers during recovery',
      rate: '₹250-400/hour',
      duration: 'Flexible timing',
      popular: true
    },
    {
      id: 'night-care',
      name: 'Night Care',
      description: 'Overnight baby care and feeding support',
      rate: '₹400-600/hour',
      duration: '8-12 hour shifts',
      popular: false
    },
    {
      id: 'breastfeeding-support',
      name: 'Breastfeeding Support',
      description: 'Lactation consultation and guidance',
      rate: '₹300-450/hour',
      duration: '2-3 hour sessions',
      popular: true
    },
    {
      id: 'baby-massage',
      name: 'Baby Massage',
      description: 'Therapeutic massage for baby development',
      rate: '₹200-300/hour',
      duration: '1-2 hour sessions',
      popular: false
    },
    {
      id: 'sleep-training',
      name: 'Sleep Training',
      description: 'Help establish healthy sleep routines',
      rate: '₹350-500/hour',
      duration: 'Multiple sessions',
      popular: false
    }
  ];

  const caregivers = [
    {
      id: '1',
      name: 'Priya Sharma',
      experience: '8 years',
      rating: 4.9,
      reviews: 156,
      rate: '₹350/hour',
      specialties: ['Newborn Care', 'Postpartum Support'],
      languages: ['Hindi', 'English'],
      verified: true,
      image: 'indian caregiver woman',
      bio: 'Experienced childcare specialist with expertise in newborn care and postpartum support.',
      availability: 'Available today',
      badges: ['Top Rated', 'Verified']
    },
    {
      id: '2',
      name: 'Sunita Devi',
      experience: '12 years',
      rating: 4.8,
      reviews: 203,
      rate: '₹320/hour',
      specialties: ['Night Care', 'Baby Massage'],
      languages: ['Hindi', 'English', 'Bengali'],
      verified: true,
      image: 'experienced caregiver',
      bio: 'Senior caregiver specializing in night care and traditional baby massage techniques.',
      availability: 'Available tomorrow',
      badges: ['Senior Expert', 'Night Specialist']
    },
    {
      id: '3',
      name: 'Meera Iyer',
      experience: '5 years',
      rating: 4.9,
      reviews: 89,
      rate: '₹380/hour',
      specialties: ['Breastfeeding Support', 'Sleep Training'],
      languages: ['Tamil', 'English', 'Hindi'],
      verified: true,
      image: 'lactation consultant',
      bio: 'Certified lactation consultant with experience in sleep training and infant care.',
      availability: 'Available today',
      badges: ['Lactation Expert', 'Sleep Specialist']
    },
    {
      id: '4',
      name: 'Anjali Reddy',
      experience: '6 years',
      rating: 4.7,
      reviews: 124,
      rate: '₹300/hour',
      specialties: ['Newborn Care', 'Baby Massage'],
      languages: ['Telugu', 'English', 'Hindi'],
      verified: true,
      image: 'baby care specialist',
      bio: 'Compassionate caregiver with strong background in newborn care and development.',
      availability: 'Available in 2 hours',
      badges: ['Newborn Expert', 'Gentle Care']
    },
    {
      id: '5',
      name: 'Kavita Singh',
      experience: '10 years',
      rating: 4.8,
      reviews: 178,
      rate: '₹340/hour',
      specialties: ['Postpartum Support', 'Night Care'],
      languages: ['Hindi', 'Punjabi', 'English'],
      verified: true,
      image: 'postpartum care specialist',
      bio: 'Experienced in comprehensive postpartum care and emotional support for new mothers.',
      availability: 'Available today',
      badges: ['Postpartum Expert', 'Emotional Support']
    },
    {
      id: '6',
      name: 'Deepika Nair',
      experience: '4 years',
      rating: 4.6,
      reviews: 67,
      rate: '₹280/hour',
      specialties: ['Baby Massage', 'Sleep Training'],
      languages: ['Malayalam', 'English'],
      verified: true,
      image: 'young caregiver',
      bio: 'Young and energetic caregiver with modern approaches to baby care and development.',
      availability: 'Available tomorrow',
      badges: ['Rising Star', 'Modern Methods']
    }
  ];

  const steps = [
    { id: 1, title: 'Care Details', icon: Baby },
    { id: 2, title: 'Select Caregiver', icon: User },
    { id: 3, title: 'Schedule & Book', icon: Calendar },
    { id: 4, title: 'Payment', icon: Shield },
    { id: 5, title: 'Confirmation', icon: Shield }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Tell us what you need</h2>
              <p className="text-muted-foreground">Help us find the perfect caregiver for your family</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Your City *</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{city.name}</span>
                        <div className="ml-4 text-sm text-muted-foreground">
                          {city.caregivers} caregivers • {city.avgRate}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCity && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">
                        {cities.find(c => c.id === selectedCity)?.caregivers} verified caregivers available
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Average rates: {cities.find(c => c.id === selectedCity)?.avgRate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <Label>Services Needed (Select all that apply)</Label>
              <div className="grid gap-4">
                {services.map((service) => (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedServices.includes(service.id) ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      if (selectedServices.includes(service.id)) {
                        setSelectedServices(selectedServices.filter(s => s !== service.id));
                      } else {
                        setSelectedServices([...selectedServices, service.id]);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox 
                          checked={selectedServices.includes(service.id)}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{service.name}</h4>
                            {service.popular && (
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium text-primary">{service.rate}</span>
                            <span>• {service.duration}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="babyAge">Baby's Age</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newborn">Newborn (0-1 month)</SelectItem>
                    <SelectItem value="infant">Infant (1-6 months)</SelectItem>
                    <SelectItem value="baby">Baby (6-12 months)</SelectItem>
                    <SelectItem value="toddler">Toddler (1-2 years)</SelectItem>
                    <SelectItem value="expecting">Expecting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">When do you need care?</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (within 2 hours)</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="this-week">This week</SelectItem>
                    <SelectItem value="next-week">Next week</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="special-needs">Special Requirements or Preferences</Label>
              <Textarea 
                id="special-needs" 
                placeholder="Any specific needs, allergies, preferences, or instructions for the caregiver..."
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Choose Your Caregiver</h2>
              <p className="text-muted-foreground">
                {selectedCity ? `${cities.find(c => c.id === selectedCity)?.caregivers} verified caregivers in ${cities.find(c => c.id === selectedCity)?.name}` : 'Select from our verified caregivers'}
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search by name, specialty, or language..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Step 1 Completion Check */}
            {!validateStep1() && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <div className="w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <span className="font-medium">Please complete Step 1 first</span>
                </div>
                <p className="mt-1 text-sm text-yellow-600">
                  You need to select your city and services before choosing a caregiver.
                </p>
              </div>
            )}

            {/* Caregivers Grid */}
            <div className="space-y-4">
              {caregivers.map((caregiver, index) => (
                <Card 
                  key={caregiver.id} 
                  className={`transition-all duration-200 animate-fadeInUp ${
                    validateStep1() 
                      ? 'cursor-pointer hover:shadow-lg' 
                      : 'cursor-not-allowed opacity-50'
                  } ${
                    selectedCaregiver === caregiver.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleCardClick(caregiver.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={`https://source.unsplash.com/100x100/?${encodeURIComponent(caregiver.image)}`} />
                          <AvatarFallback>{caregiver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {caregiver.verified && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Shield className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{caregiver.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {caregiver.experience} experience
                              <span className="text-green-600 font-medium ml-2">{caregiver.availability}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{caregiver.rate}</div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{caregiver.rating}</span>
                              <span className="text-sm text-muted-foreground">({caregiver.reviews})</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{caregiver.bio}</p>

                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Specialties: </span>
                            <span className="text-sm">{caregiver.specialties.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Languages: </span>
                            <span className="text-sm">{caregiver.languages.join(', ')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          {caregiver.badges.map((badge) => (
                            <Badge key={badge} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View Profile Button */}
            {selectedCaregiver && (
              <div className="text-center">
                <Button variant="outline">
                  View Full Profile & Reviews
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Schedule Your Care</h2>
              <p className="text-muted-foreground">Choose your preferred dates and times</p>
            </div>

            {/* Selected Caregiver Summary */}
            {selectedCaregiver && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  {(() => {
                    const caregiver = caregivers.find(c => c.id === selectedCaregiver);
                    return caregiver ? (
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`https://source.unsplash.com/100x100/?${encodeURIComponent(caregiver.image)}`} />
                          <AvatarFallback>{caregiver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{caregiver.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{caregiver.rating} ({caregiver.reviews} reviews)</span>
                            <span>• {caregiver.rate}</span>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (if ongoing care)</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {i.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="8">8 hours (full day)</SelectItem>
                    <SelectItem value="12">12 hours (overnight)</SelectItem>
                    <SelectItem value="24">24 hours (live-in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <RadioGroup defaultValue="one-time" className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time">One-time service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly recurring</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily recurring</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom schedule</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Service Address *</Label>
              <Textarea 
                id="address" 
                placeholder="Enter complete address where care will be provided"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea 
                id="instructions" 
                placeholder="Any specific instructions, preferences, or important information for the caregiver..."
                rows={3}
              />
            </div>

            {/* Cost Estimate */}
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Estimated Cost</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Base rate (4 hours)</span>
                    <span>₹1,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee</span>
                    <span>₹140</span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-900 dark:text-green-100 border-t pt-1">
                    <span>Total</span>
                    <span>₹1,540</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
              <p className="text-muted-foreground">Secure payment to confirm your booking</p>
            </div>

            {/* Payment Summary */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Service Fee (4 hours)</span>
                    <span>₹1,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Platform Fee</span>
                    <span>₹100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GST (18%)</span>
                    <span>₹40</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span className="text-primary">₹1,540</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Error */}
            {paymentError && (
              <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-xs font-bold">!</span>
                    </div>
                    <span className="font-medium">Payment Error</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {paymentError}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Payment Form */}
            <PaymentForm
              amount={1540}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-green-900 dark:text-green-100">Booking Confirmed!</h2>
              <p className="text-muted-foreground">Your care request has been submitted and confirmed</p>
            </div>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Booking ID</span>
                  <span className="font-mono">#NC2024001</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Caregiver</span>
                  <span>Priya Sharma</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service Date</span>
                  <span>Today, Dec 15, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Amount</span>
                  <span className="font-semibold text-primary">₹1,540</span>
                </div>
                {paymentData && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Payment Method</span>
                      <span className="capitalize">{paymentData.method}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Transaction ID</span>
                      <span className="font-mono text-sm">{paymentData.transactionId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Status</span>
                      <span className="text-green-600 font-medium">✓ Completed</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">What happens next?</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Caregiver will contact you within 30 minutes to confirm details
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                    </div>
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Track your caregiver's arrival via the NeoNest app
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                    </div>
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Enjoy peace of mind with professional care
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Emergency Contact</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">24/7 Support:</span>
                    <span className="font-medium">+91 1800-NEO-NEST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">WhatsApp:</span>
                    <span className="font-medium">+91 98765 43210</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Payment Status</div>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Payment Completed Successfully</span>
                </div>
              </div>
              <div>
                <Button variant="outline" asChild>
                  <a href="/">Return to Home</a>
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section - Only show on first step */}
      {currentStep === 1 && (
        <section ref={heroRef} className="py-16 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Book Trusted Care
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Connect with verified, experienced caregivers in your city. 
                Professional maternal and baby care, available when you need it most.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Verified Caregivers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Happy Families</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step Content */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${currentStep === 1 ? 'pt-16' : 'pt-24'}`}>
        {/* Step Navigation */}
        <div className="flex items-center justify-center mb-8 mt-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isCompleted 
                    ? 'bg-green-100 border-green-500 text-green-600' 
                    : isActive 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="ml-3 mr-6 text-sm">
                  <div className={`font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 transition-all ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content Card */}
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            {renderStepContent()}
            
            {/* Validation Error Messages */}
            {showValidationErrors && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <span className="font-medium">Please complete the required fields:</span>
                </div>
                <ul className="mt-2 ml-6 text-sm text-red-600">
                  {currentStep === 1 && !selectedCity && <li>• Please select your city</li>}
                  {currentStep === 1 && selectedServices.length === 0 && <li>• Please select at least one service</li>}
                  {currentStep === 2 && !selectedCaregiver && <li>• Please select a caregiver</li>}
                </ul>
              </div>
            )}
            
            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                <Button 
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                >
                  {currentStep === 3 ? 'Proceed to Payment' : currentStep === 4 ? 'Complete Payment' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}