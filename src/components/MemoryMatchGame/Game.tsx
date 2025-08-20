import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { createShuffledCards } from './data';
import type { CardData } from './data';
import { playGameSound } from '@/lib/sound-effects';

const memoryMatchVariants = cva(
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
  moves: number;
  matchedPairs: number;
  totalPairs: number;
}

interface MemoryMatchGameProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof memoryMatchVariants> {
  onGameComplete?: (stats: GameStats) => void;
  onMoveMade?: (moves: number) => void;
  disabled?: boolean;
}

const MemoryMatchGame = React.forwardRef<HTMLDivElement, MemoryMatchGameProps>(
  (
    {
      className,
      size,
      variant,
      onGameComplete,
      onMoveMade,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [cards, setCards] = React.useState<CardData[]>([]);
    const [flippedCards, setFlippedCards] = React.useState<number[]>([]);
    const [stats, setStats] = React.useState<GameStats>({
      moves: 0,
      matchedPairs: 0,
      totalPairs: 8
    });
    const [isLocked, setIsLocked] = React.useState(false);
    const [gameCompleted, setGameCompleted] = React.useState(false);

    // Initialize game
    React.useEffect(() => {
      startNewGame();
    }, []);

    const startNewGame = () => {
      const newCards = createShuffledCards();
      setCards(newCards);
      setFlippedCards([]);
      setStats({
        moves: 0,
        matchedPairs: 0,
        totalPairs: 8
      });
      setIsLocked(false);
      setGameCompleted(false);
      // Play new game sound
      playGameSound('memory', 'flip').catch(console.warn);
    };

    const handleCardClick = React.useCallback((cardId: number) => {
      if (isLocked || gameCompleted || disabled) return;

      const card = cards.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return;

      // If we already have 2 cards flipped, don't allow more
      if (flippedCards.length >= 2) return;

      // Play flip sound
      playGameSound('memory', 'flip').catch(console.warn);

      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      // If this is the second card, check for match
      if (newFlippedCards.length === 2) {
        setIsLocked(true);
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
          // Match found
          setTimeout(() => {
            // Play match sound
            playGameSound('memory', 'match').catch(console.warn);

            setCards(prev => prev.map(card =>
              newFlippedCards.includes(card.id)
                ? { ...card, isMatched: true }
                : card
            ));
            setFlippedCards([]);
            setIsLocked(false);

            const newMatchedPairs = stats.matchedPairs + 1;
            const newStats = {
              ...stats,
              moves: stats.moves + 1,
              matchedPairs: newMatchedPairs
            };
            setStats(newStats);
            onMoveMade?.(newStats.moves + 1);

            // Check if game is complete
            if (newMatchedPairs === stats.totalPairs) {
              setGameCompleted(true);
              // Play completion sound
              playGameSound('memory', 'complete').catch(console.warn);
              onGameComplete?.(newStats);
            }
          }, 1000);
        } else {
          // No match, flip cards back
          setTimeout(() => {
            setFlippedCards([]);
            setIsLocked(false);
            const newStats = { ...stats, moves: stats.moves + 1 };
            setStats(newStats);
            onMoveMade?.(newStats.moves + 1);
          }, 1000);
        }
      }
    }, [cards, flippedCards, isLocked, gameCompleted, stats, onMoveMade, onGameComplete, disabled]);

    const isCardFlipped = (cardId: number) => {
      return flippedCards.includes(cardId) || cards.find(c => c.id === cardId)?.isMatched;
    };

    const getCardContent = (card: CardData) => {
      if (isCardFlipped(card.id)) {
        return (
          <div className="flex items-center justify-center h-full text-4xl select-none">
            {card.emoji}
          </div>
        );
      }
      return (
        <div className="flex items-center justify-center h-full text-2xl text-muted-foreground select-none">
          ❓
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(memoryMatchVariants({ size, variant }), className)}
        {...props}
      >
        {/* Game Stats */}
        <div className="flex justify-between items-center mb-6 w-full">
          <div className="flex gap-3">
            <Badge variant="secondary" className="text-sm">
              Moves: {stats.moves}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Pairs: {stats.matchedPairs}/{stats.totalPairs}
            </Badge>
          </div>
          <Button
            onClick={startNewGame}
            variant="outline"
            size="sm"
            disabled={isLocked || disabled}
          >
            New Game
          </Button>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6 w-full max-w-md mx-auto">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={cn(
                "cursor-pointer transition-all duration-300 transform hover:scale-105 aspect-square",
                isCardFlipped(card.id)
                  ? "bg-card shadow-md"
                  : "bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/20",
                card.isMatched && "ring-2 ring-green-500 shadow-lg",
                isLocked && flippedCards.includes(card.id) && "animate-pulse",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent className="p-2 h-full flex items-center justify-center">
                {getCardContent(card)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Status */}
        {gameCompleted && (
          <Card className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <CardContent className="text-center p-4">
              <div className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">
                🎉 Congratulations! You completed the game!
              </div>
              <div className="text-green-600 dark:text-green-300">
                You matched all {stats.totalPairs} pairs in {stats.moves} moves!
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Click on cards to flip them and find matching pairs!</p>
        </div>
      </div>
    );
  }
);

MemoryMatchGame.displayName = "MemoryMatchGame";

export { MemoryMatchGame }; 