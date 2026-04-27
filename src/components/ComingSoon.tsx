import React from 'react';
import Layout from '@/components/Layout';
import { Clock, Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ComingSoon = ({ title, description, icon }: ComingSoonProps) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[75vh] animate-fade-in-up">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="text-center max-w-2xl mx-auto px-6 space-y-8">
          {/* Back button */}
          <div className="flex justify-start mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="group text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
          </div>

          {/* Animated icon container */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-primary/10 animate-ping opacity-20" style={{ animationDuration: '4s' }}></div>
            <div className="absolute w-24 h-24 rounded-full bg-primary/5 animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-2xl medical-gradient flex items-center justify-center shadow-medical transform hover:scale-110 transition-transform duration-500">
              <div className="text-white scale-125">
                {icon}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
              {title}
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {description}
            </p>
          </div>

          {/* Premium Status Badge */}
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-3 glass px-8 py-4 rounded-2xl shadow-xl border-white/40 dark:border-white/5 group hover:bg-white/90 dark:hover:bg-black/60 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Development Phase</p>
                <p className="text-sm font-semibold text-foreground">Feature Launching Soon</p>
              </div>
              <div className="ml-4 h-8 w-px bg-border/50"></div>
              <Clock className="h-5 w-5 text-muted-foreground ml-2 group-hover:rotate-12 transition-transform" />
            </div>
            
            <p className="text-sm text-muted-foreground/80 font-medium">
              We're integrating advanced AI and real-time synchronization for this module.
            </p>
          </div>

          {/* Progress Indicator (Mock) */}
          <div className="w-full max-w-xs mx-auto space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-tighter">
              <span>Integration</span>
              <span>85%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComingSoon;
