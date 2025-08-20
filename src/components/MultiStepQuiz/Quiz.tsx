import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Form, FormField, FormLabel, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectOption } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Result } from "./Result";
import { quizSteps, calculateProductMatches, type Question, type QuizStep } from "./questions";

const quizVariants = cva(
  "relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto",
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

interface QuizProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof quizVariants> {
  onComplete?: (products: any[]) => void;
  onStepChange?: (stepIndex: number) => void;
}

const Quiz = React.forwardRef<HTMLDivElement, QuizProps>(
  (
    {
      className,
      size,
      variant,
      onComplete,
      onStepChange,
      ...props
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [answers, setAnswers] = React.useState<Record<string, any>>({});
    const [showResults, setShowResults] = React.useState(false);
    const [recommendedProducts, setRecommendedProducts] = React.useState<any[]>([]);

    const currentStepData = quizSteps[currentStep];
    const totalSteps = quizSteps.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const handleAnswerChange = (questionId: string, value: any) => {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    };

    const handleNext = () => {
      if (currentStep < totalSteps - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        onStepChange?.(nextStep);
      } else {
        // Calculate recommendations
        const products = calculateProductMatches(answers);
        setRecommendedProducts(products);
        setShowResults(true);
        onComplete?.(products);
      }
    };

    const handleBack = () => {
      if (currentStep > 0) {
        const prevStep = currentStep - 1;
        setCurrentStep(prevStep);
        onStepChange?.(prevStep);
      }
    };

    const handleRetry = () => {
      setCurrentStep(0);
      setAnswers({});
      setShowResults(false);
      setRecommendedProducts([]);
    };

    const handleNewQuiz = () => {
      setCurrentStep(0);
      setAnswers({});
      setShowResults(false);
      setRecommendedProducts([]);
      // You could also reload the page or reset to initial state
      window.location.reload();
    };

    const canProceed = () => {
      return currentStepData.questions.every(question =>
        answers[question.id] !== undefined && answers[question.id] !== null && answers[question.id] !== ''
      );
    };

    if (showResults) {
      return (
        <Result
          products={recommendedProducts}
          onRetry={handleRetry}
          onNewQuiz={handleNewQuiz}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(quizVariants({ size, variant }), className)}
        {...props}
      >
        <Card className="w-full">
          {/* Progress Header */}
          <CardHeader className="text-center pb-6">
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Step {currentStep + 1} of {totalSteps}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Step Title */}
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {currentStepData.title}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Let's learn more about your preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Form>
              {/* Questions */}
              {currentStepData.questions.map((question, questionIndex) => (
                <FormField key={question.id} className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground">
                      {question.question}
                    </FormLabel>
                    {question.description && (
                      <FormDescription className="text-base">
                        {question.description}
                      </FormDescription>
                    )}
                  </div>

                  {/* Question Input */}
                  <QuestionInput
                    question={question}
                    value={answers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />

                  {questionIndex < currentStepData.questions.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </FormField>
              ))}
            </Form>
          </CardContent>

          {/* Navigation Footer */}
          <CardFooter className="flex justify-between pt-6">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 0}
              className="min-w-[100px]"
            >
              Back
            </Button>

            <div className="flex items-center space-x-2">
              {/* Step Indicators */}
              <div className="hidden sm:flex space-x-1">
                {quizSteps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentStep ? "bg-primary" :
                        index < currentStep ? "bg-green-500" :
                          "bg-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="min-w-[100px]"
            >
              {currentStep === totalSteps - 1 ? "Get Results" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
);

// Question Input Component
interface QuestionInputProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, value, onChange }) => {
  switch (question.type) {
    case 'radio':
      return (
        <RadioGroup value={value} onValueChange={onChange}>
          {question.options?.map((option, index) => (
            <RadioGroupItem key={`option-${option}-${index}`} value={option}>
              {option}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      );

    case 'image':
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {question.images?.map((image, index) => (
            <label
              key={`image-${image.value}-${index}`}
              className={cn(
                "relative cursor-pointer group transition-all duration-200",
                value === image.value ? "ring-2 ring-primary ring-offset-2" : ""
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={image.value}
                checked={value === image.value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              <div className="aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-primary/50">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className={cn(
                  "absolute inset-0 bg-black/20 transition-opacity duration-200",
                  value === image.value ? "bg-primary/20" : "group-hover:bg-black/10"
                )} />
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <Badge
                  variant={value === image.value ? "default" : "secondary"}
                  className="w-full justify-center text-xs"
                >
                  {image.alt}
                </Badge>
              </div>
            </label>
          ))}
        </div>
      );

    case 'dropdown':
      return (
        <Select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Select an option..."
        >
          {question.options?.map((option, index) => (
            <SelectOption key={`dropdown-${option}-${index}`} value={option}>
              {option}
            </SelectOption>
          ))}
        </Select>
      );

    case 'range':
      return (
        <Slider
          min={question.range?.min}
          max={question.range?.max}
          step={question.range?.step}
          value={value || question.range?.min}
          onChange={(e) => onChange(parseInt(e.target.value))}
          minLabel={question.range?.labels.min}
          maxLabel={question.range?.labels.max}
        />
      );

    default:
      return null;
  }
};

Quiz.displayName = "MultiStepQuiz";

export { Quiz, quizVariants, type QuizProps }; 