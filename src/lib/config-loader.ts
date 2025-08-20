// Configuration loader utility for gamification components
// This allows easy editing of prizes/segments through AEM component editor

export interface SpinWheelConfig {
  segments: Array<{
    text: string;
    color: string;
    value?: string;
  }>;
  defaults: {
    wheelSize: number;
    animationDuration: number;
    minRevolutions: number;
    maxRevolutions: number;
    title: string;
    buttonText: string;
    spinningText: string;
  };
}

export interface PickAGiftConfig {
  prizes: Array<{
    text: string;
    value?: string;
    color?: string;
    icon?: string;
    probability?: number;
  }>;
  defaults: {
    title: string;
    subtitle: string;
    autoOpen: boolean;
    showCloseButton: boolean;
    animationDuration: number;
    variant: string;
    size: string;
  };
}

export interface ScratchCardConfig {
  prizes: Array<{
    text: string;
    value?: string;
    color?: string;
    icon?: string;
  }>;
  defaults: {
    cardWidth: number;
    cardHeight: number;
    scratchColor: string;
    scratchPattern: string;
    revealThreshold: number;
    title: string;
    resetButtonText: string;
    instructions: string;
    variant: string;
    size: string;
  };
}

export interface PlinkoConfig {
  prizes: Array<{
    text: string;
    value?: string;
    color?: string;
    icon?: string;
    multiplier?: number;
  }>;
  defaults: {
    boardWidth: number;
    boardHeight: number;
    pinRows: number;
    ballSize: number;
    pinSize: number;
    animationDuration: number;
    title: string;
    buttonText: string;
    droppingText: string;
    instructions: string;
    variant: string;
    size: string;
  };
}

// Default configurations (fallback if JSON files are not available)
export const defaultSpinWheelConfig: SpinWheelConfig = {
  segments: [
    { text: "10% Off", color: "#FFC300", value: "DISCOUNT10" },
    { text: "Free Shipping", color: "#FF5733", value: "FREESHIP" },
    { text: "Buy One Get One", color: "#C70039", value: "BOGO" },
    { text: "20% Off", color: "#900C3F", value: "DISCOUNT20" },
    { text: "No Luck", color: "#581845", value: "NOLUCK" },
    { text: "Gift Card", color: "#2E86C1", value: "GIFTCARD" },
  ],
  defaults: {
    wheelSize: 400,
    animationDuration: 4000,
    minRevolutions: 5,
    maxRevolutions: 8,
    title: "Spin the Wheel!",
    buttonText: "SPIN",
    spinningText: "Spinning...",
  },
};

export const defaultPickAGiftConfig: PickAGiftConfig = {
  prizes: [
    { text: "30% OFF", value: "Use code: GIFT30", color: "#e74c3c", icon: "🎯", probability: 0.15 },
    { text: "Free Shipping", value: "On orders over $25", color: "#3498db", icon: "🚚", probability: 0.20 },
    { text: "$15 Gift Card", value: "Valid for 60 days", color: "#27ae60", icon: "💳", probability: 0.10 },
    { text: "Buy 1 Get 1 Free", value: "Select items only", color: "#f39c12", icon: "🎁", probability: 0.08 },
    { text: "Try Again!", value: "Better luck next time", color: "#95a5a6", icon: "🔄", probability: 0.25 },
    { text: "20% OFF", value: "Use code: PICK20", color: "#9b59b6", icon: "🍀", probability: 0.12 },
    { text: "Free Sample", value: "Choose any product", color: "#8e44ad", icon: "🎪", probability: 0.05 },
    { text: "VIP Access", value: "Exclusive member benefits", color: "#d35400", icon: "👑", probability: 0.05 },
  ],
  defaults: {
    title: "Choose a Gift!",
    subtitle: "Pick one of the gift boxes to reveal your prize",
    autoOpen: false,
    showCloseButton: true,
    animationDuration: 1000,
    variant: "default",
    size: "default",
  },
};

