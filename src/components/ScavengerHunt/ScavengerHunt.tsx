import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Clock, Trophy, MapPin, Search, CreditCard, PiggyBank, TrendingUp } from "lucide-react";

export interface ScavengerHuntStep {
  id: string;
  title: string;
  description: string;
  clue: string;
  action: string;
  icon: React.ReactNode;
  completed: boolean;
  reward?: {
    type: 'offer' | 'coupon' | 'message';
    title: string;
    description: string;
    value?: string;
  };
}

export interface ScavengerHuntProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof scavengerHuntVariants> {
  onStepComplete?: (stepId: string) => void;
  onGameComplete?: (totalRewards: any[]) => void;
  disabled?: boolean;
}

const scavengerHuntVariants = cva(
  "relative flex flex-col items-center justify-center",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
      variant: {
        default: "bg-background px-4",
        card: "bg-card border rounded-lg p-6 shadow-sm",
        minimal: "bg-transparent px-4",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const defaultSteps: ScavengerHuntStep[] = [
  {
    id: "find-lowest-rate",
    title: "Find the Best Rate",
    description: "Locate the lowest interest rate plan on the website",
    clue: "Look for the plan that saves you the most money",
    action: "Click on the account with the lowest APR",
    icon: <TrendingUp className="w-5 h-5" />,
    completed: false,
    reward: {
      type: 'offer',
      title: "Rate Match Guarantee",
      description: "We'll match any competitor's rate!",
      value: "0.5% APR reduction"
    }
  },
  {
    id: "gold-savings",
    title: "Golden Opportunity",
    description: "Locate the gold savings account information",
    clue: "Find the premium savings option with golden benefits",
    action: "Navigate to the premium savings section",
    icon: <PiggyBank className="w-5 h-5" />,
    completed: false,
    reward: {
      type: 'coupon',
      title: "Gold Account Bonus",
      description: "Get $50 bonus when you open a gold account",
      value: "SAVE50"
    }
  },
  {
    id: "credit-score-tips",
    title: "Credit Score Wisdom",
    description: "Answer a clue about credit score improvement tips",
    clue: "What's the most important factor in your credit score?",
    action: "Select the correct answer about credit scores",
    icon: <CreditCard className="w-5 h-5" />,
    completed: false,
    reward: {
      type: 'message',
      title: "Credit Score Expert",
      description: "You're now eligible for our credit monitoring service",
      value: "Free credit report"
    }
  },
  {
    id: "hidden-offers",
    title: "Hidden Treasures",
    description: "Reveal hidden offers by visiting 3 pages",
    clue: "Explore different sections to unlock special deals",
    action: "Visit 3 different pages on the website",
    icon: <Search className="w-5 h-5" />,
    completed: false,
    reward: {
      type: 'offer',
      title: "Explorer's Reward",
      description: "Exclusive access to limited-time offers",
      value: "20% off fees"
    }
  },
  {
    id: "branch-locator",
    title: "Branch Discovery",
    description: "Find the nearest branch location",
    clue: "Use our locator to find a branch near you",
    action: "Search for a branch in your area",
    icon: <MapPin className="w-5 h-5" />,
    completed: false,
    reward: {
      type: 'coupon',
      title: "Branch Visit Bonus",
      description: "Get a free coffee when you visit any branch",
      value: "COFFEE2024"
    }
  }
];

const ScavengerHunt = React.forwardRef<HTMLDivElement, ScavengerHuntProps>(
  (
    {
      className,
      size,
      variant,
      onStepComplete,
      onGameComplete,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [steps, setSteps] = React.useState<ScavengerHuntStep[]>(() => {
      const saved = localStorage.getItem('scavenger-hunt-progress');
      return saved ? JSON.parse(saved) : defaultSteps;
    });
    const [currentStep, setCurrentStep] = React.useState(0);
    const [showRewardDialog, setShowRewardDialog] = React.useState(false);
    const [currentReward, setCurrentReward] = React.useState<any>(null);
    const [gameCompleted, setGameCompleted] = React.useState(false);
    const [timeElapsed, setTimeElapsed] = React.useState(0);
    const [streak, setStreak] = React.useState(0);

    // Save progress to localStorage
    React.useEffect(() => {
      localStorage.setItem('scavenger-hunt-progress', JSON.stringify(steps));
    }, [steps]);

    // Timer effect
    React.useEffect(() => {
      if (gameCompleted) return;

      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }, [gameCompleted]);

    // Check for game completion
    React.useEffect(() => {
      const completedSteps = steps.filter(step => step.completed);
      if (completedSteps.length === steps.length && !gameCompleted) {
        setGameCompleted(true);
        onGameComplete?.(completedSteps.map(step => step.reward).filter(Boolean));
      }
    }, [steps, gameCompleted, onGameComplete]);

    const completeStep = React.useCallback((stepId: string) => {
      setSteps(prev => prev.map(step => {
        if (step.id === stepId && !step.completed) {
          setStreak(prevStreak => prevStreak + 1);
          setCurrentReward(step.reward);
          setShowRewardDialog(true);
          onStepComplete?.(stepId);
          return { ...step, completed: true };
        }
        return step;
      }));
    }, [onStepComplete]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = (steps.filter(step => step.completed).length / steps.length) * 100;

    const handleStepAction = (step: ScavengerHuntStep) => {
      if (step.completed || disabled) return;

      // Simulate different actions based on step type
      switch (step.id) {
        case 'find-lowest-rate':
          // Simulate finding and clicking on lowest rate
          setTimeout(() => completeStep(step.id), 1000);
          break;
        case 'gold-savings':
          // Simulate navigating to gold savings
          setTimeout(() => completeStep(step.id), 1500);
          break;
        case 'credit-score-tips':
          // Simulate answering credit score question
          setTimeout(() => completeStep(step.id), 800);
          break;
        case 'hidden-offers':
          // Simulate visiting multiple pages
          setTimeout(() => completeStep(step.id), 2000);
          break;
        case 'branch-locator':
          // Simulate finding branch location
          setTimeout(() => completeStep(step.id), 1200);
          break;
        default:
          completeStep(step.id);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(scavengerHuntVariants({ size, variant }), className)}
        {...props}
      >
        {/* Game Header */}
        <Card className="w-full mb-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              🗺️ Banking Scavenger Hunt
            </CardTitle>
            <p className="text-muted-foreground">
              Complete tasks to unlock exclusive banking rewards!
            </p>
          </CardHeader>
        </Card>

        {/* Game Stats */}
        <Card className="w-full mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Badge variant="secondary" className="text-sm">
                <Clock className="w-3 h-3 mr-1" />
                Time: {formatTime(timeElapsed)}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Trophy className="w-3 h-3 mr-1" />
                Streak: {streak}
              </Badge>
              <Badge variant="default" className="text-sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                {steps.filter(s => s.completed).length}/{steps.length} Complete
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Steps Grid */}
        <div className="w-full max-w-4xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <Card
                key={step.id}
                className={cn(
                  "transition-all duration-300 hover:shadow-lg cursor-pointer",
                  step.completed
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : "hover:bg-muted/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => handleStepAction(step)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white",
                      step.completed
                        ? "bg-green-500"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {step.icon}
                        <h3 className="font-semibold text-sm">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        {step.description}
                      </p>

                      <div className="bg-muted/50 rounded p-2 mb-3">
                        <p className="text-xs font-medium text-foreground">
                          💡 {step.clue}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant={step.completed ? "outline" : "default"}
                        disabled={step.completed || disabled}
                        className="w-full"
                      >
                        {step.completed ? "Completed" : step.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completion Message */}
        {gameCompleted && (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">🎉 Hunt Complete!</h3>
              <p className="text-muted-foreground mb-4">
                You've unlocked all rewards! Check your email for exclusive offers.
              </p>
              <Button
                onClick={() => {
                  setSteps(defaultSteps.map(step => ({ ...step, completed: false })));
                  setGameCompleted(false);
                  setTimeElapsed(0);
                  setStreak(0);
                  localStorage.removeItem('scavenger-hunt-progress');
                }}
              >
                Start New Hunt
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Reward Dialog */}
        <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-green-600 dark:text-green-400">
                🎁 Reward Unlocked!
              </DialogTitle>
              <DialogDescription className="text-center">
                {currentReward?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {currentReward?.description}
              </p>
              {currentReward?.value && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-mono text-lg font-bold text-primary">
                    {currentReward.value}
                  </p>
                </div>
              )}
              <Button
                onClick={() => setShowRewardDialog(false)}
                className="w-full"
              >
                Continue Hunting
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

ScavengerHunt.displayName = "ScavengerHunt";

export { ScavengerHunt }; 