
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface TranaAssistantProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  context?: any;
}

const TranaAssistant: React.FC<TranaAssistantProps> = ({ 
  isMinimized = false, 
  onToggleMinimize,
  context 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m TRANA, your virtual assistant for hospital emergency response and coordination. I can help you with emergency protocols, bed availability, ambulance tracking, appointment booking, and general hospital navigation. How can I assist you today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('trana-assistant', {
        body: {
          message: inputMessage,
          context: context
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error communicating with TRANA:', error);
      toast.error('Failed to get response from TRANA assistant');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact the system administrator.',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={onToggleMinimize}
          className="rounded-full h-12 w-12 bg-medical-blue hover:bg-medical-blue/80 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 z-50 shadow-2xl border-medical-blue/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-medical-blue rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">TRANA Assistant</CardTitle>
              <Badge variant="outline" className="text-xs">Online</Badge>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleMinimize}
            className="h-8 w-8 p-0"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 flex flex-col h-[calc(100%-80px)]">
        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-2",
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'assistant' && (
                  <div className="h-6 w-6 bg-medical-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.sender === 'user'
                      ? 'bg-medical-blue text-white ml-auto'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className={cn(
                    "text-xs mt-1 block",
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {message.sender === 'user' && (
                  <div className="h-6 w-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="h-6 w-6 bg-medical-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <div className="flex space-x-2 mt-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask TRANA anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !inputMessage.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranaAssistant;
