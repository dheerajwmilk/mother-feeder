import { Brain, MessageSquare, ClipboardList, Mic } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const aiFeatures = [
  {
    id: 'symptom-checker',
    icon: Brain,
    title: 'Symptom Checker',
    description: 'AI-powered symptom analysis for both mother and baby with instant recommendations and when to seek professional help.',
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-600',
    demo: 'Ask: "My baby has a fever"',
  },
  {
    id: 'emotional-support',
    icon: MessageSquare,
    title: 'Emotional Support Chatbot',
    description: '24/7 emotional support and guidance for postpartum challenges, anxiety, and mental wellness with empathetic AI conversation.',
    color: 'from-green-500/20 to-green-500/5',
    iconColor: 'text-green-600',
    demo: 'Chat: "I feel overwhelmed"',
  },
  {
    id: 'care-plans',
    icon: ClipboardList,
    title: 'Personalized Care Plans',
    description: 'Custom care plans based on your specific needs, medical history, and preferences with adaptive recommendations.',
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-600',
    demo: 'Plan: Feeding & sleep schedule',
  },
  {
    id: 'voice-assistant',
    icon: Mic,
    title: 'AI Voice Assistant',
    description: 'Voice-activated assistance for hands-free support during feeding, changing, or when you can\'t type messages.',
    color: 'from-orange-500/20 to-orange-500/5',
    iconColor: 'text-orange-600',
    demo: 'Say: "Help with diaper rash"',
  },
];

export function AIFeatures() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 mb-4">
            <span className="text-sm font-medium text-primary">🤖 Powered by AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Smart AI Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience the future of maternal care with our AI-powered tools designed 
            to support you every step of your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer border-0 shadow-lg overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <CardContent className="p-6 relative z-10">
                  {/* Icon with animation */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6`}>
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                    {feature.description}
                  </p>

                  {/* Demo example */}
                  <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Try it:</p>
                    <p className="text-xs font-medium text-foreground">{feature.demo}</p>
                  </div>

                  {/* Hover indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary font-medium">Learn More</span>
                      <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Assistant Preview */}
        <div className="mt-20 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mr-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Meet Nora</h3>
                  <p className="text-sm text-muted-foreground">Your AI Care Assistant</p>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed mb-6">
                Nora is trained on thousands of maternal care scenarios and medical guidelines. 
                She provides instant, evidence-based answers to your questions and can escalate 
                to human experts when needed.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-foreground">Available 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                  <span className="text-sm text-foreground">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-200"></div>
                  <span className="text-sm text-foreground">Multilingual Support</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Sample conversation */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">N</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      "Hi! I noticed you're a first-time mom. I'm here to help with any questions about feeding, sleep, or baby care. What would you like to know?"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Just now</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/10 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-primary font-bold">You</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      "My baby cries every evening for hours. Is this normal?"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Typing...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}