export interface CardData {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const cardEmojis = [
  { emoji: "🐶", name: "Dog" },
  { emoji: "🐱", name: "Cat" },
  { emoji: "🐰", name: "Rabbit" },
  { emoji: "🐼", name: "Panda" },
  { emoji: "🐨", name: "Koala" },
  { emoji: "🐯", name: "Tiger" },
  { emoji: "🦁", name: "Lion" },
  { emoji: "🐸", name: "Frog" },
];

export const createShuffledCards = (): CardData[] => {
  // Create pairs of cards
  const cards: CardData[] = [];
  let id = 1;
  
  cardEmojis.forEach(({ emoji, name }) => {
    // Add two cards for each emoji (pair)
    cards.push(
      { id: id++, emoji, name, isFlipped: false, isMatched: false },
      { id: id++, emoji, name, isFlipped: false, isMatched: false }
    );
  });
  
  // Shuffle the cards
  return cards.sort(() => Math.random() - 0.5);
}; 