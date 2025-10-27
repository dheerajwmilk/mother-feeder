import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { HowItWorks } from './components/HowItWorks';
import { WhyNeoNest } from './components/WhyNeoNest';
import { Plans } from './components/Plans';
import { MissionVision } from './components/MissionVision';
import { TrainingPortal } from './components/TrainingPortal';
import { AIFeatures } from './components/AIFeatures';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingChatbot } from './components/FloatingChatbot';
import { CookieConsent } from './components/CookieConsent';

// New integrated components
import { Auth } from './components/Auth';
import { Blog } from './components/Blog';
import { KnowledgeHub } from './components/KnowledgeHub';
import { CaregiverWorkflow } from './components/CaregiverWorkflow';
import { BookCareWorkflow } from './components/BookCareWorkflow';
import { AuthGuard } from './components/AuthGuard';
import { FAQ } from './components/FAQ';
import { LegalPolicies } from './components/LegalPolicies';
import { GoogleCallback } from './components/GoogleCallback';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toast';

type AppView = 'home' | 'auth' | 'blog' | 'knowledge' | 'caregiver-signup' | 'book-care' | 'faq' | 'legal';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentView]);

  // Prevent hash fragments from appearing in URL
  useEffect(() => {
    // Clear any existing hash immediately
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    const handleHashChange = () => {
      // Remove hash from URL without triggering scroll
      if (window.location.hash) {
        const hash = window.location.hash;
        window.history.replaceState(null, '', window.location.pathname);
        
        // Scroll to the element if it exists
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Handle clicks on anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          const element = document.getElementById(href.replace('#', ''));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    // Handle initial hash if present
    handleHashChange();

    // Listen for hash changes and anchor clicks
    window.addEventListener('hashchange', handleHashChange);
    document.addEventListener('click', handleAnchorClick);

    // Also listen for popstate to handle browser back/forward
    const handlePopState = () => {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'auth':
        return <Auth onNavigate={setCurrentView} />;
      case 'blog':
        return <Blog />;
      case 'knowledge':
        return <KnowledgeHub />;
      case 'caregiver-signup':
        return <CaregiverWorkflow />;
      case 'book-care':
        return (
          <AuthGuard onNavigate={setCurrentView}>
            <BookCareWorkflow />
          </AuthGuard>
        );
      case 'faq':
        return <FAQ />;
      case 'legal':
        return <LegalPolicies />;
      case 'home':
      default:
        return (
          <main id="main-content" className="relative">
            {/* Hero Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp">
              <Hero onNavigate={setCurrentView} />
            </div>

            {/* Services Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <Services />
            </div>

            {/* How It Works Section with scroll animation */}
            <div className="opacity-0 animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <HowItWorks onNavigate={setCurrentView} />
            </div>

            {/* Why NeoNest Section with scroll animation */}
            <div className="opacity-0 animate-slideInRight" style={{ animationDelay: '0.6s' }}>
              <WhyNeoNest />
            </div>

            {/* Plans Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <Plans />
            </div>


            {/* AI Features Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '1.0s' }}>
              <AIFeatures />
            </div>

            {/* Mission & Vision Section with scroll animation */}
            <div className="opacity-0 animate-slideInRight" style={{ animationDelay: '1.2s' }}>
              <MissionVision />
            </div>

            {/* Training Portal Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '1.4s' }}>
              <TrainingPortal onNavigate={setCurrentView} />
            </div>

            {/* Blog Preview Section with scroll animation */}
            <div className="opacity-0 animate-slideInLeft" style={{ animationDelay: '1.6s' }}>
              <Blog showPreview={true} onNavigate={() => setCurrentView('blog')} />
            </div>

            {/* Knowledge Hub Preview Section with scroll animation */}
            <div className="opacity-0 animate-slideInRight" style={{ animationDelay: '1.8s' }}>
              <KnowledgeHub showPreview={true} onNavigate={() => setCurrentView('knowledge')} />
            </div>

            {/* FAQ Section with scroll animation */}
            <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '2.0s' }}>
              <FAQ showPreview={true} onNavigate={() => setCurrentView('faq')} />
            </div>

            {/* Contact Section with scroll animation */}
            <div className="opacity-0 animate-slideInLeft" style={{ animationDelay: '2.2s' }}>
              <Contact />
            </div>
          </main>
        );
    }
  };

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="neonest-ui-theme">
          <div className="min-h-screen bg-background text-foreground antialiased">
            <Routes>
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              <Route
                path="*"
                element={
                  <>
                    {/* Skip to content link for accessibility */}
                    <a
                      href="#main-content"
                      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
                    >
                      Skip to content
                    </a>

                    {/* Header - Pass navigation functions */}
                    <Header onNavigate={setCurrentView} currentView={currentView} />

                    {/* Current View Content */}
                    {renderCurrentView()}

                    {/* Footer - only show on home view */}
                    {currentView === 'home' && (
                      <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '2.4s' }}>
                        <Footer onNavigate={setCurrentView} />
                      </div>
                    )}

                    {/* Floating Components */}
                    <FloatingChatbot />
                    <CookieConsent />
                  </>
                }
              />
            </Routes>
            <Toaster />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;