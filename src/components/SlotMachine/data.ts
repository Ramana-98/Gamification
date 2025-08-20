export interface SlotSymbol {
  id: string;
  symbol: string;
  name: string;
  value: number;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GameStats {
  totalSpins: number;
  totalWins: number;
  totalWinnings: number;
  lastWin: number;
}

export const slotSymbols: SlotSymbol[] = [
  {
    id: 'cherry',
    symbol: '🍒',
    name: 'Cherry',
    value: 10,
    color: 'text-red-500',
    rarity: 'common'
  },
  {
    id: 'bell',
    symbol: '🔔',
    name: 'Bell',
    value: 25,
    color: 'text-yellow-500',
    rarity: 'common'
  },
  {
    id: 'clover',
    symbol: '🍀',
    name: 'Clover',
    value: 50,
    color: 'text-green-500',
    rarity: 'rare'
  },
  {
    id: 'diamond',
    symbol: '💎',
    name: 'Diamond',
    value: 100,
    color: 'text-blue-500',
    rarity: 'epic'
  },
  {
    id: 'seven',
    symbol: '7️⃣',
    name: 'Seven',
    value: 500,
    color: 'text-purple-500',
    rarity: 'legendary'
  }
];

export const createReelStrip = (): SlotSymbol[] => {
  // Create a weighted reel strip with more common symbols appearing more frequently
  const strip: SlotSymbol[] = [];
  
  // Add symbols based on rarity weights
  slotSymbols.forEach(symbol => {
    let count = 0;
    switch (symbol.rarity) {
      case 'common':
        count = 12; // More symbols for longer strips
        break;
      case 'rare':
        count = 6; // More clovers
        break;
      case 'epic':
        count = 3; // More diamonds
        break;
      case 'legendary':
        count = 2; // More sevens
        break;
    }
    
    for (let i = 0; i < count; i++) {
      strip.push(symbol);
    }
  });
  
  // Shuffle the strip
  return strip.sort(() => Math.random() - 0.5);
};

export const checkWin = (reels: SlotSymbol[][]): { isWin: boolean; winAmount: number; winningLine: number[] } => {
  // Only check center row (row 1) for wins - classic slot machine style
  const centerSymbols = [reels[0][1], reels[1][1], reels[2][1]];
  
  // Check if all center symbols are the same
  if (centerSymbols[0] && centerSymbols[1] && centerSymbols[2] && 
      centerSymbols[0].id === centerSymbols[1].id && centerSymbols[1].id === centerSymbols[2].id) {
    return {
      isWin: true,
      winAmount: centerSymbols[0].value,
      winningLine: [1, 1, 1] // Center row
    };
  }
  
  return {
    isWin: false,
    winAmount: 0,
    winningLine: []
  };
};

export const spinReels = (): SlotSymbol[][] => {
  const reels: SlotSymbol[][] = [];
  
  // Create 3 reels
  for (let reel = 0; reel < 3; reel++) {
    const strip = createReelStrip();
    const reelSymbols: SlotSymbol[] = [];
    
    // Pick 3 random symbols for this reel
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * strip.length);
      reelSymbols.push(strip[randomIndex]);
    }
    
    reels.push(reelSymbols);
  }
  
  return reels;
}; 