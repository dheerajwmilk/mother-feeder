import { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('neonest-cookie-consent');
    if (!consent) {
      // Show banner after a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    
    localStorage.setItem('neonest-cookie-consent', JSON.stringify({
      accepted: true,
      preferences: allPreferences,
      timestamp: new Date().toISOString(),
    }));
    
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('neonest-cookie-consent', JSON.stringify({
      accepted: true,
      preferences,
      timestamp: new Date().toISOString(),
    }));
    
    setIsVisible(false);
  };

  const handleDecline = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    
    localStorage.setItem('neonest-cookie-consent', JSON.stringify({
      accepted: false,
      preferences: minimalPreferences,
      timestamp: new Date().toISOString(),
    }));
    
    setIsVisible(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-background/95 backdrop-blur-md">
        <CardContent className="p-6">
          {!showSettings ? (
            /* Main Cookie Banner */
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  We care about your privacy
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  We use cookies to enhance your experience, analyze site usage, and personalize content. 
                  By continuing to use NeoNest, you agree to our use of cookies. 
                  <button 
                    onClick={() => {
                      const element = document.getElementById('privacy');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-primary hover:underline ml-1"
                  >
                    Learn more in our Privacy Policy.
                  </button>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                  >
                    Accept All Cookies
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowSettings(true)}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Cookie Preferences
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={handleDecline}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Decline Optional
                  </Button>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-muted rounded-lg"
                aria-label="Dismiss cookie banner"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            /* Cookie Settings */
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Cookie className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-foreground">Cookie Preferences</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Necessary Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Essential for basic functionality and security. These cannot be disabled.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-primary rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Analytics Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how visitors use our website to improve user experience.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => togglePreference('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'ml-auto' : 'ml-0'
                      }`}></div>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Marketing Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Used to deliver relevant advertisements and track campaign effectiveness.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => togglePreference('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.marketing ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.marketing ? 'ml-auto' : 'ml-0'
                      }`}></div>
                    </button>
                  </div>
                </div>

                {/* Personalization Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Personalization Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Remember your preferences and provide personalized content and features.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => togglePreference('personalization')}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.personalization ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.personalization ? 'ml-auto' : 'ml-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border">
                <Button
                  onClick={handleAcceptSelected}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                >
                  Save Preferences
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAcceptAll}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Accept All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}