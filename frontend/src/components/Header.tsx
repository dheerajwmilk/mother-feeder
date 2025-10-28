import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Heart, User, BookOpen, MessageCircle, UserPlus, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

interface HeaderProps {
  onNavigate: (view: AppView) => void;
  currentView: AppView;
}

export function Header({ onNavigate, currentView }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  // Check caregiver application status
  useEffect(() => {
    const checkStatus = async () => {
      if (!isAuthenticated) {
        setApplicationStatus(null);
        return;
      }
      try {
        const token = localStorage.getItem('neonest_token');
        const res = await fetch('http://localhost:5000/api/caretaker/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data?.profile?.profileCompleted) {
          setApplicationStatus(data.profile.status || 'pending');
        } else {
          setApplicationStatus(null);
        }
      } catch (error) {
        setApplicationStatus(null);
      }
    };
    checkStatus();
  }, [isAuthenticated]);

  const handleBookCareClick = () => {
    if (isAuthenticated) {
      onNavigate('book-care');
    } else {
      onNavigate('auth');
    }
  };
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const homeNavigation = [
    { name: 'Services', href: '#services' },
    { name: 'Plans', href: '#plans' },
    { name: 'Mission', href: '#mission' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const appNavigation = [
    { name: 'Home', view: 'home' as AppView, icon: Heart },
    { name: 'Blog', view: 'blog' as AppView, icon: BookOpen },
    { name: 'Knowledge Hub', view: 'knowledge' as AppView, icon: MessageCircle },
    { name: 'FAQ', view: 'faq' as AppView, icon: MessageCircle },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">NeoNest</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {currentView === 'home' ? (
              // Home page navigation (scroll links)
              homeNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleScrollToSection(item.href.replace('#', ''))}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item.name}
                </button>
              ))
            ) : (
              // App navigation (view switching)
              appNavigation.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.name}
                    onClick={() => onNavigate(item.view)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 font-medium ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {item.name}
                  </button>
                );
              })
            )}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {currentView !== 'auth' && !isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('auth')}
                className="hidden md:inline-flex"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            
            <Button 
              className="hidden md:inline-flex bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0"
              size="sm"
              onClick={handleBookCareClick}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Care Now
            </Button>

            {applicationStatus ? (
              <div className="hidden md:inline-flex">
                {applicationStatus === 'approved' && (
                  <Button variant="default" size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approved
                  </Button>
                )}
                {applicationStatus === 'pending' && (
                  <Button variant="secondary" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Under Review
                  </Button>
                )}
                {applicationStatus === 'rejected' && (
                  <Button variant="destructive" size="sm">
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejected
                  </Button>
                )}
              </div>
            ) : (
              <Button 
                variant="secondary"
                className="hidden md:inline-flex"
                size="sm"
                onClick={() => onNavigate('caregiver-signup')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join as Caregiver
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t">
          <div className="px-4 py-6 space-y-4">
            {currentView === 'home' ? (
              // Home page mobile navigation
              <>
                {homeNavigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleScrollToSection(item.href.replace('#', ''));
                      setIsMenuOpen(false);
                    }}
                    className="block text-foreground hover:text-primary transition-colors duration-200 font-medium py-2 text-left"
                  >
                    {item.name}
                  </button>
                ))}
                  <div className="pt-4 space-y-3 border-t">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0"
                    onClick={() => {
                      handleBookCareClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Care Now
                  </Button>
                  {applicationStatus ? (
                    <div className={`w-full px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 ${
                      applicationStatus === 'approved' ? 'bg-green-50 border-green-500 text-green-700' :
                      applicationStatus === 'pending' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                      'bg-red-50 border-red-500 text-red-700'
                    }`}>
                      {applicationStatus === 'approved' && <CheckCircle className="w-4 h-4" />}
                      {applicationStatus === 'pending' && <Clock className="w-4 h-4" />}
                      {applicationStatus === 'rejected' && <XCircle className="w-4 h-4" />}
                      <span className="font-medium">
                        {applicationStatus === 'approved' && 'Application Approved'}
                        {applicationStatus === 'pending' && 'Application Under Review'}
                        {applicationStatus === 'rejected' && 'Application Rejected'}
                      </span>
                    </div>
                  ) : (
                    <Button 
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        onNavigate('caregiver-signup');
                        setIsMenuOpen(false);
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join as Caregiver
                    </Button>
                  )}
                  { !isAuthenticated && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onNavigate('auth');
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </>
            ) : (
              // App navigation mobile
              <>
                {appNavigation.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        onNavigate(item.view);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors duration-200 font-medium ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-foreground hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      {item.name}
                    </button>
                  );
                })}
                  <div className="pt-4 space-y-3 border-t">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0"
                    onClick={() => {
                      handleBookCareClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Care Now
                  </Button>
                  {applicationStatus ? (
                    <div className={`w-full px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2 ${
                      applicationStatus === 'approved' ? 'bg-green-50 border-green-500 text-green-700' :
                      applicationStatus === 'pending' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                      'bg-red-50 border-red-500 text-red-700'
                    }`}>
                      {applicationStatus === 'approved' && <CheckCircle className="w-4 h-4" />}
                      {applicationStatus === 'pending' && <Clock className="w-4 h-4" />}
                      {applicationStatus === 'rejected' && <XCircle className="w-4 h-4" />}
                      <span className="font-medium">
                        {applicationStatus === 'approved' && 'Application Approved'}
                        {applicationStatus === 'pending' && 'Application Under Review'}
                        {applicationStatus === 'rejected' && 'Application Rejected'}
                      </span>
                    </div>
                  ) : (
                    <Button 
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        onNavigate('caregiver-signup');
                        setIsMenuOpen(false);
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join as Caregiver
                    </Button>
                  )}
                  {currentView !== 'auth' && !isAuthenticated && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onNavigate('auth');
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}