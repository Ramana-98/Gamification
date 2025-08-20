import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRandomPrize, eggEmojis } from './data';
import type { PrizeData } from './data';
import { PrizeReveal } from './PrizeReveal';
import { playGameSound, playSound } from '@/lib/sound-effects';

const mysteryEggVariants = cva(
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
        card: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl",
        minimal: "bg-transparent px-4",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

interface GameStats {
  totalPlays: number;
  prizesWon: number;
  lastPrize: PrizeData | null;
}

interface MysteryPrizeEggProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof mysteryEggVariants> {
  onGameComplete?: (prize: PrizeData) => void;
  onEggCrack?: (eggIndex: number) => void;
  disabled?: boolean;
}

const MysteryPrizeEgg = React.forwardRef<HTMLDivElement, MysteryPrizeEggProps>(
  (
    {
      className,
      size,
      variant,
      onGameComplete,
      onEggCrack,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [crackedEggs, setCrackedEggs] = React.useState<Set<number>>(new Set());
    const [currentPrize, setCurrentPrize] = React.useState<PrizeData | null>(null);
    const [showReveal, setShowReveal] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [stats, setStats] = React.useState<GameStats>({
      totalPlays: 0,
      prizesWon: 0,
      lastPrize: null
    });

    const handleEggClick = React.useCallback((eggIndex: number) => {
      if (disabled || isAnimating || crackedEggs.has(eggIndex)) return;

      // Play initial crack sound
      playGameSound('mystery', 'crack').catch(console.warn);

      setIsAnimating(true);
      onEggCrack?.(eggIndex);

      // Simulate egg cracking animation with enhanced sound effects
      setTimeout(() => {
        const prize = getRandomPrize();
        setCurrentPrize(prize);
        setCrackedEggs(prev => new Set([...prev, eggIndex]));

        // Show prize reveal
        setShowReveal(true);
        setIsAnimating(false);

        // Play enhanced reveal sounds with timing
        setTimeout(() => {
          if (prize.rarity === 'legendary') {
            playGameSound('mystery', 'legendary').catch(console.warn);
            // Add extra sparkle sounds for legendary
            setTimeout(() => playSound('sparkle', { volume: 0.2 }).catch(console.warn), 200);
            setTimeout(() => playSound('sparkle', { volume: 0.15 }).catch(console.warn), 400);
          } else if (prize.rarity === 'epic' || prize.rarity === 'rare') {
            playGameSound('mystery', 'rare').catch(console.warn);
            // Add sparkle sound for rare/epic
            setTimeout(() => playSound('sparkle', { volume: 0.15 }).catch(console.warn), 300);
          } else {
            playGameSound('mystery', 'reveal').catch(console.warn);
          }
        }, 100); // Small delay for reveal animation

        // Update stats
        setStats(prev => ({
          totalPlays: prev.totalPlays + 1,
          prizesWon: prev.prizesWon + 1,
          lastPrize: prize
        }));

        onGameComplete?.(prize);
      }, 800);
    }, [disabled, isAnimating, crackedEggs, onEggCrack, onGameComplete]);

    const handleRevealClose = () => {
      setShowReveal(false);
      setCurrentPrize(null);
    };

    const resetGame = () => {
      setCrackedEggs(new Set());
      setCurrentPrize(null);
      setShowReveal(false);
      setIsAnimating(false);
      // Play reset sound
      playGameSound('mystery', 'crack').catch(console.warn);
    };

    const getEggState = (index: number) => {
      if (crackedEggs.has(index)) {
        return 'cracked';
      }
      if (isAnimating && crackedEggs.has(index)) {
        return 'cracking';
      }
      return 'intact';
    };

    const getEggEmoji = (index: number) => {
      const state = getEggState(index);
      switch (state) {
        case 'cracked':
          return '🥚'; // Cracked egg
        case 'cracking':
          return '🥚'; // Cracking animation
        default:
          return eggEmojis[index] || '🥚';
      }
    };

    const getEggClass = (index: number) => {
      const state = getEggState(index);
      return cn(
        "cursor-pointer transition-all duration-500 transform hover:scale-110 aspect-square",
        "flex items-center justify-center text-6xl select-none",
        state === 'cracked' && "opacity-50 scale-95",
        state === 'cracking' && "animate-pulse scale-105",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && state === 'intact' && "hover:animate-bounce"
      );
    };

    return (
      <div
        ref={ref}
        className={cn(mysteryEggVariants({ size, variant }), className)}
        {...props}
      >
        {/* Game Stats */}
        <div className="flex justify-between items-center mb-6 w-full">
          <div className="flex gap-3">
            <Badge variant="secondary" className="text-sm">
              Eggs Cracked: {crackedEggs.size}/{eggEmojis.length}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Prizes Won: {stats.prizesWon}
            </Badge>
          </div>
          <Button
            onClick={resetGame}
            variant="outline"
            size="sm"
            disabled={disabled || isAnimating}
          >
            Reset Game
          </Button>
        </div>

        {/* Game Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            🥚 Mystery Prize Eggs
          </h2>
          <p className="text-muted-foreground">
            Click an egg to crack it and reveal your prize!
          </p>
        </div>

        {/* Egg Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-md mx-auto">
          {eggEmojis.map((_, index) => (
            <Card
              key={index}
              className={cn(
                "transition-all duration-300",
                getEggState(index) === 'cracked' && "bg-muted/50",
                getEggState(index) === 'cracking' && "ring-2 ring-primary animate-pulse"
              )}
              onClick={() => handleEggClick(index)}
            >
              <CardContent className="p-4 h-24 flex items-center justify-center">
                <div className={getEggClass(index)}>
                  {getEggEmoji(index)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Status */}
        {crackedEggs.size === eggEmojis.length && (
          <Card className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <CardContent className="text-center p-4">
              <div className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">
                🎉 All eggs cracked!
              </div>
              <div className="text-green-600 dark:text-green-300">
                You've revealed all {eggEmojis.length} prizes!
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Each egg contains a random prize with different rarities!</p>
        </div>

        {/* Prize Reveal Modal */}
        <PrizeReveal
          prize={currentPrize}
          isOpen={showReveal}
          onClose={handleRevealClose}
        />
      </div>
    );
  }
);

MysteryPrizeEgg.displayName = "MysteryPrizeEgg";

export { MysteryPrizeEgg }; 