import { useState } from 'react';
import { Check, Star, Crown, Heart, Shield, MapPin, TrendingUp, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useScrollAnimation, useStaggeredAnimation } from './hooks/useScrollAnimation';

const cities = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    tier: 'Tier 1',
    multiplier: 1.0,
    demand: 'Very High',
    caregivers: 156
  },
  {
    id: 'delhi',
    name: 'Delhi',
    tier: 'Tier 1',
    multiplier: 0.9,
    demand: 'Very High',
    caregivers: 134
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    tier: 'Tier 1',
    multiplier: 0.85,
    demand: 'High',
    caregivers: 98
  },
  {
    id: 'pune',
    name: 'Pune',
    tier: 'Tier 2',
    multiplier: 0.75,
    demand: 'High',
    caregivers: 76
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    tier: 'Tier 2',
    multiplier: 0.7,
    demand: 'Growing',
    caregivers: 62
  },
  {
    id: 'chennai',
    name: 'Chennai',
    tier: 'Tier 2',
    multiplier: 0.72,
    demand: 'High',
    caregivers: 54
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    tier: 'Tier 2',
    multiplier: 0.65,
    demand: 'Growing',
    caregivers: 42
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    tier: 'Tier 2',
    multiplier: 0.68,
    demand: 'Medium',
    caregivers: 38
  }
];

const basePlans = [
  {
    id: 'basic',
    name: 'Essential Care',
    basePrice: 350,
    duration: 'per session',
    sessionLength: '2-3 hours',
    description: 'Perfect for first-time mothers needing basic newborn care and guidance',
    detailedDescription: 'Our Essential Care plan provides fundamental support for new mothers adjusting to life with their newborn. Ideal for families who need professional guidance on basic baby care techniques, feeding support, and initial postpartum recovery assistance.',
    icon: Heart,
    color: 'from-primary/10 to-primary/5',
    borderColor: 'border-primary/20',
    popular: false,
    features: [
      'Basic newborn care (2-3 hours)',
      'Feeding support & guidance',
      'Diaper changing & hygiene',
      'Sleep positioning & safety',
      'Basic health monitoring',
      'Care notes & reports',
      'WhatsApp support during service',
      'Initial postpartum guidance'
    ],
    careTypes: [
      'Newborn handling and positioning',
      'Feeding techniques (breast & bottle)',
      'Basic baby massage',
      'Sleep routine establishment',
      'Hygiene and safety practices'
    ],
    idealFor: [
      'First-time mothers',
      'Single session needs',
      'Basic care guidance',
      'Budget-conscious families'
    ],
    cta: 'Book Essential Care',
  },
  {
    id: 'standard',
    name: 'Complete Care',
    basePrice: 650,
    duration: 'per session',
    sessionLength: '4-6 hours',
    description: 'Comprehensive maternal and baby care with extended support and guidance',
    detailedDescription: 'Our most popular plan offers comprehensive care for both mother and baby. Includes extended sessions with experienced caregivers who provide maternal support, baby care, and family guidance to ensure a smooth transition during the early weeks.',
    icon: Star,
    color: 'from-secondary/10 to-secondary/5',
    borderColor: 'border-secondary',
    popular: true,
    features: [
      'Extended care session (4-6 hours)',
      'Newborn & maternal care',
      'Breastfeeding assistance',
      'Therapeutic baby massage (30 min)',
      'Maternal nutrition guidance',
      'AI assistant access',
      '24/7 phone support',
      'Customized care plan',
      'Light meal preparation',
      'Nursery organization'
    ],
    careTypes: [
      'Comprehensive newborn care',
      'Postpartum maternal support',
      'Breastfeeding consultation',
      'Baby development activities',
      'Maternal wellness monitoring'
    ],
    idealFor: [
      'New mothers needing comprehensive support',
      'Families with specific care needs',
      'Regular weekly sessions',
      'Mothers recovering from delivery'
    ],
    cta: 'Choose Complete Care',
  },
  {
    id: 'premium',
    name: 'Luxury Wellness',
    basePrice: 1200,
    duration: 'per session',
    sessionLength: '8+ hours',
    description: 'Premium full-day care with dedicated caregiver and luxury wellness services',
    detailedDescription: 'Our premium plan offers luxury maternal and baby care with a dedicated caregiver for extended periods. Includes comprehensive wellness services, meal preparation, household support, and personalized care plans for the ultimate postpartum experience.',
    icon: Crown,
    color: 'from-accent/10 to-accent/5',
    borderColor: 'border-accent/20',
    popular: false,
    features: [
      'Full day care (8+ hours)',
      'Dedicated senior caregiver',
      'Complete maternal wellness program',
      'Extended therapeutic massage (60 min)',
      'Nutritious meal preparation',
      'Household organization support',
      'Emergency on-call service',
      'Family guidance session',
      'Premium AI features',
      'Lactation specialist consultation',
      'Sleep training support',
      'Postpartum fitness guidance'
    ],
    careTypes: [
      'Comprehensive newborn and maternal care',
      'Wellness and recovery programs',
      'Advanced baby development support',
      'Maternal mental health support',
      'Family adaptation guidance'
    ],
    idealFor: [
      'Mothers needing intensive support',
      'Families with multiples',
      'Premium care experience',
      'Extended recovery needs'
    ],
    cta: 'Experience Luxury Care',
  },
];

