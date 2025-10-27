import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();

  const handleBookCareClick = () => {
    if (isAuthenticated) {
      onNavigate('book-care');
    } else {
      onNavigate('auth');
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const footerLinks = {
    about: [
      { name: 'Our Story', action: () => handleScrollToSection('about'), type: 'scroll', href: '#about' },
      { name: 'Mission & Vision', action: () => handleScrollToSection('mission'), type: 'scroll', href: '#mission' },
      { name: 'Blog', action: () => onNavigate('blog'), type: 'navigate' },
      { name: 'Knowledge Hub', action: () => onNavigate('knowledge'), type: 'navigate' },
      { name: 'Careers', action: () => handleScrollToSection('careers'), type: 'scroll', href: '#careers' },
    ],
    services: [
      { name: 'Book Care Now', action: handleBookCareClick, type: 'navigate' },
      { name: 'Join as Caregiver', action: () => onNavigate('caregiver-signup'), type: 'navigate' },
      { name: 'Newborn Care', action: () => handleScrollToSection('services'), type: 'scroll', href: '#services' },
      { name: 'Maternal Support', action: () => handleScrollToSection('services'), type: 'scroll', href: '#services' },
      { name: 'AI Assistant', action: () => handleScrollToSection('ai-features'), type: 'scroll', href: '#ai-features' },
    ],
    support: [
      { name: 'FAQ', action: () => onNavigate('faq'), type: 'navigate' },
      { name: 'Contact Us', action: () => handleScrollToSection('contact'), type: 'scroll', href: '#contact' },
      { name: 'Sign In', action: () => onNavigate('auth'), type: 'navigate' },
      { name: 'Emergency Support', action: () => {}, type: 'external', href: 'tel:911' },
      { name: 'Community Forum', action: () => handleScrollToSection('forum'), type: 'scroll', href: '#forum' },
    ],
    legal: [
      { name: 'Legal Policies', action: () => onNavigate('legal'), type: 'navigate' },
      { name: 'Privacy Policy', action: () => onNavigate('legal'), type: 'navigate' },
      { name: 'Terms of Service', action: () => onNavigate('legal'), type: 'navigate' },
      { name: 'HIPAA Compliance', action: () => onNavigate('legal'), type: 'navigate' },
      { name: 'Accessibility', action: () => handleScrollToSection('accessibility'), type: 'scroll', href: '#accessibility' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#facebook', label: 'Facebook' },
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Instagram, href: '#instagram', label: 'Instagram' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border/50">
      {/* Newsletter Section */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Stay Connected with NeoNest
            </h3>
            <p className="text-muted-foreground mb-6">
              Get the latest updates on maternal care, parenting tips, and community stories delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1"
              />
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-6">
                Subscribe
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-foreground">NeoNest</span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              Providing exceptional care for mothers and babies while empowering women 
              through meaningful employment opportunities. Building stronger families and communities.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">hello@neonest.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">1-800-NEONEST</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4 text-primary" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  {link.type === 'navigate' ? (
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  {link.type === 'navigate' ? (
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  {link.type === 'navigate' ? (
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </button>
                  ) : link.type === 'external' ? (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  {link.type === 'navigate' ? (
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} NeoNest. All rights reserved. Made with ❤️ for families everywhere.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>🔒 HIPAA Compliant</span>
              <span>✅ Background Checked</span>
              <span>🏆 Award Winning</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}