export const defaultScratchCardConfig: ScratchCardConfig = {
  prizes: [
    { text: "50% OFF", value: "Use code: SCRATCH50", color: "#e74c3c", icon: "🎯" },
    { text: "Free Shipping", value: "On orders over $30", color: "#3498db", icon: "🚚" },
    { text: "$25 Gift Card", value: "Valid for 90 days", color: "#27ae60", icon: "💳" },
    { text: "Buy 2 Get 1 Free", value: "Select items only", color: "#f39c12", icon: "🎁" },
    { text: "Try Again!", value: "Better luck next time", color: "#95a5a6", icon: "🔄" },
    { text: "30% OFF", value: "Use code: SCRATCH30", color: "#9b59b6", icon: "🍀" },
    { text: "Free Sample", value: "Choose any product", color: "#8e44ad", icon: "🎪" },
    { text: "VIP Access", value: "Exclusive member benefits", color: "#d35400", icon: "👑" },
  ],
  defaults: {
    cardWidth: 400,
    cardHeight: 250,
    scratchColor: "#c0c0c0",
    scratchPattern: "Scratch to reveal your prize! 🎁",
    revealThreshold: 60,
    title: "Scratch Card Game",
    resetButtonText: "Play Again",
    instructions: "Use your mouse or finger to scratch the surface!",
    variant: "default",
    size: "default",
  },
};

export const defaultPlinkoConfig: PlinkoConfig = {
  prizes: [
    { text: "0x", value: "Try Again!", color: "#7f8c8d", icon: "🔄", multiplier: 0 },
    { text: "0.2x", value: "Small Loss", color: "#34495e", icon: "📉", multiplier: 0.2 },
    { text: "0.5x", value: "Minor Loss", color: "#5d6d7e", icon: "📊", multiplier: 0.5 },
    { text: "0.7x", value: "Break Even", color: "#95a5a6", icon: "⚖️", multiplier: 0.7 },
    { text: "1x", value: "Even", color: "#85c1e9", icon: "🎯", multiplier: 1 },
    { text: "1.1x", value: "Small Win", color: "#82e0aa", icon: "🍀", multiplier: 1.1 },
    { text: "1.2x", value: "Minor Win", color: "#f7dc6f", icon: "⭐", multiplier: 1.2 },
    { text: "1.3x", value: "Good Win", color: "#f8c471", icon: "💎", multiplier: 1.3 },
    { text: "1.6x", value: "Great Win", color: "#e67e22", icon: "🔥", multiplier: 1.6 },
    { text: "2.1x", value: "Big Win", color: "#e74c3c", icon: "🎰", multiplier: 2.1 },
    { text: "3.2x", value: "Huge Win", color: "#8e44ad", icon: "👑", multiplier: 3.2 },
    { text: "5.3x", value: "Mega Win", color: "#2ecc71", icon: "🚀", multiplier: 5.3 },
    { text: "14x", value: "Epic Win", color: "#f39c12", icon: "💫", multiplier: 14 },
    { text: "49x", value: "Legendary Win", color: "#e67e22", icon: "🌟", multiplier: 49 },
    { text: "353x", value: "Mythical Win", color: "#e74c3c", icon: "🏆", multiplier: 353 },
  ],
  defaults: {
    boardWidth: 600,
    boardHeight: 800,
    pinRows: 12,
    ballSize: 8,
    pinSize: 6,
    animationDuration: 3000,
    title: "Plinko Game",
    buttonText: "DROP BALL",
    droppingText: "Dropping...",
    instructions: "Drop the ball and watch it bounce through the pins to win prizes!",
    variant: "default",
    size: "default",
  },
};

// Configuration loader function
export async function loadConfig<T>(configPath: string, defaultConfig: T): Promise<T> {
  try {
    const response = await fetch(configPath);
    if (response.ok) {
      const config = await response.json();
      return { ...defaultConfig, ...config };
    }
  } catch (error) {
    console.warn(`Failed to load config from ${configPath}, using defaults:`, error);
  }
  return defaultConfig;
}

// Synchronous configuration getter (for immediate use)
export function getConfig<T>(configPath: string, defaultConfig: T): T {
  // For immediate use, return default config
  // In AEM, this would be replaced with actual config loading
  return defaultConfig;
} 