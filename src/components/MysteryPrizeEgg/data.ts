export interface PrizeData {
  id: string;
  type: 'coupon' | 'points' | 'gift' | 'bonus';
  name: string;
  value: string;
  emoji: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const prizes: PrizeData[] = [
  // Common prizes (60% chance)
  { id: '1', type: 'points', name: '50 Points', value: '50', emoji: '⭐', color: 'bg-yellow-100 text-yellow-800', rarity: 'common' },
  { id: '2', type: 'points', name: '100 Points', value: '100', emoji: '⭐', color: 'bg-yellow-100 text-yellow-800', rarity: 'common' },
  { id: '3', type: 'coupon', name: '10% Off', value: '10%', emoji: '🎫', color: 'bg-blue-100 text-blue-800', rarity: 'common' },
  { id: '4', type: 'gift', name: 'Free Coffee', value: 'Coffee', emoji: '☕', color: 'bg-orange-100 text-orange-800', rarity: 'common' },
  { id: '5', type: 'gift', name: 'Free Snack', value: 'Snack', emoji: '🍪', color: 'bg-orange-100 text-orange-800', rarity: 'common' },
  
  // Rare prizes (25% chance)
  { id: '6', type: 'points', name: '250 Points', value: '250', emoji: '⭐', color: 'bg-yellow-100 text-yellow-800', rarity: 'rare' },
  { id: '7', type: 'coupon', name: '25% Off', value: '25%', emoji: '🎫', color: 'bg-blue-100 text-blue-800', rarity: 'rare' },
  { id: '8', type: 'gift', name: 'Free Lunch', value: 'Lunch', emoji: '🍕', color: 'bg-orange-100 text-orange-800', rarity: 'rare' },
  { id: '9', type: 'bonus', name: 'Double Points', value: '2x', emoji: '⚡', color: 'bg-purple-100 text-purple-800', rarity: 'rare' },
  
  // Epic prizes (12% chance)
  { id: '10', type: 'points', name: '500 Points', value: '500', emoji: '⭐', color: 'bg-yellow-100 text-yellow-800', rarity: 'epic' },
  { id: '11', type: 'coupon', name: '50% Off', value: '50%', emoji: '🎫', color: 'bg-blue-100 text-blue-800', rarity: 'epic' },
  { id: '12', type: 'gift', name: 'Free Dinner', value: 'Dinner', emoji: '🍽️', color: 'bg-orange-100 text-orange-800', rarity: 'epic' },
  { id: '13', type: 'bonus', name: 'Triple Points', value: '3x', emoji: '⚡', color: 'bg-purple-100 text-purple-800', rarity: 'epic' },
  
  // Legendary prizes (3% chance)
  { id: '14', type: 'points', name: '1000 Points', value: '1000', emoji: '⭐', color: 'bg-yellow-100 text-yellow-800', rarity: 'legendary' },
  { id: '15', type: 'coupon', name: '100% Off', value: '100%', emoji: '🎫', color: 'bg-blue-100 text-blue-800', rarity: 'legendary' },
  { id: '16', type: 'gift', name: 'Free Vacation', value: 'Vacation', emoji: '🏖️', color: 'bg-orange-100 text-orange-800', rarity: 'legendary' },
  { id: '17', type: 'bonus', name: 'Mega Bonus', value: '10x', emoji: '⚡', color: 'bg-purple-100 text-purple-800', rarity: 'legendary' },
];

export const getRandomPrize = (): PrizeData => {
  const random = Math.random();
  
  if (random < 0.03) {
    // 3% chance for legendary
    const legendary = prizes.filter(p => p.rarity === 'legendary');
    return legendary[Math.floor(Math.random() * legendary.length)];
  } else if (random < 0.15) {
    // 12% chance for epic
    const epic = prizes.filter(p => p.rarity === 'epic');
    return epic[Math.floor(Math.random() * epic.length)];
  } else if (random < 0.40) {
    // 25% chance for rare
    const rare = prizes.filter(p => p.rarity === 'rare');
    return rare[Math.floor(Math.random() * rare.length)];
  } else {
    // 60% chance for common
    const common = prizes.filter(p => p.rarity === 'common');
    return common[Math.floor(Math.random() * common.length)];
  }
};

export const eggEmojis = ['🥚', '🥚', '🥚', '🥚', '🥚', '🥚']; 