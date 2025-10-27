import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Shield, Heart, Clock, Users, Star, Baby, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useScrollAnimation, useStaggeredAnimation } from './hooks/useScrollAnimation';

interface FAQProps {
  showPreview?: boolean;
  onNavigate?: () => void;
}

export function FAQ({ showPreview = false, onNavigate }: FAQProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  const { elementRef: heroRef } = useScrollAnimation();
  const { containerRef: faqRef } = useStaggeredAnimation(10, 100);

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle, count: 24 },
    { id: 'services', name: 'Services', icon: Heart, count: 6 },
    { id: 'booking', name: 'Booking & Payment', icon: Clock, count: 5 },
    { id: 'caregivers', name: 'Caregivers', icon: Users, count: 4 },
    { id: 'safety', name: 'Safety & Security', icon: Shield, count: 4 },
    { id: 'support', name: 'Support', icon: Star, count: 3 },
    { id: 'baby-care', name: 'Baby Care', icon: Baby, count: 2 }
  ];

  const faqs = [
    {
      id: '1',
      category: 'services',
      question: 'What types of care services does NeoNest provide?',
      answer: 'NeoNest offers comprehensive maternal and baby care services including: Newborn care (0-3 months), Postpartum support for new mothers, Night care and feeding assistance, Breastfeeding support and lactation consultation, Professional baby massage, Sleep training guidance, and Emergency childcare. All services are provided by verified, trained caregivers.',
      popular: true
    },
    {
      id: '2',
      category: 'booking',
      question: 'How do I book a caregiver through NeoNest?',
      answer: 'Booking is simple: 1) Visit our website or app and click "Book Care Now", 2) Select your city and required services, 3) Browse verified caregivers with ratings and reviews, 4) Choose your preferred caregiver and time slot, 5) Complete payment securely online, 6) Receive confirmation and caregiver contact details. You can book instantly for same-day service or schedule for later.',
      popular: true
    },
    {
      id: '3',
      category: 'caregivers',
      question: 'How are NeoNest caregivers verified and trained?',
      answer: 'Our rigorous verification process includes: Criminal background checks, Reference verification from previous employers, Document authentication (ID, address, medical certificates), Skills assessment and practical evaluation, Mandatory training in childcare, first aid, and hygiene, Ongoing education and certification updates. Only caregivers who pass all checks are approved to join our platform.',
      popular: true
    },
    {
      id: '4',
      category: 'safety',
      question: 'What safety measures does NeoNest have in place?',
      answer: 'NeoNest prioritizes safety through: Comprehensive background verification of all caregivers, Insurance coverage for caregivers and families, 24/7 support and emergency response, Real-time tracking and check-ins during service, Secure payment processing with no cash transactions, Regular feedback and rating systems, On-call supervision and quality assurance. We also provide safety guidelines and emergency protocols.',
      popular: false
    },
    {
      id: '5',
      category: 'booking',
      question: 'What are the pricing rates for different services?',
      answer: 'Pricing varies by city and service type. Sample rates for Mumbai: Newborn care: ₹300-500/hour, Postpartum support: ₹250-400/hour, Night care: ₹400-600/hour, Baby massage: ₹200-300/hour, Breastfeeding support: ₹300-450/hour. Rates in other cities may be 20-30% lower. We offer transparent pricing with no hidden fees, and you can see exact rates before booking.',
      popular: true
    },
    {
      id: '6',
      category: 'services',
      question: 'Do you provide services for premature or special needs babies?',
      answer: 'Yes, we have specially trained caregivers for premature babies and those with special needs. These caregivers have additional certifications in NICU care, handling medical equipment, and specialized feeding techniques. Please mention special requirements during booking so we can match you with appropriately trained caregivers. Additional charges may apply for specialized care.',
      popular: false
    },
    {
      id: '7',
      category: 'booking',
      question: 'Can I cancel or reschedule a booking?',
      answer: 'Yes, you can cancel or reschedule bookings: Free cancellation up to 4 hours before service start time, 50% refund for cancellations 2-4 hours before, No refund for cancellations less than 2 hours before (except emergencies). To reschedule, contact us or use the app at least 2 hours in advance. Emergency cancellations (medical/family emergencies) are handled case-by-case with full refund consideration.',
      popular: false
    },
    {
      id: '8',
      category: 'caregivers',
      question: 'How do I choose the right caregiver for my needs?',
      answer: 'We help you choose through: Detailed caregiver profiles with experience, specializations, and photos, Verified reviews and ratings from previous families, Language preferences and communication skills, Availability matching your schedule, Specialized training certifications, Price range filtering. Our AI matching system also suggests caregivers based on your specific requirements.',
      popular: false
    },
    {
      id: '9',
      category: 'support',
      question: 'What if I\'m not satisfied with the caregiver service?',
      answer: 'Your satisfaction is our priority: Rate and review caregivers after each service, Contact our 24/7 support for immediate concerns, Request a different caregiver for future bookings, Receive partial/full refunds for unsatisfactory service, Access to our quality assurance team for complaint resolution. We continuously monitor caregiver performance and provide additional training when needed.',
      popular: false
    },
    {
      id: '10',
      category: 'safety',
      question: 'Are caregivers insured and bonded?',
      answer: 'Yes, all NeoNest caregivers are covered by: Professional liability insurance up to ₹10 lakhs, Medical insurance for emergency situations, Bonding protection against theft or property damage, Coverage for accidents during service. Additionally, NeoNest carries platform insurance to protect both families and caregivers. Insurance details are available in your booking confirmation.',
      popular: false
    },
    {
      id: '11',
      category: 'services',
      question: 'Do you offer overnight and live-in care services?',
      answer: 'Yes, we provide: Overnight care (8-12 hour shifts) for night feeding and baby care, Live-in care for extended postpartum support, Weekend and holiday care, Emergency overnight care (subject to availability). Overnight rates start from ₹400-600/hour depending on city and services. Live-in caregivers are available for minimum 7-day periods with special rates.',
      popular: false
    },
    {
      id: '12',
      category: 'booking',
      question: 'What payment methods do you accept?',
      answer: 'We accept: All major credit and debit cards (Visa, MasterCard, RuPay), UPI payments (GPay, PhonePe, Paytm), Net banking from all major banks, Digital wallets, EMI options for longer bookings. All payments are processed securely with SSL encryption. We do not accept cash payments to ensure safety and transparency.',
      popular: false
    },
    {
      id: '13',
      category: 'caregivers',
      question: 'Can I request the same caregiver for regular services?',
      answer: 'Absolutely! You can: Book your preferred caregiver for regular services, Set up recurring bookings with the same caregiver, Add caregivers to your favorites list, Request specific caregivers when booking. Popular caregivers may have limited availability, so we recommend booking in advance. You can also book backup caregivers for times when your preferred caregiver isn\'t available.',
      popular: false
    },
    {
      id: '14',
      category: 'support',
      question: 'What support is available during service hours?',
      answer: 'We provide comprehensive support: 24/7 helpline for emergencies and concerns, Live chat support through our app, Regular check-ins during extended services, Access to on-call supervisors, Emergency response coordination, Nursing support for medical queries. Our support team includes experienced mothers and childcare experts who understand your needs.',
      popular: false
    },
    {
      id: '15',
      category: 'services',
      question: 'Do you provide lactation consultation and breastfeeding support?',
      answer: 'Yes, we offer specialized lactation services: Certified lactation consultants (IBCLCs), Breastfeeding guidance and positioning help, Addressing latching difficulties, Milk supply enhancement techniques, Pumping and storage guidance, Support for returning to work, Bottle feeding transition assistance. These services can be booked separately or combined with general newborn care.',
      popular: true
    },
    {
      id: '16',
      category: 'safety',
      question: 'How do you ensure the safety of my personal information?',
      answer: 'We protect your privacy through: GDPR-compliant data handling, Encrypted storage of all personal information, Secure payment processing (PCI DSS compliant), Limited access to information on need-to-know basis, Regular security audits and updates, No sharing of data with unauthorized third parties. Caregivers only receive essential information needed to provide service.',
      popular: false
    },
    {
      id: '17',
      category: 'baby-care',
      question: 'What baby care techniques do your caregivers know?',
      answer: 'Our caregivers are trained in: Safe sleep practices and SIDS prevention, Proper feeding techniques (breast and bottle), Diaper changing and hygiene, Baby massage and developmental activities, Recognizing illness signs and when to contact parents, Infant CPR and basic first aid, Soothing techniques for fussy babies, Age-appropriate play and stimulation.',
      popular: false
    },
    {
      id: '18',
      category: 'booking',
      question: 'How far in advance can I book services?',
      answer: 'You can book: Same-day service (subject to availability), Up to 3 months in advance for planned care, Recurring weekly/monthly schedules, Special occasion care (festivals, travel), Emergency bookings (within 2 hours when available). Early booking ensures better caregiver selection and preferred time slots, especially during peak periods like festival seasons.',
      popular: false
    },
    {
      id: '19',
      category: 'caregivers',
      question: 'What languages do your caregivers speak?',
      answer: 'Our caregivers speak multiple languages based on location: Hindi and English (available everywhere), Regional languages (Tamil in Chennai, Bengali in Kolkata, Marathi in Mumbai, etc.), Basic English for emergency communication, Some caregivers speak multiple regional languages. You can filter caregivers by language preference during booking to ensure comfortable communication.',
      popular: false
    },
    {
      id: '20',
      category: 'services',
      question: 'Do you offer services for twins or multiple babies?',
      answer: 'Yes, we provide specialized care for twins and multiples: Experienced caregivers trained in multiple baby care, Higher caregiver-to-baby ratios when needed, Coordinated feeding and sleep schedules, Specialized equipment and techniques, Additional support for overwhelmed parents. Rates are adjusted based on the number of babies and complexity of care required.',
      popular: false
    },
    {
      id: '21',
      category: 'support',
      question: 'Do you offer postpartum mental health support?',
      answer: 'Yes, we recognize the importance of maternal mental health: Caregivers trained to recognize postpartum depression signs, Emotional support and active listening, Referrals to mental health professionals when needed, Connection to postpartum support groups, Family education about postpartum mental health, 24/7 crisis support through our helpline. We work with licensed therapists and counselors.',
      popular: false
    },
    {
      id: '22',
      category: 'baby-care',
      question: 'Can caregivers help with sleep training?',
      answer: 'Our sleep specialists can help with: Establishing healthy sleep routines, Age-appropriate sleep training methods, Creating optimal sleep environments, Addressing sleep regressions, Gentle sleep coaching techniques, Consistent bedtime routines, Night weaning support. Sleep training approaches are customized based on baby\'s age, temperament, and family preferences.',
      popular: false
    },
    {
      id: '23',
      category: 'safety',
      question: 'What happens in case of a medical emergency?',
      answer: 'We have comprehensive emergency protocols: All caregivers are trained in infant CPR and first aid, Immediate contact with parents and emergency services, Direct line to pediatric consultants through our network, Coordination with nearby hospitals, Emergency transportation arrangements, 24/7 medical helpline access, Detailed incident reporting and follow-up. Emergency procedures are reviewed with caregivers and families.',
      popular: false
    },
    {
      id: '24',
      category: 'services',
      question: 'Do you provide housekeeping along with baby care?',
      answer: 'Baby care is our primary focus, but we offer limited housekeeping: Light housekeeping related to baby care (washing bottles, baby laundry), Maintaining nursery cleanliness, Kitchen cleaning after preparing baby food, Basic tidying of areas used during care. For extensive housekeeping, we can recommend trusted partner services. Our focus remains on quality childcare and maternal support.',
      popular: false
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqs.filter(faq => faq.popular);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (showPreview) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Questions? We Have Answers
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Get instant answers to common questions about our services, safety measures, booking process, and more.
            </p>
            <Button 
              onClick={onNavigate}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              Browse All FAQs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {popularFAQs.slice(0, 4).map((faq, index) => (
              <Card key={faq.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {faq.question}
                      </h3>
                      <Badge variant="secondary" className="text-xs mb-3">Popular</Badge>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Find answers to common questions about NeoNest services, caregivers, booking, safety, and more. 
              Can't find what you're looking for? Our support team is here to help.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 focus:border-primary/50 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="transition-all duration-300"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular FAQs */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <section className="py-16 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Most Popular Questions</h2>
              <p className="text-muted-foreground">Quick answers to our most frequently asked questions</p>
            </div>
            
            <div className="space-y-4">
              {popularFAQs.map((faq) => (
                <Card key={`popular-${faq.id}`} className="group hover:shadow-lg transition-all duration-300">
                  <Collapsible
                    open={openItems.includes(`popular-${faq.id}`)}
                    onOpenChange={() => toggleItem(`popular-${faq.id}`)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardContent className="p-6 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <HelpCircle className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {faq.question}
                              </h3>
                              <Badge variant="secondary" className="mt-2 text-xs">Popular</Badge>
                            </div>
                          </div>
                          <div className="ml-4">
                            {openItems.includes(`popular-${faq.id}`) ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="px-6 pb-6 pt-0">
                        <div className="ml-12">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All FAQs */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'All Questions' : `${categories.find(cat => cat.id === selectedCategory)?.name} Questions`}
            </h2>
            <p className="text-muted-foreground">
              {filteredFAQs.length} questions found
            </p>
          </div>
          
          <div ref={faqRef} className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="opacity-0 group hover:shadow-lg transition-all duration-300">
                <Collapsible
                  open={openItems.includes(faq.id)}
                  onOpenChange={() => toggleItem(faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-6 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            {(() => {
                              const category = categories.find(cat => cat.id === faq.category);
                              const IconComponent = category?.icon || HelpCircle;
                              return <IconComponent className="w-4 h-4 text-primary" />;
                            })()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {faq.question}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {categories.find(cat => cat.id === faq.category)?.name}
                              </Badge>
                              {faq.popular && (
                                <Badge variant="secondary" className="text-xs">Popular</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {openItems.includes(faq.id) ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="px-6 pb-6 pt-0">
                      <div className="ml-12">
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
              <Button variant="outline" onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-8">
            Our support team is available 24/7 to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-primary to-secondary">
              Contact Support
            </Button>
            <Button variant="outline">
              Live Chat
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}