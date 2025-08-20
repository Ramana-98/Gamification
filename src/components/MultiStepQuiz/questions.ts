export interface Question {
  id: string;
  type: 'radio' | 'image' | 'dropdown' | 'range';
  question: string;
  description?: string;
  options?: string[];
  images?: {
    src: string;
    alt: string;
    value: string;
  }[];
  range?: {
    min: number;
    max: number;
    step: number;
    labels: {
      min: string;
      max: string;
    };
  };
  required: boolean;
}

export interface QuizStep {
  id: string;
  title: string;
  questions: Question[];
}

export const quizSteps: QuizStep[] = [
  {
    id: 'preferences',
    title: 'Your Preferences',
    questions: [
      {
        id: 'style',
        type: 'radio',
        question: 'What\'s your preferred style?',
        description: 'This helps us recommend products that match your taste.',
        options: ['Modern & Minimalist', 'Classic & Traditional', 'Bold & Creative', 'Casual & Comfortable'],
        required: true
      },
      {
        id: 'budget',
        type: 'dropdown',
        question: 'What\'s your budget range?',
        description: 'Select the price range you\'re comfortable with.',
        options: ['Under $50', '$50 - $100', '$100 - $200', '$200 - $500', 'Over $500'],
        required: true
      }
    ]
  },
  {
    id: 'lifestyle',
    title: 'Your Lifestyle',
    questions: [
      {
        id: 'activity',
        type: 'image',
        question: 'What type of activities do you enjoy most?',
        description: 'Choose the image that best represents your lifestyle.',
        images: [
          { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', alt: 'Outdoor Adventure', value: 'outdoor' },
          { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop', alt: 'Fitness & Health', value: 'fitness' },
          { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop', alt: 'Creative Arts', value: 'creative' },
          { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop', alt: 'Technology & Gaming', value: 'tech' }
        ],
        required: true
      },
      {
        id: 'frequency',
        type: 'range',
        question: 'How often do you use products like this?',
        description: 'Slide to indicate your usage frequency.',
        range: {
          min: 1,
          max: 7,
          step: 1,
          labels: {
            min: 'Rarely',
            max: 'Daily'
          }
        },
        required: true
      }
    ]
  },
  {
    id: 'needs',
    title: 'Your Specific Needs',
    questions: [
      {
        id: 'features',
        type: 'radio',
        question: 'What features are most important to you?',
        description: 'Select the feature that matters most for your use case.',
        options: ['Durability & Quality', 'Ease of Use', 'Advanced Features', 'Affordability', 'Aesthetic Design'],
        required: true
      },
      {
        id: 'environment',
        type: 'dropdown',
        question: 'Where will you primarily use this product?',
        description: 'This helps us recommend the right specifications.',
        options: ['Home', 'Office', 'Outdoors', 'Travel', 'Gym', 'Studio'],
        required: true
      }
    ]
  },
  {
    id: 'experience',
    title: 'Your Experience Level',
    questions: [
      {
        id: 'expertise',
        type: 'radio',
        question: 'What\'s your experience level with this type of product?',
        description: 'We\'ll adjust our recommendations based on your expertise.',
        options: ['Beginner - New to this', 'Intermediate - Some experience', 'Advanced - Experienced user', 'Expert - Professional use'],
        required: true
      }
    ]
  }
];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  features: string[];
  rating: number;
  matchScore: number;
  tags: string[];
}

export const dummyProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    category: 'audio',
    features: ['Noise Cancellation', '40hr Battery', 'Premium Sound', 'Wireless'],
    rating: 4.8,
    matchScore: 95,
    tags: ['modern', 'premium', 'wireless', 'audio']
  },
  {
    id: 'prod-2',
    name: 'Smart Fitness Tracker',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS tracking.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop',
    category: 'fitness',
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', '7-day Battery'],
    rating: 4.6,
    matchScore: 88,
    tags: ['fitness', 'health', 'tracking', 'sports']
  },
  {
    id: 'prod-3',
    name: 'Professional Camera Kit',
    description: 'Complete camera kit for professional photography with multiple lenses.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop',
    category: 'photography',
    features: ['4K Video', 'Interchangeable Lenses', 'Professional Quality', 'Advanced Controls'],
    rating: 4.9,
    matchScore: 92,
    tags: ['creative', 'professional', 'photography', 'advanced']
  },
  {
    id: 'prod-4',
    name: 'Gaming Laptop Pro',
    description: 'High-performance gaming laptop with RTX graphics and fast refresh rate.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop',
    category: 'gaming',
    features: ['RTX Graphics', '144Hz Display', 'RGB Keyboard', 'High Performance'],
    rating: 4.7,
    matchScore: 90,
    tags: ['tech', 'gaming', 'performance', 'advanced']
  },
  {
    id: 'prod-5',
    name: 'Eco-Friendly Water Bottle',
    description: 'Sustainable water bottle made from recycled materials with temperature control.',
    price: 39,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
    category: 'lifestyle',
    features: ['Temperature Control', 'Eco-Friendly', 'BPA Free', '24hr Cold'],
    rating: 4.5,
    matchScore: 85,
    tags: ['casual', 'eco-friendly', 'lifestyle', 'affordable']
  },
  {
    id: 'prod-6',
    name: 'Classic Leather Wallet',
    description: 'Handcrafted leather wallet with RFID protection and multiple card slots.',
    price: 79,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop',
    category: 'accessories',
    features: ['Genuine Leather', 'RFID Protection', 'Multiple Slots', 'Handcrafted'],
    rating: 4.4,
    matchScore: 82,
    tags: ['classic', 'traditional', 'accessories', 'quality']
  }
];

// Algorithm to match user answers with products
export function calculateProductMatches(answers: Record<string, any>): Product[] {
  const scoredProducts = dummyProducts.map(product => {
    let score = 0;
    
    // Style preference matching
    if (answers.style) {
      if (answers.style.includes('Modern') && product.tags.includes('modern')) score += 20;
      if (answers.style.includes('Classic') && product.tags.includes('classic')) score += 20;
      if (answers.style.includes('Bold') && product.tags.includes('creative')) score += 20;
      if (answers.style.includes('Casual') && product.tags.includes('casual')) score += 20;
    }
    
    // Budget matching
    if (answers.budget) {
      const budgetMap: Record<string, number> = {
        'Under $50': 50,
        '$50 - $100': 100,
        '$100 - $200': 200,
        '$200 - $500': 500,
        'Over $500': 1000
      };
      const userBudget = budgetMap[answers.budget];
      if (product.price <= userBudget) score += 15;
      if (product.price <= userBudget * 0.8) score += 10; // Bonus for well within budget
    }
    
    // Activity/lifestyle matching
    if (answers.activity) {
      if (answers.activity === 'fitness' && product.category === 'fitness') score += 25;
      if (answers.activity === 'creative' && product.category === 'photography') score += 25;
      if (answers.activity === 'tech' && product.category === 'gaming') score += 25;
      if (answers.activity === 'outdoor' && product.tags.includes('lifestyle')) score += 25;
    }
    
    // Usage frequency matching
    if (answers.frequency) {
      if (answers.frequency >= 5 && product.tags.includes('premium')) score += 10;
      if (answers.frequency <= 3 && product.tags.includes('affordable')) score += 10;
    }
    
    // Feature importance matching
    if (answers.features) {
      if (answers.features.includes('Durability') && product.tags.includes('quality')) score += 15;
      if (answers.features.includes('Advanced') && product.tags.includes('advanced')) score += 15;
      if (answers.features.includes('Affordability') && product.tags.includes('affordable')) score += 15;
      if (answers.features.includes('Aesthetic') && product.tags.includes('modern')) score += 15;
    }
    
    // Experience level matching
    if (answers.expertise) {
      if (answers.expertise.includes('Beginner') && !product.tags.includes('advanced')) score += 10;
      if (answers.expertise.includes('Expert') && product.tags.includes('professional')) score += 10;
    }
    
    return { ...product, matchScore: Math.min(100, score) };
  });
  
  // Sort by match score and return top 3
  return scoredProducts
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
} 