export function Plans() {
  const [selectedCity, setSelectedCity] = useState('mumbai');
  const [viewMode, setViewMode] = useState<'plans' | 'details'>('plans');
  
  const { elementRef: heroRef } = useScrollAnimation();
  const { containerRef: plansRef } = useStaggeredAnimation(3, 200);
  const { containerRef: cityRef } = useStaggeredAnimation(8, 100);

  const selectedCityData = cities.find(city => city.id === selectedCity) || cities[0];
  
  const calculatePrice = (basePrice: number) => {
    return Math.round(basePrice * selectedCityData.multiplier);
  };

  return (
    <section id="plans" className="py-20 bg-gradient-to-b from-background to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div ref={heroRef} className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Care Plans & Pricing
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Transparent, city-specific pricing for professional maternal and baby care. 
            All plans include our safety guarantee and satisfaction promise.
          </p>
          
          {/* City Selector */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">Select Your City</span>
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="text-lg py-3">
                <SelectValue placeholder="Choose your city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{city.name}</span>
                      <div className="ml-4 text-sm text-muted-foreground">
                        {city.tier} • {city.demand} demand
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* City Info */}
        <Card className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">{selectedCityData.name} Market</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedCityData.caregivers} caregivers
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {selectedCityData.demand} demand
                  </div>
                  <Badge variant="outline">{selectedCityData.tier}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {selectedCityData.multiplier === 1.0 ? 'Base' : `${Math.round((1 - selectedCityData.multiplier) * 100)}% less`}
                </div>
                <div className="text-sm text-muted-foreground">than Mumbai rates</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle and Content */}
        <div className="text-center mb-8">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'plans' | 'details')} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
                <TabsTrigger value="details">Detailed Comparison</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="plans">
              {/* Plans Grid */}
              <div ref={plansRef} className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                {basePlans.map((plan) => {
                  const Icon = plan.icon;
                  const isPopular = plan.popular;
                  const cityPrice = calculatePrice(plan.basePrice);
                  
                  return (
                    <Card 
                      key={plan.id}
                      className={`opacity-0 relative group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                        isPopular ? 'ring-2 ring-secondary shadow-xl scale-105' : 'shadow-lg'
                      } border-0 overflow-hidden`}
                    >
                      {isPopular && (
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-20">
                          <Badge className="bg-gradient-to-r from-secondary to-primary text-primary-foreground px-4 py-1 rounded-full shadow-md">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-50`}></div>
                      
                      <CardHeader className="relative z-10 text-center p-8">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold text-foreground">₹{cityPrice}</span>
                            <span className="text-muted-foreground ml-1">/{plan.duration}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {plan.sessionLength} • {selectedCityData.name}
                          </div>
                          {selectedCityData.multiplier !== 1.0 && (
                            <div className="text-xs text-primary mt-1">
                              Base price: ₹{plan.basePrice} (Mumbai)
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="relative z-10 p-8 pt-0">
                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <Button 
                          className={`w-full py-6 rounded-xl font-medium transition-all duration-300 ${
                            isPopular 
                              ? 'bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105' 
                              : 'bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground hover:from-primary/20 hover:to-secondary/20 border border-primary/20'
                          }`}
                        >
                          {plan.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="details">
              {/* Detailed Comparison */}
              <div className="space-y-8">
                {basePlans.map((plan) => {
                  const Icon = plan.icon;
                  const cityPrice = calculatePrice(plan.basePrice);
                  
                  return (
                    <Card key={plan.id} className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl">{plan.name}</CardTitle>
                              <p className="text-muted-foreground">{plan.sessionLength} sessions</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary">₹{cityPrice}</div>
                            <div className="text-sm text-muted-foreground">per session in {selectedCityData.name}</div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold mb-4">About This Plan</h4>
                            <p className="text-muted-foreground leading-relaxed mb-6">{plan.detailedDescription}</p>
                            
                            <h4 className="font-semibold mb-3">Ideal For</h4>
                            <ul className="space-y-2">
                              {plan.idealFor.map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <Heart className="w-4 h-4 text-primary" />
                                  <span className="text-sm">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3">Care Services Included</h4>
                            <ul className="space-y-2 mb-6">
                              {plan.careTypes.map((type, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                                  <span className="text-sm">{type}</span>
                                </li>
                              ))}
                            </ul>
                            
                            <h4 className="font-semibold mb-3">All Features</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <Check className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                                  <span className="text-xs text-muted-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t">
                          <Button 
                            className={`${
                              plan.popular 
                                ? 'bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90' 
                                : 'bg-primary hover:bg-primary/90'
                            } px-8 py-3 rounded-xl`}
                          >
                            {plan.cta}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* City Comparison */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Pricing Across Cities</h3>
            <p className="text-muted-foreground">Local pricing reflects cost of living and market conditions</p>
          </div>
          
          <div ref={cityRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Card 
                key={city.id} 
                className="opacity-0 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold mb-1">{city.name}</h4>
                  <Badge variant="outline" className="mb-2 text-xs">{city.tier}</Badge>
                  <div className="text-sm text-muted-foreground">
                    <div>₹{calculatePrice(650)} (Standard)</div>
                    <div className="text-xs">{city.caregivers} caregivers</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">All plans include safety guarantee & insurance</span>
          </div>
          
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Prices may vary based on specific requirements, caregiver experience level, and session timing. 
            Our care coordinators will provide exact pricing during consultation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-xl"
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Get Custom Quote
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-xl"
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}