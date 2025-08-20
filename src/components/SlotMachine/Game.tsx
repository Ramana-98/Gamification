import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { slotSymbols, spinReels, checkWin, createReelStrip, type SlotSymbol, type GameStats } from './data';
import { playGameSound, playContinuousSound, stopSound } from '@/lib/sound-effects';

const slotMachineVariants = cva(
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

interface SlotMachineProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof slotMachineVariants> {
  onSpinStart?: () => void;
  onSpinEnd?: (result: { isWin: boolean; winAmount: number }) => void;
  disabled?: boolean;
}

const SlotMachine = React.forwardRef<HTMLDivElement, SlotMachineProps>(
  (
    {
      className,
      size,
      variant,
      onSpinStart,
      onSpinEnd,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [reels, setReels] = React.useState<SlotSymbol[][]>([]);
    const [reelStrips, setReelStrips] = React.useState<SlotSymbol[][]>([]);
    const [isSpinning, setIsSpinning] = React.useState(false);
    const [leverPulled, setLeverPulled] = React.useState(false);
    const [winResult, setWinResult] = React.useState<{ isWin: boolean; winAmount: number } | null>(null);
    const [reelPositions, setReelPositions] = React.useState([0, 0, 0]); // Track vertical positions
    const [showWinDialog, setShowWinDialog] = React.useState(false);
    const [stats, setStats] = React.useState<GameStats>({
      totalSpins: 0,
      totalWins: 0,
      totalWinnings: 0,
      lastWin: 0
    });

    // Initialize reels and strips on mount
    React.useEffect(() => {
      const initialReels = spinReels();
      setReels(initialReels);

      // Create reel strips for vertical scrolling
      const strips = [];
      for (let i = 0; i < 3; i++) {
        strips.push(createReelStrip());
      }
      setReelStrips(strips);
    }, []);

    // Add spinning animation effect
    React.useEffect(() => {
      if (!isSpinning) return;

      const spinInterval = setInterval(() => {
        setReelPositions(prev => prev.map(pos => (pos + 1) % 23)); // 23 symbols per strip
      }, 100); // Spin every 100ms

      return () => clearInterval(spinInterval);
    }, [isSpinning]);

    // Handle win dialog
    React.useEffect(() => {
      if (winResult?.isWin) {
        setShowWinDialog(true);
      }
    }, [winResult]);

    const handleLeverPull = React.useCallback(async () => {
      if (disabled || isSpinning) return;

      // Play lever pull sound
      await playGameSound('slot', 'lever-pull').catch(console.warn);

      setIsSpinning(true);
      setLeverPulled(true);
      setWinResult(null);
      setShowWinDialog(false);
      onSpinStart?.();

      // Update stats
      setStats(prev => ({
        ...prev,
        totalSpins: prev.totalSpins + 1
      }));

      // Start spinning sound
      await playContinuousSound('slot', 'spinning-sound', { volume: 0.2 }).catch(console.warn);

      // Generate new reel result
      const newReels = spinReels();

      // Stop reels one by one (left to right)
      setTimeout(() => {
        setReelPositions(prev => [prev[0], prev[1], prev[2]]); // Stop first reel
      }, 800);

      setTimeout(() => {
        setReelPositions(prev => [prev[0], prev[1], prev[2]]); // Stop second reel
      }, 1300);

      setTimeout(async () => {
        setReels(newReels);
        setIsSpinning(false);
        setLeverPulled(false);

        // Stop spinning sound
        stopSound('spinning-sound');

        // Check for win
        const result = checkWin(newReels);
        setWinResult(result);

        if (result.isWin) {
          // Play win sound
          await playGameSound('slot', 'win').catch(console.warn);

          // Update stats
          setStats(prev => ({
            ...prev,
            totalWins: prev.totalWins + 1,
            totalWinnings: prev.totalWinnings + result.winAmount,
            lastWin: result.winAmount
          }));
        }

        onSpinEnd?.(result);
      }, 1800);
    }, [disabled, isSpinning, onSpinStart, onSpinEnd]);

    const getSymbolClass = (symbol: SlotSymbol, isWinning: boolean = false) => {
      return cn(
        "text-4xl md:text-5xl transition-all duration-300 select-none",
        symbol.color,
        isWinning && "animate-pulse scale-110",
        isSpinning && "animate-spin"
      );
    };

    const renderReel = (reelIndex: number) => {
      const strip = reelStrips[reelIndex] || [];
      const isSpinningReel = isSpinning;
      const currentPosition = reelPositions[reelIndex];

      return (
        <Card key={reelIndex} className="relative w-20 lg:w-24 h-60 lg:h-72 overflow-hidden border-2 border-border shadow-lg">
          <CardContent className="p-0 h-full">
            {/* Reel window with center focus */}
            <div className="relative h-full flex flex-col">
              {/* Top overflow area */}
              <div className="h-16 lg:h-20 bg-muted/50"></div>

              {/* Center visible area (3 symbols) */}
              <div className="h-48 lg:h-56 flex flex-col justify-center">
                {[0, 1, 2].map((symbolIndex) => {
                  const symbolPosition = (currentPosition + symbolIndex) % strip.length;
                  const symbol = strip[symbolPosition];
                  const isCenterRow = symbolIndex === 1;
                  const isWinningRow = winResult?.isWin && isCenterRow;

                  return (
                    <div
                      key={symbolIndex}
                      className={cn(
                        "w-full h-16 lg:h-20 flex items-center justify-center",
                        "bg-card border-b border-border/50",
                        isCenterRow && "ring-2 ring-primary/30 ring-offset-2", // Center focus
                        isWinningRow && "ring-4 ring-green-500/75 ring-offset-2 animate-pulse bg-green-500/10" // Win highlight
                      )}
                    >
                      <span className={cn(
                        "text-3xl lg:text-4xl transition-all duration-300",
                        isSpinningReel && "animate-spin",
                        isWinningRow && "scale-110"
                      )}>
                        {symbol?.symbol || "🍒"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom overflow area */}
              <div className="h-16 lg:h-20 bg-muted/50"></div>
            </div>

            {/* Spinning overlay for visual effect */}
            {isSpinningReel && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-pulse pointer-events-none"></div>
            )}
          </CardContent>
        </Card>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(slotMachineVariants({ size, variant }), className)}
        {...props}
      >
        {/* Game Stats */}
        <Card className="w-full mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="text-sm">
                🎰 Spins: {stats.totalSpins}
              </Badge>
              <Badge variant="outline" className="text-sm">
                🏆 Wins: {stats.totalWins}
              </Badge>
              <Badge variant="default" className="text-sm">
                💰 Total: {stats.totalWinnings}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Game Title */}
        <Card className="w-full mb-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              🎰 Slot Machine
            </CardTitle>
            <p className="text-muted-foreground">
              Pull the lever to spin and win!
            </p>
          </CardHeader>
        </Card>

        {/* Slot Machine Body */}
        <Card className="w-full max-w-2xl mx-auto mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Reels Display */}
              <div className="flex gap-3 lg:gap-4 mb-6 lg:mb-0">
                {[0, 1, 2].map(renderReel)}
              </div>

              {/* Lever */}
              <div className="flex flex-col items-center">
                {/* Lever Base */}
                <div className="w-16 h-16 bg-gradient-to-b from-muted to-muted/80 rounded-full mb-6 shadow-lg border-2 border-border relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
                </div>

                {/* Lever Handle */}
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-8 h-24 bg-gradient-to-b from-muted via-muted/90 to-muted rounded-full",
                    "relative cursor-pointer transition-all duration-500 ease-out",
                    "hover:from-muted/80 hover:via-muted/70 hover:to-muted/80",
                    "shadow-lg hover:shadow-xl hover:scale-105",
                    "border-2 border-border",
                    leverPulled && "transform rotate-12 translate-y-2",
                    disabled && "opacity-50 cursor-not-allowed",
                    "before:content-[''] before:absolute before:top-0 before:left-1/2 before:transform before:-translate-x-1/2",
                    "before:w-10 before:h-10 before:bg-destructive before:rounded-full before:border-2 before:border-destructive/80",
                    "before:shadow-inner before:z-10 before:hover:bg-destructive/90",
                    "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2",
                    "after:w-6 after:h-6 after:bg-muted-foreground/20 after:rounded-full after:border after:border-border"
                  )}
                  onClick={handleLeverPull}
                  disabled={disabled || isSpinning}
                >
                  {/* Lever Grip */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-destructive rounded-full border-2 border-destructive/80 shadow-inner hover:bg-destructive/90 transition-colors"></div>
                </Button>

                {/* Pull Text */}
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    {isSpinning ? "🎰 Spinning..." : "⬇️ PULL"}
                  </p>
                </div>
              </div>
            </div>

            {/* Win Display */}
            {winResult && (
              <div className="text-center mt-6">
                {winResult.isWin ? (
                  <Card className="bg-green-500/10 border-green-500/30 animate-pulse">
                    <CardContent className="p-4">
                      <p className="text-green-700 dark:text-green-300 font-bold text-xl">
                        🎉 JACKPOT! +{winResult.winAmount}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="p-4">
                      <p className="text-muted-foreground">
                        Try again! 🎯
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paytable */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">💰 Paytable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {slotSymbols.map((symbol) => (
                <Card key={symbol.id} className="p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{symbol.symbol}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{symbol.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {symbol.value} pts
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Win Dialog */}
        <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-green-600 dark:text-green-400">
                🎉 Congratulations!
              </DialogTitle>
              <DialogDescription className="text-center text-lg">
                You won <span className="font-bold text-green-600 dark:text-green-400">+{winResult?.winAmount}</span> points!
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
              <Button
                onClick={() => setShowWinDialog(false)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                🎰 Spin Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

SlotMachine.displayName = "SlotMachine";

export { SlotMachine }; 