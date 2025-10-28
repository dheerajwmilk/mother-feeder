import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Upload, MapPin, Heart, Shield, Star, Clock, Award, GraduationCap, Users, BookOpen, PlayCircle, Target, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useScrollAnimation } from './hooks/useScrollAnimation';

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

interface CaregiverWorkflowProps {
  onNavigate?: (view: AppView) => void;
}

export function CaregiverWorkflow({ onNavigate }: CaregiverWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0); // Start with step 0 for experience assessment
  const [selectedCity, setSelectedCity] = useState('');
  const [isZeroExperience, setIsZeroExperience] = useState<boolean | null>(null);
  const [showTrainingPath, setShowTrainingPath] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [availabilityDays, setAvailabilityDays] = useState<Record<string, boolean>>({ Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false });
  const [startTime, setStartTime] = useState<string>('');    
  const [endTime, setEndTime] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [languages, setLanguages] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [docUploads, setDocUploads] = useState<Record<string, { url?: string; uploading: boolean; error?: string }>>({
    government_id: { uploading: false },
    address_proof: { uploading: false },
    medical_certificate: { uploading: false },
    experience_certificate: { uploading: false },
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'approved' | 'rejected' | 'none'>('none');
  const [statusLoading, setStatusLoading] = useState(false);
  
  const heroHook = useScrollAnimation();
  const benefitsHook = useScrollAnimation();
  const heroRef = (heroHook.elementRef as unknown) as React.RefObject<HTMLDivElement>;
  const benefitsRef = (benefitsHook.elementRef as unknown) as React.RefObject<HTMLDivElement>;

  // Reusable upload dropzone
  const UploadDropzone: React.FC<{
    docKey: 'government_id' | 'address_proof' | 'medical_certificate' | 'experience_certificate';
    placeholder: string;
    typeField: string;
    inputId: string;
  }> = ({ docKey, placeholder, typeField, inputId }) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const startUpload = async (file: File) => {
      setDocUploads((s) => ({ ...s, [docKey]: { uploading: true } } as any));
      try {
        const token = localStorage.getItem('neonest_token');
        const form = new FormData();
        form.append('file', file);
        form.append('type', typeField);
        const res = await fetch('http://localhost:5000/api/caretaker/upload', {
          method: 'POST',
          headers: { Authorization: token ? `Bearer ${token}` : '' },
          body: form,
        });
        const data = await res.json();
        if (res.ok && data?.url) setDocUploads((s) => ({ ...s, [docKey]: { uploading: false, url: data.url } } as any));
        else setDocUploads((s) => ({ ...s, [docKey]: { uploading: false, error: data?.message || 'Upload failed' } } as any));
      } catch (err: any) {
        setDocUploads((s) => ({ ...s, [docKey]: { uploading: false, error: err?.message || 'Upload error' } } as any));
      }
    };

    const onDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer?.files?.[0];
      if (!file) return;
      await startUpload(file);
    };

    const onBrowseChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await startUpload(file);
      // reset input so same file can be selected again if needed
      e.currentTarget.value = '';
    };

    const state = docUploads[docKey];

    return (
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={onDrop}
        className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm text-muted-foreground cursor-pointer hover:border-primary"
      >
        {state?.uploading ? 'Uploading...' : state?.error ? `Upload failed: ${state.error}` : (state?.url ? 'Uploaded ✓' : placeholder)}
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onBrowseChange}
        />
      </div>
    );
  };

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Fetch caretaker application status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setStatusLoading(true);
        const token = localStorage.getItem('neonest_token');
        if (!token) { setApplicationStatus('none'); return; }
        const res = await fetch('http://localhost:5000/api/caretaker/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data?.profile) {
          if (data.profile.profileCompleted) {
            setApplicationStatus((data.profile.status as any) || 'pending');
          } else {
            setApplicationStatus('none');
          }
        } else {
          setApplicationStatus('none');
        }
      } catch {
        setApplicationStatus('none');
      } finally {
        setStatusLoading(false);
      }
    };
    fetchStatus();
  }, []);

  // Validation functions for each step
  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (step === 0) {
      // Step 0: Experience Assessment - User must answer Yes or No
      if (isZeroExperience === null) errors.push('Please answer the experience question');
    } else if (step === 1) {
      // Step 1: Personal Information - No required fields (all optional)
      // This step just collects optional personal information
    } else if (step === 2) {
      // Step 2: Experience & Skills
      if (!selectedCity) errors.push('City selection is required');
      if (!experienceLevel) errors.push('Years of childcare experience is required');
      if (selectedServices.length === 0) errors.push('Select at least one service to offer');
      if (!about || about.trim() === '') errors.push('"Why do you want to be a caregiver?" is required');
    } else if (step === 3) {
      // Step 3: Verification Documents
      if (!docUploads.government_id?.url) errors.push('Government ID is required');
      if (!docUploads.address_proof?.url) errors.push('Address proof is required');
    } else if (step === 4) {
      // Step 4: Availability & Rates
      const daysSelected = Object.values(availabilityDays).some(day => day);
      if (!daysSelected) errors.push('Select at least one availability day');
      if (!startTime) errors.push('Start time is required');
      if (!endTime) errors.push('End time is required');
      if (!hourlyRate || parseFloat(hourlyRate) <= 0) errors.push('Valid hourly rate is required');
    } else if (step === 5) {
      // Step 5: Background Check - This is just informational, no validation needed
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const regularSteps = [
    { id: 0, title: 'Experience Assessment', icon: BookOpen },
    { id: 1, title: 'Personal Information', icon: Users },
    { id: 2, title: 'Experience & Skills', icon: Award },
    { id: 3, title: 'Verification Documents', icon: Shield },
    { id: 4, title: 'Availability & Rates', icon: Clock },
    { id: 5, title: 'Background Check', icon: CheckCircle },
  ];

  const trainingSteps = [
    { id: 0, title: 'Experience Assessment', icon: BookOpen },
    { id: 1, title: 'Personal Information', icon: Users },
    { id: 2, title: 'Training Program Enrollment', icon: GraduationCap },
    { id: 3, title: 'Free Training Modules', icon: Star },
    { id: 4, title: 'Skills Certification', icon: Award },
    { id: 5, title: 'Verification Documents', icon: Shield },
    { id: 6, title: 'Availability & Rates', icon: Clock },
    { id: 7, title: 'Background Check', icon: CheckCircle },
  ];

  const steps = showTrainingPath ? trainingSteps : regularSteps;

  const cities = [
    { id: 'mumbai', name: 'Mumbai', avgRate: '₹300-500/hour', demand: 'High' },
    { id: 'delhi', name: 'Delhi', avgRate: '₹250-450/hour', demand: 'High' },
    { id: 'bangalore', name: 'Bangalore', avgRate: '₹200-400/hour', demand: 'Medium' },
    { id: 'pune', name: 'Pune', avgRate: '₹180-350/hour', demand: 'Medium' },
    { id: 'hyderabad', name: 'Hyderabad', avgRate: '₹150-300/hour', demand: 'Growing' },
    { id: 'chennai', name: 'Chennai', avgRate: '₹160-320/hour', demand: 'Medium' },
  ];

  const caregiverBenefits = [
    {
      icon: Heart,
      title: 'Meaningful Work',
      description: 'Make a real difference in families\' lives during their most important moments',
      highlight: 'Purpose-driven'
    },
    {
      icon: Shield,
      title: 'Safety & Security',
      description: 'Complete background verification and insurance coverage for all caregivers',
      highlight: 'Fully Protected'
    },
    {
      icon: Star,
      title: 'Professional Growth',
      description: 'Continuous training, certifications, and skill development programs',
      highlight: 'Career Building'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Choose your own hours and availability to match your lifestyle',
      highlight: 'Work-Life Balance'
    }
  ];

  const requirements = showTrainingPath ? [
    'Age 18-55 years',
    'Willingness to learn and grow',
    'Clear background check',
    'Basic health certification',
    'Communication skills in local language',
    'Smartphone for app access'
  ] : [
    'Age 21-55 years',
    'Minimum 6 months childcare experience',
    'Clear background check',
    'Basic health certification',
    'Communication skills in local language',
    'Smartphone for app access'
  ];

  const services = [
    { name: 'Newborn Care', rate: '₹300-500/hour', demand: 'Very High' },
    { name: 'Baby Massage', rate: '₹200-300/hour', demand: 'High' },
    { name: 'Night Care', rate: '₹400-600/hour', demand: 'High' },
    { name: 'Postpartum Support', rate: '₹250-400/hour', demand: 'Medium' },
    { name: 'Breastfeeding Support', rate: '₹300-450/hour', demand: 'High' },
    { name: 'Sleep Training', rate: '₹350-500/hour', demand: 'Medium' },
  ];

  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Let's Find Your Perfect Path</h2>
              <p className="text-muted-foreground">
                We want to ensure you have the best experience joining our caregiver community
              </p>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 text-center">
                  Do you have any previous childcare or professional work experience?
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                      isZeroExperience === false ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setIsZeroExperience(false);
                      setShowTrainingPath(false);
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">Yes, I have experience</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        I have worked in childcare, healthcare, or other professional roles before
                      </p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Direct Application
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                      isZeroExperience === true ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/50'
                    }`}
                    onClick={() => {
                      setIsZeroExperience(true);
                      setShowTrainingPath(true);
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <Star className="w-12 h-12 text-secondary mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">No, I'm new to working</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        This would be my first professional job, but I'm eager to learn
                      </p>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Free Training Program
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {isZeroExperience === true && (
                  <Card className="mt-6 bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-secondary mb-2">
                            🎉 Welcome to NeoNest's Empowerment Program!
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            We believe every woman deserves the opportunity to build a meaningful career. 
                            Our comprehensive training program is completely FREE and designed specifically 
                            for women entering the workforce for the first time.
                          </p>
                          <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs">Free 30-day training</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs">Certified instructors</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs">Job guarantee</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isZeroExperience === false && (
                  <Card className="mt-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Great! Your experience is valuable</h4>
                          <p className="text-sm text-muted-foreground">
                            We'll fast-track your application and focus on verifying your existing skills 
                            and experience. You'll be able to start providing care services sooner.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Tell us about yourself</h2>
              <p className="text-muted-foreground">Let's start with your basic information</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" placeholder="Enter your last name" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Complete Address *</Label>
              <Textarea id="address" placeholder="Street address, city, state, pincode" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 35 }, (_, i) => i + 21).map(age => (
                      <SelectItem key={age} value={age.toString()}>{age} years</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education Level</Label>
                <Select onValueChange={setEducation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input id="languages" placeholder="Hindi, English, etc." value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 2:
        if (showTrainingPath) {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <GraduationCap className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Welcome to NeoNest Training Program</h2>
                <p className="text-muted-foreground">
                  Let's start your journey to becoming a certified caregiver
                </p>
              </div>

              <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6 text-center">
                    📚 Your Free Training Program Includes
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="border-l-4 border-l-secondary">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <BookOpen className="w-5 h-5 text-secondary" />
                          <h4 className="font-semibold">Foundation Modules (1-2 weeks)</h4>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Child development basics</li>
                          <li>• Safety and hygiene practices</li>
                          <li>• Communication skills</li>
                          <li>• Professional ethics</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-accent">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Heart className="w-5 h-5 text-accent" />
                          <h4 className="font-semibold">Specialized Care (2-3 weeks)</h4>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Newborn care techniques</li>
                          <li>• Feeding and sleep routines</li>
                          <li>• Baby massage and comfort</li>
                          <li>• Emergency response</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Users className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold">Practical Training (1 week)</h4>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Hands-on practice sessions</li>
                          <li>• Role-playing scenarios</li>
                          <li>• Mentor supervision</li>
                          <li>• Real family interactions</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-chart-4">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Award className="w-5 h-5 text-chart-4" />
                          <h4 className="font-semibold">Certification & Support</h4>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Skills assessment test</li>
                          <li>• Official certification</li>
                          <li>• Ongoing mentorship</li>
                          <li>• Career guidance</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-100">100% Job Guarantee</h4>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Complete the program successfully and we guarantee you'll get your first job within 30 days
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">₹15,000+</div>
                          <div className="text-xs text-green-700">Average monthly earnings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">95%</div>
                          <div className="text-xs text-green-700">Training completion rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">4.8⭐</div>
                          <div className="text-xs text-green-700">Program satisfaction</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-center mt-8">
                    <h4 className="font-semibold mb-4">Ready to start your transformation journey?</h4>
                    <p className="text-sm text-muted-foreground mb-6">
                      Join thousands of women who have built successful careers through our program
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">✨ Completely Free</Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">🏆 Certified Program</Badge>
                      <Badge variant="outline" className="bg-pink-50 text-pink-700">👩‍👧‍👦 Women Empowerment</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Your Experience & Skills</h2>
                <p className="text-muted-foreground">Help us understand your caregiving background</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Select Your City *</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Childcare Experience *</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5-1">6 months - 1 year</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Services You Can Provide (Select all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.name} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                      <Checkbox id={service.name} checked={selectedServices.includes(service.name)} onCheckedChange={(c) => {
                        const checked = Boolean(c);
                        setSelectedServices((prev) =>
                          checked ? Array.from(new Set([...prev, service.name])) : prev.filter((s) => s !== service.name)
                        );
                      }} />
                      <div className="flex-1">
                        <Label htmlFor={service.name} className="font-medium cursor-pointer">{service.name}</Label>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{service.rate}</span>
                          <Badge variant="outline" className="text-xs">{service.demand} Demand</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications & Training</Label>
                <Textarea 
                  id="certifications" 
                  placeholder="List any relevant certifications (CPR, First Aid, Child Development, etc.)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="why-caregiver">Why do you want to be a caregiver? *</Label>
                <Textarea 
                  id="why-caregiver" 
                  placeholder="Tell us about your motivation and passion for childcare"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </div>
            </div>
          );
        }

      case 3:
        if (showTrainingPath) {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <PlayCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Training Modules</h2>
                <p className="text-muted-foreground">
                  Start your learning journey with our comprehensive training modules
                </p>
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Module 1: Child Development Fundamentals</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Understanding infant growth milestones</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Recognizing developmental stages</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Creating nurturing environments</span>
                      </div>
                      <Button className="w-full mt-4">Start Module 1</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-secondary/5 to-accent/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Module 2: Safety & Hygiene Practices</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">Proper handwashing techniques</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">Baby-proofing environments</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">Emergency procedures</span>
                      </div>
                      <Button variant="outline" className="w-full mt-4" disabled>
                        Unlock after Module 1
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Module 3: Newborn Care Specialization</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">Feeding techniques and schedules</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">Diaper changing and bathing</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">Sleep patterns and comfort techniques</span>
                      </div>
                      <Button variant="outline" className="w-full mt-4" disabled>
                        Unlock after Module 2
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Target className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        Your Progress Tracking
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Complete each module to unlock the next. Track your learning journey and earn certifications.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Verification Documents</h2>
                <p className="text-muted-foreground">Upload required documents for background verification</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                  <CardContent
                    className="p-6 text-center"
                  >
                    <Upload
                      className="w-12 h-12 text-muted-foreground mx-auto mb-4 cursor-pointer"
                      onClick={() => document.getElementById('file-government_id')?.click()}
                    />
                    <h3 className="font-semibold mb-2">Government ID Proof *</h3>
                    <p className="text-sm text-muted-foreground mb-4">Aadhaar Card, Passport, or Driver's License</p>
                    <div
                      onClick={() => document.getElementById('file-government_id')?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (!file) return;
                        setDocUploads((s) => ({ ...s, government_id: { uploading: true } }));
                        try {
                          const token = localStorage.getItem('neonest_token');
                          const form = new FormData();
                          form.append('file', file);
                          form.append('type', 'government_id');
                          const res = await fetch('http://localhost:5000/api/caretaker/upload', {
                            method: 'POST',
                            headers: { Authorization: token ? `Bearer ${token}` : '' },
                            body: form,
                          });
                          const data = await res.json();
                          if (res.ok && data?.url) setDocUploads((s) => ({ ...s, government_id: { uploading: false, url: data.url } }));
                          else setDocUploads((s) => ({ ...s, government_id: { uploading: false, error: data?.message || 'Upload failed' } }));
                        } catch (err: any) {
                          setDocUploads((s) => ({ ...s, government_id: { uploading: false, error: err?.message || 'Upload error' } }));
                        }
                      }}
                      className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm text-muted-foreground cursor-pointer hover:border-primary"
                    >
                      {docUploads.government_id.uploading ? 'Uploading...' : (docUploads.government_id.url ? 'Uploaded ✓' : 'Drag & drop here, or click to browse')}
                    </div>
                    <input id="file-government_id" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setDocUploads((s) => ({ ...s, government_id: { uploading: true } }));
                      try {
                        const token = localStorage.getItem('neonest_token');
                        const form = new FormData();
                        form.append('file', file);
                        form.append('type', 'government_id');
                        const res = await fetch('http://localhost:5000/api/caretaker/upload', {
                          method: 'POST',
                          headers: { Authorization: token ? `Bearer ${token}` : '' },
                          body: form,
                        });
                        const data = await res.json();
                        if (res.ok && data?.url) setDocUploads((s) => ({ ...s, government_id: { uploading: false, url: data.url } }));
                        else setDocUploads((s) => ({ ...s, government_id: { uploading: false, error: data?.message || 'Upload failed' } }));
                      } catch (err: any) {
                        setDocUploads((s) => ({ ...s, government_id: { uploading: false, error: err?.message || 'Upload error' } }));
                      }
                    }} />
                  </CardContent>
                </Card>

                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 cursor-pointer" onClick={() => document.getElementById('file-address_proof')?.click()} />
                    <h3 className="font-semibold mb-2">Address Proof *</h3>
                    <p className="text-sm text-muted-foreground mb-4">Utility Bill, Bank Statement, or Rental Agreement</p>
                    <div
                      onClick={() => document.getElementById('file-address_proof')?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (!file) return;
                        setDocUploads((s) => ({ ...s, address_proof: { uploading: true } }));
                        try {
                          const token = localStorage.getItem('neonest_token');
                          const form = new FormData();
                          form.append('file', file);
                          form.append('type', 'address_proof');
                          const res = await fetch('http://localhost:5000/api/caretaker/upload', {
                            method: 'POST',
                            headers: { Authorization: token ? `Bearer ${token}` : '' },
                            body: form,
                          });
                          const data = await res.json();
                          if (res.ok && data?.url) setDocUploads((s) => ({ ...s, address_proof: { uploading: false, url: data.url } }));
                          else setDocUploads((s) => ({ ...s, address_proof: { uploading: false, error: data?.message || 'Upload failed' } }));
                        } catch (err: any) {
                          setDocUploads((s) => ({ ...s, address_proof: { uploading: false, error: err?.message || 'Upload error' } }));
                        }
                      }}
                      className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm text-muted-foreground cursor-pointer hover:border-primary"
                    >
                      {docUploads.address_proof.uploading ? 'Uploading...' : (docUploads.address_proof.url ? 'Uploaded ✓' : 'Drag & drop here, or click to browse')}
                    </div>
                    <input id="file-address_proof" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setDocUploads((s) => ({ ...s, address_proof: { uploading: true } }));
                      try {
                        const token = localStorage.getItem('neonest_token');
                        const form = new FormData();
                        form.append('file', file);
                        form.append('type', 'address_proof');
                        const res = await fetch('http://localhost:5000/api/caretaker/upload', {
                          method: 'POST',
                          headers: { Authorization: token ? `Bearer ${token}` : '' },
                          body: form,
                        });
                        const data = await res.json();
                        if (res.ok && data?.url) setDocUploads((s) => ({ ...s, address_proof: { uploading: false, url: data.url } }));
                        else setDocUploads((s) => ({ ...s, address_proof: { uploading: false, error: data?.message || 'Upload failed' } }));
                      } catch (err: any) {
                        setDocUploads((s) => ({ ...s, address_proof: { uploading: false, error: err?.message || 'Upload error' } }));
                      }
                    }} />
                  </CardContent>
                </Card>

                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 cursor-pointer" onClick={() => document.getElementById('file-medical_certificate')?.click()} />
                    <h3 className="font-semibold mb-2">Medical Certificate</h3>
                    <p className="text-sm text-muted-foreground mb-4">Health check-up report (within 6 months)</p>
                    <div
                      onClick={() => document.getElementById('file-medical_certificate')?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (!file) return;
                        setDocUploads((s) => ({ ...s, medical_certificate: { uploading: true } }));
                        try {
                          const token = localStorage.getItem('neonest_token');
                          const form = new FormData();
                          form.append('file', file);
                          form.append('type', 'medical_certificate');
                          const res = await fetch('http://localhost:5000/api/caretaker/upload', {
                            method: 'POST',
                            headers: { Authorization: token ? `Bearer ${token}` : '' },
                            body: form,
                          });
                          const data = await res.json();
                          if (res.ok && data?.url) setDocUploads((s) => ({ ...s, medical_certificate: { uploading: false, url: data.url } }));
                          else setDocUploads((s) => ({ ...s, medical_certificate: { uploading: false, error: data?.message || 'Upload failed' } }));
                        } catch (err: any) {
                          setDocUploads((s) => ({ ...s, medical_certificate: { uploading: false, error: err?.message || 'Upload error' } }));
                        }
                      }}
                      className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm text-muted-foreground cursor-pointer hover:border-primary"
                    >
                      {docUploads.medical_certificate.uploading ? 'Uploading...' : (docUploads.medical_certificate.url ? 'Uploaded ✓' : 'Drag & drop here, or click to browse')}
                    </div>
                    <input id="file-medical_certificate" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setDocUploads((s) => ({ ...s, medical_certificate: { uploading: true } }));
                      try {
                        const token = localStorage.getItem('neonest_token');
                        const form = new FormData();
                        form.append('file', file);
                        form.append('type', 'medical_certificate');
                        const res = await fetch('http://localhost:5000/api/caretaker/upload', {
                          method: 'POST',
                          headers: { Authorization: token ? `Bearer ${token}` : '' },
                          body: form,
                        });
                        const data = await res.json();
                        if (res.ok && data?.url) setDocUploads((s) => ({ ...s, medical_certificate: { uploading: false, url: data.url } }));
                        else setDocUploads((s) => ({ ...s, medical_certificate: { uploading: false, error: data?.message || 'Upload failed' } }));
                      } catch (err: any) {
                        setDocUploads((s) => ({ ...s, medical_certificate: { uploading: false, error: err?.message || 'Upload error' } }));
                      }
                    }} />
                  </CardContent>
                </Card>

                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 cursor-pointer" onClick={() => document.getElementById('file-experience_certificate')?.click()} />
                    <h3 className="font-semibold mb-2">Experience Certificates</h3>
                    <p className="text-sm text-muted-foreground mb-4">Previous work experience letters or references</p>
                    <div
                      onClick={() => document.getElementById('file-experience_certificate')?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (!file) return;
                        setDocUploads((s) => ({ ...s, experience_certificate: { uploading: true } }));
                        try {
                          const token = localStorage.getItem('neonest_token');
                          const form = new FormData();
                          form.append('file', file);
                          form.append('type', 'experience_certificate');
                          const res = await fetch('http://localhost:5000/api/caretaker/upload', {
                            method: 'POST',
                            headers: { Authorization: token ? `Bearer ${token}` : '' },
                            body: form,
                          });
                          const data = await res.json();
                          if (res.ok && data?.url) setDocUploads((s) => ({ ...s, experience_certificate: { uploading: false, url: data.url } }));
                          else setDocUploads((s) => ({ ...s, experience_certificate: { uploading: false, error: data?.message || 'Upload failed' } }));
                        } catch (err: any) {
                          setDocUploads((s) => ({ ...s, experience_certificate: { uploading: false, error: err?.message || 'Upload error' } }));
                        }
                      }}
                      className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm text-muted-foreground cursor-pointer hover:border-primary"
                    >
                      {docUploads.experience_certificate.uploading ? 'Uploading...' : (docUploads.experience_certificate.url ? 'Uploaded ✓' : 'Drag & drop here, or click to browse')}
                    </div>
                    <input id="file-experience_certificate" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setDocUploads((s) => ({ ...s, experience_certificate: { uploading: true } }));
                      try {
                        const token = localStorage.getItem('neonest_token');
                        const form = new FormData();
                        form.append('file', file);
                        form.append('type', 'experience_certificate');
                        const res = await fetch('http://localhost:5000/api/caretaker/upload', {
                          method: 'POST',
                          headers: { Authorization: token ? `Bearer ${token}` : '' },
                          body: form,
                        });
                        const data = await res.json();
                        if (res.ok && data?.url) setDocUploads((s) => ({ ...s, experience_certificate: { uploading: false, url: data.url } }));
                        else setDocUploads((s) => ({ ...s, experience_certificate: { uploading: false, error: data?.message || 'Upload failed' } }));
                      } catch (err: any) {
                        setDocUploads((s) => ({ ...s, experience_certificate: { uploading: false, error: err?.message || 'Upload error' } }));
                      }
                    }} />
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Document Security</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      All documents are encrypted and stored securely. They will only be used for verification purposes 
                      and will not be shared with third parties without your consent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

      case 4:
        if (showTrainingPath) {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Skills Certification</h2>
                <p className="text-muted-foreground">Complete your assessment to earn your certification</p>
              </div>

              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6 text-center">Final Skills Assessment</h3>
                  
                  <div className="space-y-6">
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Practical Skills Test</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Required</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Demonstrate your childcare skills with a certified instructor
                        </p>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">60-minute hands-on assessment</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Theory Examination</h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">Required</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Online test covering child development, safety, and care practices
                        </p>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">30 questions, 80% pass rate required</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Communication Assessment</h4>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">Required</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Role-play scenarios to assess communication with families
                        </p>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">15-minute video call assessment</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mt-8 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                            Certification Benefits
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Upon successful completion, you'll receive an official NeoNest certification 
                            and become eligible for our premium caregiver program.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-center mt-8">
                    <Button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-2">
                      Schedule Assessment
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                      Assessment slots available Monday-Friday, 9 AM - 5 PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Availability & Rates</h2>
                <p className="text-muted-foreground">Set your working hours and preferred rates</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Preferred City *</Label>
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
                            {city.avgRate} • {city.demand} demand
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
                          {cities.find(c => c.id === selectedCity)?.name} Market Info
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Average rates: {cities.find(c => c.id === selectedCity)?.avgRate} • 
                          Demand: {cities.find(c => c.id === selectedCity)?.demand}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <Label>Weekly Availability</Label>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center">
                      <div className="text-sm font-medium mb-2">{day}</div>
                      <Checkbox id={day} checked={availabilityDays[day]} onCheckedChange={(c) => {
                        const checked = Boolean(c);
                        setAvailabilityDays((prev) => ({ ...prev, [day]: checked }));
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Preferred Start Time</Label>
                  <Select onValueChange={setStartTime}>
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
                  <Label htmlFor="endTime">Preferred End Time</Label>
                  <Select onValueChange={setEndTime}>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Expected Hourly Rate</Label>
                <Input 
                  id="hourlyRate" 
                  type="number" 
                  placeholder="₹ per hour"
                  className="text-lg"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Recommended range for your city: {selectedCity ? cities.find(c => c.id === selectedCity)?.avgRate : '₹200-500/hour'}
                </p>
              </div>
            </div>
          );
        }

      // Handle remaining steps for both paths
      default:
        const stepIndex = showTrainingPath ? currentStep - 2 : currentStep - 2;
        const regularStepIndex = showTrainingPath ? currentStep - 3 : currentStep - 1;
        
        if (showTrainingPath && currentStep >= 5) {
          // Training path: Document verification (step 5), Availability (step 6), Background check (step 7)
          if (currentStep === 5) {
            return (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">Verification Documents</h2>
                  <p className="text-muted-foreground">Upload required documents for background verification</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Government ID Proof *</h3>
                      <p className="text-sm text-muted-foreground mb-4">Aadhaar Card, Passport, or Driver's License</p>
                      <Button variant="outline">Upload Document</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Address Proof *</h3>
                      <p className="text-sm text-muted-foreground mb-4">Utility Bill, Bank Statement, or Rental Agreement</p>
                      <Button variant="outline">Upload Document</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Medical Certificate</h3>
                      <p className="text-sm text-muted-foreground mb-4">Health check-up report (within 6 months)</p>
                      <Button variant="outline">Upload Document</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Training Certificate *</h3>
                      <p className="text-sm text-muted-foreground mb-4">Your NeoNest training completion certificate</p>
                      <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Auto-generated upon completion
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Document Security</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        All documents are encrypted and stored securely. They will only be used for verification purposes 
                        and will not be shared with third parties without your consent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else if (currentStep === 6) {
            // Availability & Rates for training path
            return (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">Availability & Rates</h2>
                  <p className="text-muted-foreground">Set your working hours and preferred rates</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Preferred City *</Label>
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
                              {city.avgRate} • {city.demand} demand
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
                            {cities.find(c => c.id === selectedCity)?.name} Market Info
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Average rates: {cities.find(c => c.id === selectedCity)?.avgRate} • 
                            Demand: {cities.find(c => c.id === selectedCity)?.demand}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  <Label>Weekly Availability</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center">
                        <div className="text-sm font-medium mb-2">{day}</div>
                        <Checkbox id={day} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Preferred Start Time</Label>
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
                    <Label htmlFor="endTime">Preferred End Time</Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Expected Hourly Rate</Label>
                  <Input 
                    id="hourlyRate" 
                    type="number" 
                    placeholder="₹ per hour"
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended starting range: ₹200-300/hour (will increase as you gain experience)
                  </p>
                </div>
              </div>
            );
          } else if (currentStep === 7) {
            // Background check for training path
            return (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">Background Check & Final Steps</h2>
                  <p className="text-muted-foreground">Complete your profile and agree to our terms</p>
                </div>

                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100">Background Verification Process</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          We conduct thorough background checks to ensure the safety of families
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Criminal background check</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Reference verification</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Document authentication</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Training completion verification</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="terms-caregiver" className="mt-1" />
                    <Label htmlFor="terms-caregiver" className="text-sm leading-relaxed">
                      I agree to NeoNest's <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button>, 
                      <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>, and 
                      <Button variant="link" className="p-0 h-auto text-sm">Caregiver Agreement</Button>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox id="training-commitment" className="mt-1" />
                    <Label htmlFor="training-commitment" className="text-sm leading-relaxed">
                      I commit to continuing my professional development and maintaining 
                      required certifications through NeoNest's ongoing training programs
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox id="background-consent" className="mt-1" />
                    <Label htmlFor="background-consent" className="text-sm leading-relaxed">
                      I consent to background verification checks and understand that false information 
                      may result in application rejection
                    </Label>
                  </div>
                </div>

                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What happens next?</h4>
                    <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                      <p>• Background verification (3-5 business days)</p>
                      <p>• Final interview with NeoNest team</p>
                      <p>• Profile activation and first job assignments</p>
                      <p>• Ongoing mentorship and support</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          }
        } else if (!showTrainingPath && currentStep === 5) {
          // Regular path background check
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Background Check & Final Steps</h2>
                <p className="text-muted-foreground">Complete your profile and agree to our terms</p>
              </div>

              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-100">Background Verification Process</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        We conduct thorough background checks to ensure the safety of families
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Criminal background check</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Reference verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Document authentication</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Skills assessment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms-caregiver" className="mt-1" />
                  <Label htmlFor="terms-caregiver" className="text-sm leading-relaxed">
                    I agree to NeoNest's <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button>, 
                    <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>, and 
                    <Button variant="link" className="p-0 h-auto text-sm">Caregiver Agreement</Button>
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox id="training-commitment" className="mt-1" />
                  <Label htmlFor="training-commitment" className="text-sm leading-relaxed">
                    I commit to completing NeoNest's mandatory training programs and maintaining 
                    required certifications
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox id="background-consent" className="mt-1" />
                  <Label htmlFor="background-consent" className="text-sm leading-relaxed">
                    I consent to background verification checks and understand that false information 
                    may result in application rejection
                  </Label>
                </div>
              </div>

              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What happens next?</h4>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>• Background verification (3-5 business days)</p>
                    <p>• Skills assessment interview (video call)</p>
                    <p>• Training program enrollment</p>
                    <p>• Profile activation and first bookings</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        }
        
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Only show on first step */}
      {currentStep === 0 && (
        <section ref={heroRef} className="py-16 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Join as a Caregiver
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Become part of a trusted community providing essential care and support to mothers and babies. 
                Make a meaningful impact while building a rewarding career.
              </p>
            </div>

            {/* Benefits Grid */}
            <div ref={benefitsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {caregiverBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{benefit.description}</p>
                      <Badge variant="outline" className="text-xs">{benefit.highlight}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Requirements */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">
                  {showTrainingPath ? 'Requirements for Training Program' : 'Basic Requirements'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {(showTrainingPath ? [
                    'Age 18-55 years',
                    'Willingness to learn and grow',
                    'Clear background check',
                    'Basic health certification',
                    'Communication skills in local language',
                    'Smartphone for app access'
                  ] : [
                    'Age 21-55 years',
                    'Minimum 6 months childcare experience',
                    'Clear background check',
                    'Basic health certification',
                    'Communication skills in local language',
                    'Smartphone for app access'
                  ]).map((requirement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Step Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Status Banner - Show only if already applied */}
        {statusLoading ? (
          <div className="max-w-3xl mx-auto mb-4 p-3 text-sm rounded border bg-muted/30 text-center">Checking application status…</div>
        ) : applicationStatus !== 'none' ? (
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className={`mb-6 inline-block p-4 rounded-lg ${
                applicationStatus === 'pending' ? 'bg-yellow-50 border-2 border-yellow-200' :
                applicationStatus === 'approved' ? 'bg-green-50 border-2 border-green-200' :
                'bg-red-50 border-2 border-red-200'
              }`}>
                {applicationStatus === 'pending' && <Clock className="w-12 h-12 mx-auto mb-3 text-yellow-600" />}
                {applicationStatus === 'approved' && <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />}
                {applicationStatus === 'rejected' && <XCircle className="w-12 h-12 mx-auto mb-3 text-red-600" />}
                <h2 className="text-2xl font-bold mb-2">
                  {applicationStatus === 'pending' && 'Application Under Review'}
                  {applicationStatus === 'approved' && 'Application Approved!'}
                  {applicationStatus === 'rejected' && 'Application Rejected'}
                </h2>
                <p className="text-muted-foreground">
                  {applicationStatus === 'pending' && 'Your application has been submitted and is currently under review. We will contact you soon.'}
                  {applicationStatus === 'approved' && 'Congratulations! Your application has been approved. We will enable bookings for your profile shortly.'}
                  {applicationStatus === 'rejected' && 'Your application was not approved. Our team will contact you with details.'}
                </p>
              </div>
              {onNavigate && (
                <Button onClick={() => onNavigate('home')} variant="outline">
                  Return to Home
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
        <div className="flex items-center justify-center mb-8 overflow-x-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isCompleted 
                    ? 'bg-green-100 border-green-500 text-green-600' 
                    : isActive 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
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

        {/* Step Content */}
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            {renderStepContent()}
            
            {/* Validation Error Messages */}
            {validationErrors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                  <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <span className="font-medium">Please complete the required fields:</span>
                </div>
                <ul className="ml-6 text-sm text-red-600 dark:text-red-400 space-y-1">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={() => {
                  setValidationErrors([]);
                  setCurrentStep(Math.max(0, currentStep - 1));
                }}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button
                  className="bg-gradient-to-r from-primary to-secondary text-white"
                  onClick={async () => {
                    // Final validation before submission
                    const validation = validateStep(currentStep);
                    if (!validation.isValid) {
                      setValidationErrors(validation.errors);
                      return;
                    }

                    // Collect full data from selections to send to backend
                    const days = Object.keys(availabilityDays).filter((d) => availabilityDays[d]);
                    const documents = Object.entries(docUploads)
                      .filter(([, { url }]) => url)
                      .map(([type, { url }]) => ({ type, url: url! }));

                    const payload: any = {
                      selectedCity: selectedCity || undefined,
                      availabilityDays: days,
                      startTime: startTime || undefined,
                      endTime: endTime || undefined,
                      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
                      services: selectedServices,
                      experienceLevel: experienceLevel || undefined,
                      about: about || undefined,
                      languages: languages || undefined,
                      education: education || undefined,
                      documents: documents,
                      profileCompleted: true,
                    };
                    try {
                      const token = localStorage.getItem('neonest_token');
                      const res = await fetch('http://localhost:5000/api/caretaker/profile', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: token ? `Bearer ${token}` : '',
                        },
                        body: JSON.stringify(payload),
                      });
                      if (res.ok && onNavigate) onNavigate('home');
                    } catch (e) {
                      // no-op; keep UX smooth
                    }
                  }}
                >
                  Submit Application
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    const validation = validateStep(currentStep);
                    if (!validation.isValid) {
                      setValidationErrors(validation.errors);
                    } else {
                      setValidationErrors([]);
                      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
                    }
                  }}
                  disabled={currentStep === 0 && isZeroExperience === null}
                  className="bg-gradient-to-r from-primary to-secondary text-white"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        </>
        )}
      </div>
    </div>
  );
}