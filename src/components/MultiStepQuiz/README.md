# Multi-Step Quiz Component (ShadCN UI)

A comprehensive guided survey component built entirely with ShadCN UI components that recommends products based on user inputs.

## Features

- **📋 Multi-Step Flow**: Guided survey with step-by-step navigation
- **🎯 Smart Recommendations**: Personalized product suggestions based on answers
- **🎨 Full ShadCN UI**: Built entirely with ShadCN components
- **📱 Mobile-Friendly**: Responsive design for all screen sizes
- **✨ Smooth Animations**: Progress indicators and transitions
- **🔄 Multiple Question Types**: Radio buttons, image options, dropdowns, range sliders

## ShadCN Components Used

### Core Components
- **Card**: Main container and content sections
- **Button**: Interactive elements and navigation
- **Badge**: Status indicators and feature tags
- **Separator**: Visual separation between sections
- **Progress**: Progress bars and match score indicators

### Form Components
- **Form**: Structured form layout and validation
- **FormField**: Individual form field containers
- **FormLabel**: Question labels and descriptions
- **FormDescription**: Helpful text and instructions

### Input Components
- **RadioGroup**: Radio button selection with visual feedback
- **RadioGroupItem**: Individual radio button options
- **Select**: Dropdown selection with custom styling
- **SelectOption**: Dropdown option items
- **Slider**: Range input with min/max labels

## Question Types

### Radio Buttons (RadioGroup)
Single choice from multiple text options with visual feedback and hover states.

### Image Options
Visual selection with image thumbnails, hover effects, and selection indicators.

### Dropdowns (Select)
Traditional select dropdown with custom styling and placeholder text.

### Range Sliders (Slider)
Numeric input with min/max labels and real-time value display.

## Component Structure

```
components/MultiStepQuiz/
├── Quiz.tsx          # Main quiz component with ShadCN form handling
├── Result.tsx        # Product recommendations with ShadCN cards
├── questions.ts      # Question definitions and product matching logic
└── index.ts          # Clean exports
```

## Usage

```tsx
import { Quiz } from "@/components/MultiStepQuiz";

<Quiz
  variant="card"
  size="lg"
  onComplete={(products) => console.log('Recommended products:', products)}
  onStepChange={(stepIndex) => console.log('Step changed to:', stepIndex)}
/>
```

## Quiz Flow

1. **Step 1: Preferences** - Style and budget preferences
2. **Step 2: Lifestyle** - Activity type and usage frequency
3. **Step 3: Needs** - Feature importance and usage environment
4. **Step 4: Experience** - User expertise level
5. **Results** - Personalized product recommendations

## ShadCN Implementation Details

### Form Structure
```tsx
<Form>
  <FormField>
    <FormLabel>Question Text</FormLabel>
    <FormDescription>Helpful description</FormDescription>
    <QuestionInput />
  </FormField>
</Form>
```

### Progress Tracking
```tsx
<Progress value={progress} className="h-3" />
```

### Radio Button Groups
```tsx
<RadioGroup value={value} onValueChange={onChange}>
  <RadioGroupItem value="option1">Option 1</RadioGroupItem>
  <RadioGroupItem value="option2">Option 2</RadioGroupItem>
</RadioGroup>
```

### Dropdown Selection
```tsx
<Select value={value} onChange={handleChange} placeholder="Select...">
  <SelectOption value="option1">Option 1</SelectOption>
  <SelectOption value="option2">Option 2</SelectOption>
</Select>
```

### Range Slider
```tsx
<Slider
  min={1}
  max={7}
  value={value}
  onChange={handleChange}
  minLabel="Rarely"
  maxLabel="Daily"
/>
```

## Product Matching Algorithm

The component uses a sophisticated scoring system to match user answers with products:

- **Style Matching**: 20 points for style preference alignment
- **Budget Matching**: 15 points for price range compatibility
- **Lifestyle Matching**: 25 points for activity/category alignment
- **Usage Frequency**: 10 points for usage pattern matching
- **Feature Importance**: 15 points for feature priority alignment
- **Experience Level**: 10 points for expertise compatibility

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "card" \| "minimal"` | "default" | Visual variant |
| `size` | `"sm" \| "default" \| "lg" \| "xl"` | "default" | Component size |
| `onComplete` | `function` | - | Callback when quiz is completed |
| `onStepChange` | `function` | - | Callback when step changes |

## Data Structure

### Question Interface
```tsx
interface Question {
  id: string;
  type: 'radio' | 'image' | 'dropdown' | 'range';
  question: string;
  description?: string;
  options?: string[];
  images?: { src: string; alt: string; value: string; }[];
  range?: { min: number; max: number; step: number; labels: { min: string; max: string; } };
  required: boolean;
}
```

### Product Interface
```tsx
interface Product {
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
```

## Design Features

- **Progress Indicator**: ShadCN Progress component with step counter
- **Step Navigation**: Back/Next buttons with validation
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Smooth Transitions**: Animated progress and state changes
- **Visual Feedback**: Hover effects and selection indicators

## Result Display

The results screen includes:
- **Product Cards**: ShadCN Card components with images and details
- **Match Indicators**: Color-coded Badge components showing match quality
- **Progress Bars**: ShadCN Progress components for match scores
- **Feature Tags**: Key product features displayed as Badge components
- **Summary Statistics**: Quiz completion metrics in Card layout
- **Action Buttons**: Retry quiz or start new survey

## Customization

### Adding New Questions
Edit `questions.ts` to add new question types or modify existing ones.

### Product Database
Update `dummyProducts` array with your product catalog.

### Matching Algorithm
Modify `calculateProductMatches` function to adjust scoring logic.

### Styling
All styling uses Tailwind CSS classes and ShadCN design tokens. Customize through the `variant` and `size` props.

## Benefits of ShadCN Implementation

- **Consistent Design**: All components follow the same design system
- **Accessibility**: Built-in accessibility features
- **Type Safety**: Full TypeScript support
- **Maintainability**: Standardized component patterns
- **Performance**: Optimized component rendering
- **Customization**: Easy theming and styling 