import { UserPlus, Calendar, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

interface HowItWorksProps {
  onNavigate?: (view: AppView) => void;
}

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: 'Sign Up & Profile',
    description: 'Create your account and tell us about your specific needs, preferences, and family situation.',
    color: 'from-primary to-primary/70',
  },
  {
    id: 2,
    icon: Calendar,
    title: 'Select Services & Schedule',
    description: 'Choose from our range of care services and book appointments that fit your schedule.',
    color: 'from-secondary to-secondary/70',
  },
  {
    id: 3,
    icon: Users,
    title: 'Caregiver Arrives',
    description: 'Meet your matched caregiver who will provide personalized care for you and your baby.',
    color: 'from-accent to-accent/70',
  },
];

export function HowItWorks({ onNavigate }: HowItWorksProps) {
  const { isAuthenticated } = useAuth();

  const handleBookCareClick = () => {
    if (isAuthenticated) {
      onNavigate?.('book-care');
    } else {
      onNavigate?.('auth');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-accent/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How NeoNest Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting started with NeoNest is simple. Follow these three easy steps to begin your care journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLastStep = index === steps.length - 1;
            
            return (
              <div key={step.id} className="relative">
                {/* Step Card */}
                <div className="text-center group">
                  {/* Step Number & Icon */}
                  <div className="relative inline-block mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      {step.id}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Arrow (Desktop only) */}
                {!isLastStep && (
                  <div className="hidden lg:block absolute top-10 left-full w-12 transform -translate-x-6 translate-x-full">
                    <div className="w-full h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 relative">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}

                {/* Mobile connecting line */}
                {!isLastStep && (
                  <div className="lg:hidden flex justify-center mt-8 mb-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-secondary/50 relative">
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Ready to get started?
          </h3>
          <p className="text-muted-foreground mb-4">
            Join thousands of families who trust NeoNest for their care needs.
          </p>
          <button 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            onClick={handleBookCareClick}
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
}