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
import {
  CheckCircle,
  Clock,
  Trophy,
  MapPin,
  Search,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Star,
  Zap,
  Target,
  Award,
  Sparkles
} from "lucide-react";
import { bankingClues, type ScavengerHuntClue, type BankingOffer } from './data';

export interface AdvancedScavengerHuntProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof advancedScavengerHuntVariants> {
  onStepComplete?: (clueId: string, reward: BankingOffer) => void;
  onGameComplete?: (totalRewards: BankingOffer[]) => void;
  disabled?: boolean;
  theme?: 'banking' | 'investment' | 'retail';
}

const advancedScavengerHuntVariants = cva(
  "relative flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 lg:px-8",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-4xl",
        lg: "max-w-6xl",
        xl: "max-w-7xl",
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

const AdvancedScavengerHunt = React.forwardRef<HTMLDivElement, AdvancedScavengerHuntProps>(
  (
    {
      className,
      size,
      variant,
      onStepComplete,
      onGameComplete,
      disabled = false,
      theme = 'banking',
      ...props
    },
    ref
  ) => {
    const [selectedClues, setSelectedClues] = React.useState<ScavengerHuntClue[]>(() => {
      const saved = localStorage.getItem('advanced-scavenger-hunt-clues');
      return saved ? JSON.parse(saved) : bankingClues.slice(0, 5);
    });
    const [completedClues, setCompletedClues] = React.useState<Set<string>>(() => {
      const saved = localStorage.getItem('advanced-scavenger-hunt-completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [currentClue, setCurrentClue] = React.useState<string | null>(null);
    const [showRewardDialog, setShowRewardDialog] = React.useState(false);
    const [currentReward, setCurrentReward] = React.useState<BankingOffer | null>(null);
    const [gameCompleted, setGameCompleted] = React.useState(false);
    const [timeElapsed, setTimeElapsed] = React.useState(0);
    const [streak, setStreak] = React.useState(0);
    const [score, setScore] = React.useState(0);
    const [showHint, setShowHint] = React.useState(false);

    // Save progress to localStorage
    React.useEffect(() => {
      localStorage.setItem('advanced-scavenger-hunt-clues', JSON.stringify(selectedClues));
      localStorage.setItem('advanced-scavenger-hunt-completed', JSON.stringify([...completedClues]));
    }, [selectedClues, completedClues]);

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
      if (completedClues.size === selectedClues.length && !gameCompleted) {
        setGameCompleted(true);
        const rewards = selectedClues
          .filter(clue => completedClues.has(clue.id))
          .map(clue => clue.reward);
        onGameComplete?.(rewards);
      }
    }, [completedClues, selectedClues, gameCompleted, onGameComplete]);

    const completeClue = React.useCallback((clueId: string) => {
      const clue = selectedClues.find(c => c.id === clueId);
      if (!clue || completedClues.has(clueId)) return;

      setCompletedClues(prev => new Set([...prev, clueId]));
      setStreak(prev => prev + 1);
      setScore(prev => prev + (clue.difficulty === 'hard' ? 100 : clue.difficulty === 'medium' ? 75 : 50));
      setCurrentReward(clue.reward);
      setShowRewardDialog(true);
      setCurrentClue(null);
      onStepComplete?.(clueId, clue.reward);
    }, [selectedClues, completedClues, onStepComplete]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = (completedClues.size / selectedClues.length) * 100;

    const handleClueAction = (clue: ScavengerHuntClue) => {
      if (completedClues.has(clue.id) || disabled) return;

      setCurrentClue(clue.id);
      setShowHint(true);

      // Simulate different actions based on clue type
      const actionTime = clue.difficulty === 'hard' ? 3000 : clue.difficulty === 'medium' ? 2000 : 1500;

      setTimeout(() => {
        completeClue(clue.id);
        setShowHint(false);
      }, actionTime);
    };

    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) {
        case 'easy': return 'bg-green-500';
        case 'medium': return 'bg-yellow-500';
        case 'hard': return 'bg-red-500';
        default: return 'bg-gray-500';
      }
    };

    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'accounts': return <PiggyBank className="w-4 h-4" />;
        case 'loans': return <CreditCard className="w-4 h-4" />;
        case 'credit': return <TrendingUp className="w-4 h-4" />;
        case 'services': return <Search className="w-4 h-4" />;
        case 'locations': return <MapPin className="w-4 h-4" />;
        default: return <Target className="w-4 h-4" />;
      }
    };

    const resetGame = () => {
      setSelectedClues(bankingClues.slice(0, 5));
      setCompletedClues(new Set());
      setGameCompleted(false);
      setTimeElapsed(0);
      setStreak(0);
      setScore(0);
      setCurrentClue(null);
      setShowHint(false);
      localStorage.removeItem('advanced-scavenger-hunt-clues');
      localStorage.removeItem('advanced-scavenger-hunt-completed');
    };

    return (
      <div
        ref={ref}
        className={cn(advancedScavengerHuntVariants({ size, variant }), className)}
        {...props}
      >
        {/* Animated Header with Glassy Effect */}
        <Card className="w-full max-w-5xl mx-auto mb-8 overflow-hidden bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader className="text-center pb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white">
                  Banking Scavenger Hunt
                </CardTitle>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-4 font-medium">
                Complete tasks to unlock exclusive banking rewards!
              </p>
              <div className="flex justify-center">
                <Badge variant="outline" className="animate-bounce bg-emerald-500/20 backdrop-blur-sm border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium">
                  <Star className="w-3 h-3 mr-1" />
                  {theme.toUpperCase()} Edition
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Game Stats with Glassy Effect */}
        <Card className="w-full max-w-6xl mx-auto mb-8 bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Time</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{streak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Streak</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <Award className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{score}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Points</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedClues.size}/{selectedClues.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Complete</div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-200 font-medium">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3 bg-white/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-sm"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Start</span>
                <span>Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clues Grid with Enhanced Design */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 lg:px-0">
            {selectedClues.map((clue, index) => {
              const isCompleted = completedClues.has(clue.id);
              const isActive = currentClue === clue.id;

              return (
                <Card
                  key={clue.id}
                  className={cn(
                    "transition-all duration-500 hover:shadow-2xl cursor-pointer group bg-white/20 backdrop-blur-xl border-white/30 shadow-xl min-h-[280px]",
                    isCompleted
                      ? "bg-green-500/20 border-green-400/30 scale-95"
                      : "hover:bg-white/30 hover:scale-105",
                    isActive && "ring-2 ring-blue-400 animate-pulse",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => handleClueAction(clue)}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 shadow-lg flex-shrink-0",
                        isCompleted
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 scale-110"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 group-hover:from-purple-500 group-hover:to-pink-500"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="text-lg font-bold">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          {getCategoryIcon(clue.category)}
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                            {clue.bankingContext}
                          </h3>
                          <div className={cn(
                            "w-3 h-3 rounded-full flex-shrink-0",
                            getDifficultyColor(clue.difficulty)
                          )} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/30 flex-1">
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                        💡 {clue.virtualAction}
                      </p>
                    </div>

                    <Button
                      size="lg"
                      variant={isCompleted ? "outline" : "default"}
                      disabled={isCompleted || disabled || isActive}
                      className={cn(
                        "w-full transition-all duration-300 mt-auto",
                        isCompleted
                          ? "bg-green-500/20 border-green-400/30 text-green-700 dark:text-green-300 hover:bg-green-500/30"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl"
                      )}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : isActive ? (
                        <>
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                          Working...
                        </>
                      ) : (
                        "Start Task"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Completion Message */}
        {gameCompleted && (
          <Card className="w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-4 bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">🎉 Hunt Complete!</h3>
              <p className="text-gray-700 dark:text-gray-200 mb-6 text-lg">
                Final Score: {score} points in {formatTime(timeElapsed)}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-400/30">🏆 Perfect Streak: {streak}</Badge>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-400/30">⏱️ Time: {formatTime(timeElapsed)}</Badge>
                </div>
              </div>
              <Button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl"
                size="lg"
              >
                Start New Hunt
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Reward Dialog */}
        <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
          <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-green-600 dark:text-green-400">
                🎁 Reward Unlocked!
              </DialogTitle>
              <DialogDescription className="text-center text-gray-700 dark:text-gray-200">
                {currentReward?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-4 border border-green-200/50">
                <p className="text-gray-700 dark:text-gray-200 mb-3 font-medium">
                  {currentReward?.description}
                </p>
                {currentReward?.value && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-green-300/50 shadow-lg">
                    <p className="font-mono text-xl font-bold text-green-600 dark:text-green-400">
                      {currentReward.value}
                    </p>
                  </div>
                )}
                {currentReward?.code && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Use code:</p>
                    <p className="font-mono text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded border border-green-200/50">
                      {currentReward.code}
                    </p>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setShowRewardDialog(false)}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl"
                size="lg"
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

AdvancedScavengerHunt.displayName = "AdvancedScavengerHunt";

export { AdvancedScavengerHunt }; 