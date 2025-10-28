import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { useAuth } from '../contexts/AuthContext';

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

interface HeroProps {
  onNavigate: (view: AppView) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const contentHook = useScrollAnimation({ animationClass: 'animate-slideInLeft' });
  const imageHook = useScrollAnimation({ animationClass: 'animate-slideInRight', delay: 300 });
  const contentRef = (contentHook.elementRef as unknown) as React.RefObject<HTMLDivElement>;
  const imageRef = (imageHook.elementRef as unknown) as React.RefObject<HTMLDivElement>;
  const { isAuthenticated } = useAuth();

  const handleBookCareClick = () => {
    if (isAuthenticated) {
      onNavigate('book-care');
    } else {
      onNavigate('auth');
    }
  };

  return (
    <section className="pt-24 pb-12 lg:pt-32 lg:pb-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div ref={contentRef} className="space-y-8 opacity-0">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-sm font-medium text-primary">✨ Trusted by 1000+ families</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Care for{' '}
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Mothers.
                </span>{' '}
                Support for{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Babies.
                </span>{' '}
                Jobs for{' '}
                <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                  Women.
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Experience personalized postpartum care with our network of certified caregivers. 
                From newborn support to maternal wellness, we're here for your family's journey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={handleBookCareClick}
              >
                Book Care Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 rounded-xl transition-all duration-300"
                onClick={() => onNavigate('caregiver-signup')}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Join as Caregiver
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Certified Caregivers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="relative opacity-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1716929806153-4e3f66242de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBiYWJ5JTIwY2FyZSUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NTY2NDE5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Mother holding baby with care"
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}