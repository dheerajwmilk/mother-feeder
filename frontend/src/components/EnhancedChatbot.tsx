import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Bot, Heart, Headphones, Volume2, VolumeX, RotateCcw, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'audio' | 'quick_reply';
  suggestions?: string[];
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedChatbot({ isOpen, onClose }: ChatBotProps) {
  const [activeBot, setActiveBot] = useState<'qna' | 'caretaker'>('qna');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    qna: [],
    caretaker: []
  });
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);

  // Initialize speech APIs
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthesis.current = window.speechSynthesis;
    }

    // Initialize with welcome messages
    if (messages.qna.length === 0) {
      initializeChats();
    }
  }, []);

  const initializeChats = () => {
    const qnaWelcome: Message = {
      id: 'qna-welcome',
      text: "Hi! I'm Nila, your NeoNest AI assistant. I'm here to help with any questions about pregnancy, baby care, our services, or anything else you'd like to know. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        "What services do you offer?",
        "How do I find a caregiver?",
        "Pregnancy nutrition tips",
        "Newborn care basics",
        "Pricing information"
      ]
    };

    const caretakerWelcome: Message = {
      id: 'caretaker-welcome',
      text: "Hello dear, I'm Nora, your virtual caretaker. I'm here to listen, support, and help you through any challenges you're facing as a mother. This is a safe space to share your feelings, concerns, or just chat. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        "I'm feeling overwhelmed",
        "Baby won't stop crying",
        "I'm worried about breastfeeding",
        "Feeling isolated",
        "Need emotional support"
      ]
    };

    setMessages({
      qna: [qnaWelcome],
      caretaker: [caretakerWelcome]
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeBot]);

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (synthesis.current && !isSpeaking) {
      // Stop any ongoing speech
      synthesis.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesis.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesis.current) {
      synthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const generateResponse = (userMessage: string, botType: 'qna' | 'caretaker'): Message => {
    const responses = {
      qna: {
        services: "NeoNest offers comprehensive maternal and baby care services including: Newborn care, Postpartum support, Night care, Breastfeeding support, Baby massage, and Sleep training. All our caregivers are verified and trained professionals.",
        caregiver: "Finding a caregiver is easy! Simply use our 'Book Care Now' feature, select your city and required services, browse verified caregivers with ratings and reviews, and book instantly. You can also filter by experience, rate, and availability.",
        pricing: "Our pricing varies by city and service type. For example, in Mumbai: Newborn care (₹300-500/hour), Postpartum support (₹250-400/hour), Night care (₹400-600/hour). We provide transparent pricing with no hidden fees.",
        pregnancy: "During pregnancy, focus on: Balanced nutrition with folate, iron, and calcium; Regular prenatal checkups; Gentle exercise like walking or prenatal yoga; Adequate rest and stress management; Avoiding alcohol, smoking, and raw foods.",
        newborn: "Newborn care basics include: Feeding every 2-3 hours; Proper diaper changing technique; Safe sleep practices (back sleeping); Regular pediatric checkups; Recognizing hunger and sleep cues; Maintaining proper hygiene.",
        default: "I'd be happy to help you with that! Could you please provide more specific details about what you'd like to know? I can assist with pregnancy care, baby care tips, our services, booking caregivers, or any other questions you might have."
      },
      caretaker: {
        overwhelmed: "I hear you, and what you're feeling is completely normal. Being a mother can feel overwhelming, especially in the beginning. Take a deep breath with me. Remember, you don't have to be perfect - you just need to be present. It's okay to ask for help. Would you like to talk about what's making you feel most overwhelmed right now?",
        crying: "A crying baby can be so stressful, but remember - crying is their only way to communicate. Try the 5 S's: Swaddling, Side/stomach position (while awake), Shushing, Swinging, and Sucking. Sometimes babies cry just because they need to release energy. You're not doing anything wrong, mama. Take breaks when you need them.",
        breastfeeding: "Breastfeeding challenges are so common, and you're not alone in this struggle. It can take time for both you and baby to learn. Consider reaching out to a lactation consultant through NeoNest - they can provide personalized guidance. Remember, fed is best, whether that's breast milk, formula, or both. You're doing great.",
        isolated: "Feeling isolated is one of the hardest parts of new motherhood. Your feelings are valid, and this phase will pass. Consider joining local mom groups, reaching out to family and friends, or connecting with other mothers through NeoNest's community features. Small steps count - even a short walk outside can help.",
        support: "I'm here for you, and I want you to know that whatever you're going through, your feelings are valid. Motherhood is one of the biggest life changes, and it's normal to need support. You're stronger than you know, and you're doing better than you think. What would feel most helpful to you right now?",
        default: "Thank you for sharing with me. I'm here to listen without judgment and offer support. Being a mother comes with so many emotions and challenges, and it's brave of you to reach out. What's on your heart today? I'm here to listen and support you through whatever you're experiencing."
      }
    };

    const botResponses = responses[botType];
    const lowerMessage = userMessage.toLowerCase();
    
    let responseText = botResponses.default;
    
    // Simple keyword matching for responses
    if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
      responseText = botResponses.services || botResponses.default;
    } else if (lowerMessage.includes('caregiver') || lowerMessage.includes('find') || lowerMessage.includes('book')) {
      responseText = botResponses.caregiver || botResponses.default;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      responseText = botResponses.pricing || botResponses.default;
    } else if (lowerMessage.includes('pregnancy') || lowerMessage.includes('nutrition')) {
      responseText = botResponses.pregnancy || botResponses.default;
    } else if (lowerMessage.includes('newborn') || lowerMessage.includes('baby care')) {
      responseText = botResponses.newborn || botResponses.default;
    } else if (lowerMessage.includes('overwhelm') || lowerMessage.includes('stress')) {
      responseText = botResponses.overwhelmed || botResponses.default;
    } else if (lowerMessage.includes('crying') || lowerMessage.includes('cry')) {
      responseText = botResponses.crying || botResponses.default;
    } else if (lowerMessage.includes('breastfeed') || lowerMessage.includes('nursing')) {
      responseText = botResponses.breastfeeding || botResponses.default;
    } else if (lowerMessage.includes('lonely') || lowerMessage.includes('isolated') || lowerMessage.includes('alone')) {
      responseText = botResponses.isolated || botResponses.default;
    } else if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('sad')) {
      responseText = botResponses.support || botResponses.default;
    }

    return {
      id: `ai-${Date.now()}`,
      text: responseText,
      sender: 'ai',
      timestamp: new Date()
    };
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [activeBot]: [...prev[activeBot], userMessage]
    }));

    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateResponse(messageText, activeBot);
      setMessages(prev => ({
        ...prev,
        [activeBot]: [...prev[activeBot], aiResponse]
      }));
      setIsTyping(false);
      
      // Auto-speak AI response for caretaker bot
      if (activeBot === 'caretaker') {
        speakText(aiResponse.text);
      }
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickReply = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages(prev => ({
      ...prev,
      [activeBot]: []
    }));
    initializeChats();
  };

  if (!isOpen) return null;

  const currentMessages = messages[activeBot] || [];
  const botInfo = {
    qna: {
      name: "Nila",
      role: "AI Assistant",
      avatar: "ai assistant robot",
      color: "blue"
    },
    caretaker: {
      name: "Nora", 
      role: "Virtual Caretaker",
      avatar: "caring nurse woman",
      color: "pink"
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      <Card className="w-full max-w-md h-[450px] shadow-2xl border border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`https://source.unsplash.com/100x100/?${encodeURIComponent(botInfo[activeBot].avatar)}`} />
                <AvatarFallback>{botInfo[activeBot].name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm text-gray-900 dark:text-white font-semibold">{botInfo[activeBot].name}</CardTitle>
                <p className="text-xs text-gray-700 dark:text-gray-200">{botInfo[activeBot].role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-destructive/90"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Bot Toggle */}
          <Tabs value={activeBot} onValueChange={(value) => setActiveBot(value as 'qna' | 'caretaker')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="qna" className="text-xs flex items-center gap-1">
                <Bot className="w-3 h-3" />
                Q&A Bot
              </TabsTrigger>
              <TabsTrigger value="caretaker" className="text-xs flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Caretaker
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="flex flex-col h-[330px] p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="space-y-4">
              {currentMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-primary/90 backdrop-blur-sm text-white shadow-lg' 
                      : 'bg-white/30 dark:bg-white/20 text-gray-900 dark:text-white backdrop-blur-sm border border-white/30 shadow-lg'
                  } rounded-lg p-3`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-80 text-gray-700 dark:text-gray-200">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.sender === 'ai' && activeBot === 'caretaker' && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(message.text)}
                            disabled={isSpeaking}
                            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                          >
                            {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Reply Suggestions */}
              {currentMessages.length > 0 && currentMessages[currentMessages.length - 1].sender === 'ai' && currentMessages[currentMessages.length - 1].suggestions && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">Quick replies:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentMessages[currentMessages.length - 1].suggestions!.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply(suggestion)}
                        className="text-xs h-7"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/30 dark:bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-3 max-w-[80%] shadow-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-700 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-700 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-700 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-white/20 p-4 bg-white/5 dark:bg-black/5 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={activeBot === 'caretaker' ? "Share what's on your mind..." : "Ask me anything..."}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-12 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-300 bg-white/40 dark:bg-white/20 backdrop-blur-sm border-white/50 dark:border-white/30 shadow-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                    isListening ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                size="sm"
                className="h-10 w-10 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Voice Input Status */}
            {isListening && (
              <div className="mt-2 text-center">
                <Badge variant="outline" className="text-xs animate-pulse text-gray-800 dark:text-gray-100 bg-white/40 dark:bg-white/20 backdrop-blur-sm border-white/50 shadow-lg">
                  <Headphones className="w-3 h-3 mr-1" />
                  Listening...
                </Badge>
              </div>
            )}
            
            {/* Speaking Status */}
            {isSpeaking && activeBot === 'caretaker' && (
              <div className="mt-2 text-center">
                <Badge variant="outline" className="text-xs text-gray-800 dark:text-gray-100 bg-white/40 dark:bg-white/20 backdrop-blur-sm border-white/50 shadow-lg">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Speaking...
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stopSpeaking}
                    className="ml-2 h-4 w-4 p-0 text-gray-700 dark:text-gray-200"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}