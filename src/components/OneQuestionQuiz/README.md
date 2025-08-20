# One-Question Quiz Component

A modern, animated, and mobile-friendly quiz component built with ShadCN UI components.

## Features

- **🎯 Single Question Format**: Display one question at a time with 2-4 answer options
- **🎨 Modern Design**: Built entirely with ShadCN components (Card, Button, Badge, Separator)
- **📱 Mobile-Friendly**: Responsive design that works on all screen sizes
- **✨ Smooth Animations**: Animated feedback, transitions, and micro-interactions
- **🎁 Offer Integration**: Built-in offer unlocking with discount codes
- **♿ Accessible**: Proper ARIA labels and keyboard navigation
- **🎨 Customizable**: Multiple variants and sizes available

## Components Used

- **Card**: Main container and content sections
- **Button**: Interactive elements and actions
- **Badge**: Status indicators and answer display
- **Separator**: Visual separation between sections

## Usage

```tsx
import { Quiz } from "@/components/OneQuestionQuiz";

const quizData = {
  question: "What is the capital of France?",
  options: ["London", "Berlin", "Paris", "Madrid"],
  correctAnswer: "Paris",
  correctFeedback: "Excellent! Paris is indeed the capital of France.",
  incorrectFeedback: "Not quite right. Paris is the capital of France.",
  offer: {
    title: "Special Discount!",
    description: "Get 20% off your next purchase",
    code: "PARIS20",
    validUntil: "2024-12-31"
  }
};

<Quiz
  quizData={quizData}
  title="Quick Quiz"
  buttonText="Submit Answer"
  variant="card"
  size="lg"
  onAnswerSelect={(answer, isCorrect) => console.log(answer, isCorrect)}
  onQuizComplete={(result) => console.log(result)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quizData` | `QuizData` | - | Quiz question and options data |
| `title` | `string` | "Quick Quiz" | Quiz title |
| `buttonText` | `string` | "Submit Answer" | Submit button text |
| `variant` | `"default" \| "card" \| "minimal"` | "default" | Visual variant |
| `size` | `"sm" \| "default" \| "lg" \| "xl"` | "default" | Component size |
| `showResult` | `boolean` | `true` | Whether to show result screen |
| `onAnswerSelect` | `function` | - | Callback when answer is selected |
| `onQuizComplete` | `function` | - | Callback when quiz is completed |

## Data Structure

```tsx
interface QuizData {
  question: string;
  options: string[];
  correctAnswer: string;
  correctFeedback: string;
  incorrectFeedback: string;
  offer?: {
    title: string;
    description: string;
    code?: string;
    validUntil?: string;
  };
}
```

## Design Principles

- **ShadCN First**: Uses only ShadCN components and Tailwind CSS
- **No External Styles**: No custom CSS or external style dependencies
- **Consistent Theming**: Follows the design system's color palette and spacing
- **Smooth Animations**: Uses Tailwind's built-in animation utilities
- **Accessibility**: Proper semantic HTML and ARIA attributes

## Animation Features

- **Pulse Animation**: Animated progress bar and offer badges
- **Zoom In**: Result screen entrance animations
- **Slide In**: Feedback modal animations
- **Hover Effects**: Interactive button and option hover states
- **Transition States**: Smooth state transitions throughout the quiz flow 