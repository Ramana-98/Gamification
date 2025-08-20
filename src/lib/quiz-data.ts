import type { QuizData } from "@/components/ui/quiz";

// Sample quiz data for different categories
export const fitnessQuizData: QuizData = {
  question: "What's your favorite way to stay active?",
  options: [
    "Running or jogging",
    "Gym workouts",
    "Team sports",
    "Yoga or pilates"
  ],
  correctAnswer: "Running or jogging",
  correctFeedback: "Great choice! Running is an excellent way to stay fit and healthy.",
  incorrectFeedback: "That's a good option too! All forms of exercise are beneficial.",
  offer: {
    title: "🏃‍♂️ Running Gear Discount",
    description: "Get 20% off on premium running shoes and accessories",
    code: "RUNNER20",
    validUntil: "2024-12-31"
  }
};

export const marketingQuizData: QuizData = {
  question: "Which social media platform do you use most?",
  options: [
    "Instagram",
    "TikTok", 
    "Facebook",
    "Twitter/X"
  ],
  correctAnswer: "Instagram",
  correctFeedback: "Instagram is perfect for visual content and engagement!",
  incorrectFeedback: "All platforms have their unique benefits for different audiences.",
  offer: {
    title: "📱 Social Media Boost",
    description: "Free consultation on optimizing your social media strategy",
    code: "SOCIALFREE",
    validUntil: "2024-12-31"
  }
};

export const techQuizData: QuizData = {
  question: "What's your preferred programming language?",
  options: [
    "JavaScript/TypeScript",
    "Python",
    "Java",
    "C++"
  ],
  correctAnswer: "JavaScript/TypeScript",
  correctFeedback: "Excellent choice! JavaScript is versatile and in high demand.",
  incorrectFeedback: "All programming languages have their strengths and use cases.",
  offer: {
    title: "💻 Tech Course Bundle",
    description: "50% off on premium programming courses",
    code: "TECH50",
    validUntil: "2024-12-31"
  }
};

export const lifestyleQuizData: QuizData = {
  question: "What's your ideal weekend activity?",
  options: [
    "Outdoor adventure",
    "Relaxing at home",
    "Social gatherings",
    "Cultural activities"
  ],
  correctAnswer: "Outdoor adventure",
  correctFeedback: "Adventure awaits! Outdoor activities are great for health and fun.",
  incorrectFeedback: "Everyone has their own perfect way to spend weekends!",
  offer: {
    title: "🌲 Adventure Package",
    description: "Special discount on outdoor gear and adventure tours",
    code: "ADVENTURE25",
    validUntil: "2024-12-31"
  }
};

export const gamingQuizData: QuizData = {
  question: "What's your favorite gaming genre?",
  options: [
    "Action/Adventure",
    "Strategy",
    "RPG",
    "Sports/Racing"
  ],
  correctAnswer: "Action/Adventure",
  correctFeedback: "Action games are exciting and immersive!",
  incorrectFeedback: "All gaming genres offer unique experiences and fun!",
  offer: {
    title: "🎮 Gaming Bundle",
    description: "Get 30% off on popular action-adventure games",
    code: "GAMING30",
    validUntil: "2024-12-31"
  }
};

// Array of all quiz data for random selection
export const allQuizData: QuizData[] = [
  fitnessQuizData,
  marketingQuizData,
  techQuizData,
  lifestyleQuizData,
  gamingQuizData
];

// Function to get a random quiz
export const getRandomQuiz = (): QuizData => {
  const randomIndex = Math.floor(Math.random() * allQuizData.length);
  return allQuizData[randomIndex];
}; 