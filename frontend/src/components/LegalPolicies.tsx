import { useState } from 'react';
import { Shield, FileText, Scale, Eye, Lock, UserCheck, AlertTriangle, Heart, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useScrollAnimation } from './hooks/useScrollAnimation';

export function LegalPolicies() {
  const [activeSection, setActiveSection] = useState('overview');
  const { elementRef: heroRef } = useScrollAnimation();

  const sections = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'terms', name: 'Terms of Service', icon: FileText },
    { id: 'privacy', name: 'Privacy Policy', icon: Lock },
    { id: 'caregiver', name: 'Caregiver Agreement', icon: UserCheck },
    { id: 'liability', name: 'Liability & Insurance', icon: Shield },
    { id: 'training', name: 'Training Standards', icon: Scale },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Legal Framework & Policies</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                NeoNest operates under a comprehensive legal framework designed to protect families, 
                empower caregivers, and ensure the highest standards of care and safety.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Platform Responsibility</h3>
                  <p className="text-sm text-muted-foreground">
                    NeoNest takes full responsibility for caregiver training, verification, and ongoing quality assurance.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <UserCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Caregiver Accountability</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive agreements and continuous monitoring ensure caregivers maintain professional standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Family Protection</h3>
                  <p className="text-sm text-muted-foreground">
                    Legal safeguards and insurance coverage protect families and ensure quality care delivery.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important Notice</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                      These policies are legally binding and govern all interactions on the NeoNest platform. 
                      By using our services, you agree to comply with these terms. Last updated: December 2024.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">Terms of Service</h2>
              <p className="text-muted-foreground">
                These terms govern your use of NeoNest services and establish our mutual obligations.
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        1. Service Description
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        NeoNest operates as a digital platform connecting families with verified, trained caregivers 
                        for maternal and baby care services. We facilitate bookings, payments, and quality assurance 
                        but do not directly provide care services. All care is delivered by independent, thoroughly 
                        vetted professionals who have completed our certification program.
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              <Card>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        2. User Responsibilities
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">For Families:</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Provide accurate information about care needs and home environment</li>
                            <li>Ensure safe working conditions for caregivers</li>
                            <li>Treat caregivers with respect and professionalism</li>
                            <li>Report any concerns or incidents promptly</li>
                            <li>Pay for services as agreed upon booking</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">For Caregivers:</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Maintain current certifications and training requirements</li>
                            <li>Provide professional, compassionate care at all times</li>
                            <li>Follow all safety protocols and guidelines</li>
                            <li>Communicate effectively with families and NeoNest</li>
                            <li>Report any incidents or concerns immediately</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              <Card>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        3. Payment and Cancellation
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Payment Terms:</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Payment is due at time of booking confirmation</li>
                            <li>All payments are processed securely through encrypted systems</li>
                            <li>Platform fee is clearly disclosed before payment</li>
                            <li>Caregivers receive payment within 24 hours of service completion</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Cancellation Policy:</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Free cancellation up to 4 hours before service</li>
                            <li>50% refund for cancellations 2-4 hours before service</li>
                            <li>No refund for cancellations less than 2 hours before service</li>
                            <li>Emergency cancellations evaluated case-by-case</li>
                            <li>Caregiver no-shows result in full refund and alternative arrangement</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">Privacy Policy</h2>
              <p className="text-muted-foreground">
                Your privacy is paramount. This policy explains how we collect, use, and protect your information.
              </p>
            </div>

            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Data Protection Commitment</h3>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  NeoNest is committed to protecting your personal information with enterprise-grade security measures 
                  and strict access controls. We never sell your data and only use it to provide and improve our services.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Information We Collect</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Personal Information</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Name, contact details, and address</li>
                        <li>• Payment information (securely encrypted)</li>
                        <li>• Medical information relevant to care needs</li>
                        <li>• Emergency contact information</li>
                        <li>• Government ID for verification</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Service Information</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Service preferences and requirements</li>
                        <li>• Booking history and feedback</li>
                        <li>• Communication logs with caregivers</li>
                        <li>• App usage and interaction data</li>
                        <li>• Location data for service delivery</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Service Delivery</h4>
                        <p className="text-sm text-muted-foreground">
                          Matching you with appropriate caregivers, facilitating bookings, and ensuring quality care
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Safety & Security</h4>
                        <p className="text-sm text-muted-foreground">
                          Background checks, identity verification, and maintaining secure service environments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Communication</h4>
                        <p className="text-sm text-muted-foreground">
                          Service updates, appointment reminders, and customer support
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Improvement</h4>
                        <p className="text-sm text-muted-foreground">
                          Enhancing our platform, services, and user experience based on aggregated data
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Access</Badge>
                        <span className="text-sm">View all data we have about you</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Correct</Badge>
                        <span className="text-sm">Update or correct your information</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Delete</Badge>
                        <span className="text-sm">Request deletion of your data</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Portability</Badge>
                        <span className="text-sm">Export your data in machine-readable format</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Restrict</Badge>
                        <span className="text-sm">Limit how we process your data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Object</Badge>
                        <span className="text-sm">Opt out of certain data processing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'caregiver':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">Caregiver Agreement</h2>
              <p className="text-muted-foreground">
                Professional standards and responsibilities for NeoNest certified caregivers.
              </p>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">Professional Standards</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  As a NeoNest caregiver, you represent our commitment to excellence in maternal and baby care. 
                  This agreement outlines the professional standards and responsibilities required to maintain certification.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Certification Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Initial Certification</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Complete NeoNest training program (40+ hours)</li>
                          <li>• Pass practical and written assessments</li>
                          <li>• Submit clean background check</li>
                          <li>• Provide employment and character references</li>
                        </ul>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Valid government ID and address proof</li>
                          <li>• Health clearance certificate</li>
                          <li>• Basic first aid and CPR certification</li>
                          <li>• Language proficiency demonstration</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Ongoing Requirements</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Monthly</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Quality review meetings</li>
                            <li>• Skill refresh sessions</li>
                            <li>• Feedback incorporation</li>
                          </ul>
                        </Card>
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Quarterly</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Advanced training modules</li>
                            <li>• Performance evaluations</li>
                            <li>• Health check updates</li>
                          </ul>
                        </Card>
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Annually</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Certification renewal</li>
                            <li>• Background check updates</li>
                            <li>• Emergency response training</li>
                          </ul>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Standards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Professional Conduct</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Maintain professional appearance and demeanor</li>
                        <li>• Arrive punctually and prepared for services</li>
                        <li>• Respect family privacy and confidentiality</li>
                        <li>• Follow all safety protocols and guidelines</li>
                        <li>• Communicate clearly and compassionately</li>
                        <li>• Maintain cultural sensitivity and awareness</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Care Quality</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Provide evidence-based care practices</li>
                        <li>• Maintain detailed service records</li>
                        <li>• Report any concerns immediately</li>
                        <li>• Participate in family care planning</li>
                        <li>• Support maternal mental health</li>
                        <li>• Promote healthy family bonding</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl font-bold text-primary">4.5+</span>
                        </div>
                        <h4 className="font-semibold mb-1">Minimum Rating</h4>
                        <p className="text-xs text-muted-foreground">Required average rating from families</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl font-bold text-secondary">95%</span>
                        </div>
                        <h4 className="font-semibold mb-1">Reliability Rate</h4>
                        <p className="text-xs text-muted-foreground">On-time arrival and completion</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl font-bold text-accent">100%</span>
                        </div>
                        <h4 className="font-semibold mb-1">Safety Compliance</h4>
                        <p className="text-xs text-muted-foreground">Zero tolerance for safety violations</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Performance Support</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        NeoNest provides comprehensive support to help caregivers maintain high performance standards. 
                        This includes regular training updates, mentorship programs, performance feedback, and additional 
                        certification opportunities. Caregivers experiencing challenges receive personalized improvement 
                        plans and additional resources.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'liability':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">Liability & Insurance</h2>
              <p className="text-muted-foreground">
                Comprehensive protection for families, caregivers, and the platform through our insurance framework.
              </p>
            </div>

            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Comprehensive Coverage</h3>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  NeoNest maintains comprehensive insurance coverage to protect all parties. Our liability framework 
                  ensures that families receive quality care while caregivers are protected in their professional duties.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Platform Liability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Caregiver verification and training</li>
                    <li>• Quality assurance and monitoring</li>
                    <li>• Safe platform operation</li>
                    <li>• Data security and privacy</li>
                    <li>• Emergency response coordination</li>
                  </ul>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-xs font-medium text-primary">Coverage: ₹1 Crore</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-secondary" />
                    Caregiver Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Professional liability insurance</li>
                    <li>• Accident and injury coverage</li>
                    <li>• Legal defense protection</li>
                    <li>• Equipment and property coverage</li>
                    <li>• Transportation insurance</li>
                  </ul>
                  <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
                    <p className="text-xs font-medium text-secondary">Coverage: ₹25 Lakhs</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    Family Protection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Service guarantee protection</li>
                    <li>• Property damage coverage</li>
                    <li>• Medical emergency response</li>
                    <li>• Identity theft protection</li>
                    <li>• Dispute resolution support</li>
                  </ul>
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                    <p className="text-xs font-medium text-accent">Coverage: ₹10 Lakhs</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Liability Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">NeoNest Responsibilities</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Pre-Service</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Thorough caregiver background verification</li>
                          <li>• Comprehensive training and certification</li>
                          <li>• Skill assessment and validation</li>
                          <li>• Health and safety clearances</li>
                          <li>• Ongoing performance monitoring</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">During Service</h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• 24/7 support and emergency response</li>
                          <li>• Quality assurance check-ins</li>
                          <li>• Real-time issue resolution</li>
                          <li>• Caregiver performance tracking</li>
                          <li>• Family satisfaction monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Incident Management</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg font-bold text-red-600">1</span>
                        </div>
                        <h5 className="text-xs font-medium">Immediate Response</h5>
                        <p className="text-xs text-muted-foreground">Report within 1 hour</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg font-bold text-orange-600">2</span>
                        </div>
                        <h5 className="text-xs font-medium">Investigation</h5>
                        <p className="text-xs text-muted-foreground">Complete within 24 hours</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg font-bold text-blue-600">3</span>
                        </div>
                        <h5 className="text-xs font-medium">Resolution</h5>
                        <p className="text-xs text-muted-foreground">Action within 48 hours</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg font-bold text-green-600">4</span>
                        </div>
                        <h5 className="text-xs font-medium">Follow-up</h5>
                        <p className="text-xs text-muted-foreground">Ongoing support</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">Training Standards</h2>
              <p className="text-muted-foreground">
                NeoNest's comprehensive training program ensures all caregivers meet the highest professional standards.
              </p>
            </div>

            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Training Commitment</h3>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  NeoNest takes full responsibility for caregiver training and ongoing education. Our evidence-based 
                  curriculum is developed in partnership with medical professionals and updated regularly to reflect 
                  best practices in maternal and baby care.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Training Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Core Modules (40 hours)</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">8h</Badge>
                          <div>
                            <h5 className="font-medium">Newborn Care Fundamentals</h5>
                            <p className="text-xs text-muted-foreground">Safe handling, feeding, diaper changing, sleep practices</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">6h</Badge>
                          <div>
                            <h5 className="font-medium">Maternal Support</h5>
                            <p className="text-xs text-muted-foreground">Postpartum care, emotional support, recovery assistance</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">6h</Badge>
                          <div>
                            <h5 className="font-medium">Safety & Emergency Response</h5>
                            <p className="text-xs text-muted-foreground">CPR, first aid, choking response, emergency protocols</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">4h</Badge>
                          <div>
                            <h5 className="font-medium">Breastfeeding Support</h5>
                            <p className="text-xs text-muted-foreground">Positioning, latching, troubleshooting, pumping guidance</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">4h</Badge>
                          <div>
                            <h5 className="font-medium">Hygiene & Infection Control</h5>
                            <p className="text-xs text-muted-foreground">Sanitization, disease prevention, safe practices</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">3h</Badge>
                          <div>
                            <h5 className="font-medium">Baby Development</h5>
                            <p className="text-xs text-muted-foreground">Growth milestones, stimulation activities, bonding</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">3h</Badge>
                          <div>
                            <h5 className="font-medium">Communication & Cultural Sensitivity</h5>
                            <p className="text-xs text-muted-foreground">Professional communication, cultural awareness</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">6h</Badge>
                          <div>
                            <h5 className="font-medium">Practical Assessment</h5>
                            <p className="text-xs text-muted-foreground">Hands-on evaluation with certified instructors</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Specialization Tracks (Additional 20 hours)</h4>
                      <div className="space-y-4">
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Advanced Newborn Care</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Premature baby care</li>
                            <li>• Special needs support</li>
                            <li>• Multiple birth assistance</li>
                            <li>• Medical equipment handling</li>
                          </ul>
                        </Card>
                        
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Lactation Specialist</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Advanced breastfeeding support</li>
                            <li>• Milk supply optimization</li>
                            <li>• Pumping and storage</li>
                            <li>• Feeding plan development</li>
                          </ul>
                        </Card>
                        
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Sleep Training Expert</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Sleep pattern analysis</li>
                            <li>• Gentle sleep training methods</li>
                            <li>• Environmental optimization</li>
                            <li>• Family sleep coaching</li>
                          </ul>
                        </Card>
                        
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Mental Health Support</h5>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Postpartum depression awareness</li>
                            <li>• Emotional support techniques</li>
                            <li>• Crisis recognition and response</li>
                            <li>• Referral coordination</li>
                          </ul>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ongoing Education & Quality Assurance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Monthly Requirements</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 2-hour skills refresh session</li>
                        <li>• Case study review and discussion</li>
                        <li>• New technique training</li>
                        <li>• Performance feedback review</li>
                        <li>• Safety protocol updates</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Quality Monitoring</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Regular family feedback collection</li>
                        <li>• Supervisor observation visits</li>
                        <li>• Skill demonstration assessments</li>
                        <li>• Peer review and mentoring</li>
                        <li>• Continuous improvement planning</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Advanced Certifications</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Specialty care certifications</li>
                        <li>• Leadership development programs</li>
                        <li>• Train-the-trainer opportunities</li>
                        <li>• Medical professional partnerships</li>
                        <li>• Career advancement pathways</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training Partnerships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Medical Partners</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Leading pediatric hospitals</li>
                        <li>• Obstetrics and gynecology centers</li>
                        <li>• Lactation consultant organizations</li>
                        <li>• Mental health professionals</li>
                        <li>• Emergency medical services</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Educational Institutions</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Nursing colleges and universities</li>
                        <li>• Medical training institutes</li>
                        <li>• Professional certification bodies</li>
                        <li>• Research institutions</li>
                        <li>• International training programs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">NeoNest</span>
            </div>
            <Button variant="ghost" asChild>
              <a href="/">← Back to Home</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="py-16 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Legal Policies & Framework
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transparent policies that protect families, empower caregivers, and ensure the highest standards of care and safety.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant={activeSection === section.id ? "default" : "ghost"}
                        onClick={() => setActiveSection(section.id)}
                        className="w-full justify-start"
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {section.name}
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Scale className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Questions About Our Policies?</h2>
          <p className="text-muted-foreground mb-8">
            Our legal team is available to clarify any policy questions or concerns you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-primary to-secondary">
              Contact Legal Team
            </Button>
            <Button variant="outline">
              Download Policy Documents
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}