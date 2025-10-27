import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { EnhancedChatbot } from './EnhancedChatbot';

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Enhanced Chatbot */}
      <EnhancedChatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Floating Button */}
      <Button
        className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-2xl z-40 border-0 transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-500 hover:bg-gray-600' 
            : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 animate-pulse'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open AI assistant'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        
        {/* Notification dot */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">1</span>
          </div>
        )}
      </Button>

      {/* Quick suggestions when closed */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 space-y-2 z-30">
          <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-lg text-sm text-foreground opacity-0 animate-fade-in-up max-w-xs">
            💬 Hi! Need help with baby care?
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}