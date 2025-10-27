import { Baby, Heart, Hand, Apple, Bot, Shield } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const services = [
  {
    id: 'newborn',
    icon: Baby,
    title: 'Newborn Care',
    description: 'Expert care for your precious little one including feeding support, sleep guidance, and development monitoring.',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    id: 'mother',
    icon: Heart,
    title: 'Maternal Care',
    description: 'Comprehensive support for new mothers including emotional support, breastfeeding assistance, and recovery guidance.',
    color: 'from-secondary/20 to-secondary/5',
    iconColor: 'text-secondary',
  },
  {
    id: 'massage',
    icon: Hand,
    title: 'Therapeutic Massage',
    description: 'Professional massage therapy for both mother and baby to promote relaxation, bonding, and physical well-being.',
    color: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
  },
  {
    id: 'nutrition',
    icon: Apple,
    title: 'Nutrition Guidance',
    description: 'Personalized nutrition plans for postpartum recovery and healthy breastfeeding support from certified nutritionists.',
    color: 'from-chart-4/20 to-chart-4/5',
    iconColor: 'text-chart-4',
  },
  {
    id: 'ai',
    icon: Bot,
    title: 'AI Guidance',
    description: '24/7 AI-powered support for instant answers to your parenting questions and personalized care recommendations.',
    color: 'from-chart-5/20 to-chart-5/5',
    iconColor: 'text-chart-5',
  },
  {
    id: 'safety',
    icon: Shield,
    title: 'Safety & Verification',
    description: 'All caregivers are thoroughly vetted, background-checked, and certified to ensure your family\'s safety and peace of mind.',
    color: 'from-primary/20 to-secondary/5',
    iconColor: 'text-primary',
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Comprehensive Care Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need for a healthy, supported transition into motherhood. 
            Our certified caregivers provide personalized care tailored to your family's unique needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-0 shadow-md"
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
            <span className="text-sm font-medium text-foreground">Need a custom care plan?</span>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors duration-200"
            >
              Contact our specialists →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}