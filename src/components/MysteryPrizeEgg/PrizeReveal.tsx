import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PrizeData } from "./data";
import { playGameSound, playSound } from "@/lib/sound-effects";

interface PrizeRevealProps {
  prize: PrizeData | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
    case 'epic': return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
    case 'rare': return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
    default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  }
};

const getRarityText = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'LEGENDARY!';
    case 'epic': return 'EPIC!';
    case 'rare': return 'RARE!';
    default: return 'COMMON';
  }
};

export const PrizeReveal: React.FC<PrizeRevealProps> = ({
  prize,
  isOpen,
  onClose,
  className
}) => {
  // Play sound when modal opens
  React.useEffect(() => {
    if (isOpen && prize) {
      if (prize.rarity === 'legendary') {
        playGameSound('mystery', 'legendary').catch(console.warn);
        // Add extra sparkle sounds for legendary
        setTimeout(() => playSound('sparkle', { volume: 0.2 }).catch(console.warn), 500);
        setTimeout(() => playSound('sparkle', { volume: 0.15 }).catch(console.warn), 800);
      } else if (prize.rarity === 'epic' || prize.rarity === 'rare') {
        playGameSound('mystery', 'rare').catch(console.warn);
        // Add sparkle sound for rare/epic
        setTimeout(() => playSound('sparkle', { volume: 0.15 }).catch(console.warn), 600);
      } else {
        playGameSound('mystery', 'reveal').catch(console.warn);
      }
    }
  }, [isOpen, prize]);

  if (!isOpen || !prize) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
      "animate-in fade-in duration-300",
      className
    )}>
      <Card className={cn(
        "relative max-w-md w-full mx-4 transform transition-all duration-500",
        "animate-in zoom-in-95 duration-300",
        "border-2 shadow-2xl",
        prize.rarity === 'legendary' && "border-yellow-400 shadow-yellow-400/20",
        prize.rarity === 'epic' && "border-purple-400 shadow-purple-400/20",
        prize.rarity === 'rare' && "border-blue-400 shadow-blue-400/20",
        prize.rarity === 'common' && "border-gray-400 shadow-gray-400/20"
      )}>
        <CardContent className="p-8 text-center relative overflow-hidden">
          {/* Confetti effect for rare+ prizes */}
          {(prize.rarity === 'rare' || prize.rarity === 'epic' || prize.rarity === 'legendary') && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-2 h-2 rounded-full animate-bounce",
                    "animate-in slide-in-from-top-2 duration-1000",
                    prize.rarity === 'legendary' && "bg-yellow-400",
                    prize.rarity === 'epic' && "bg-purple-400",
                    prize.rarity === 'rare' && "bg-blue-400"
                  )}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Rarity Badge */}
          <Badge
            className={cn(
              "mb-4 text-xs font-bold px-3 py-1",
              getRarityColor(prize.rarity)
            )}
          >
            {getRarityText(prize.rarity)}
          </Badge>

          {/* Prize Emoji */}
          <div className="text-8xl mb-4 animate-bounce">
            {prize.emoji}
          </div>

          {/* Prize Name */}
          <h3 className="text-2xl font-bold mb-2 text-foreground">
            {prize.name}
          </h3>

          {/* Prize Value */}
          <p className="text-lg text-muted-foreground mb-6">
            {prize.value}
          </p>

          {/* Prize Type */}
          <div className={cn(
            "inline-block px-4 py-2 rounded-full text-sm font-medium mb-6",
            prize.color
          )}>
            {prize.type.toUpperCase()}
          </div>

          {/* Action Button */}
          <Button
            onClick={() => {
              playGameSound('mystery', 'reveal').catch(console.warn);
              onClose();
            }}
            className="w-full"
            size="lg"
          >
            🎉 Claim Prize!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 