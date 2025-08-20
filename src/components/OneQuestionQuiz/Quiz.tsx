import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const quizVariants = cva(
  "relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto",
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

interface QuizResult {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  feedback: string;
  offer?: {
    title: string;
    description: string;
    code?: string;
    validUntil?: string;
  };
}

interface QuizProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof quizVariants> {
  quizData: QuizData;
  title?: string;
  buttonText?: string;
  showResult?: boolean;
  onAnswerSelect?: (answer: string, isCorrect: boolean) => void;
  onQuizComplete?: (result: QuizResult) => void;
}

// Helper functions to reduce cognitive complexity
const getResultIcon = (isCorrect: boolean) => isCorrect ? "🎉" : "😔";
const getResultTitle = (isCorrect: boolean) => isCorrect ? "Congratulations!" : "Good Try!";
const getResultVariant = (isCorrect: boolean) => isCorrect ? "success" : "destructive" as const;
const getAnswerColor = (isCorrect: boolean) => isCorrect ? "text-green-600" : "text-red-600";

const Quiz = React.forwardRef<HTMLDivElement, QuizProps>(
  (
    {
      className,
      size,
      variant,
      quizData,
      title = "Quick Quiz",
      buttonText = "Submit Answer",
      showResult = true,
      onAnswerSelect,
      onQuizComplete,
      ...props
    },
    ref
  ) => {
    const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
    const [isAnswered, setIsAnswered] = React.useState(false);
    const [isCorrect, setIsCorrect] = React.useState(false);
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [showFinalResult, setShowFinalResult] = React.useState(false);

    const handleAnswerSelect = (answer: string) => {
      if (isAnswered) return;
      setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
      if (!selectedAnswer || isAnswered) return;

      const correct = selectedAnswer === quizData.correctAnswer;
      setIsCorrect(correct);
      setIsAnswered(true);
      setShowFeedback(true);

      onAnswerSelect?.(selectedAnswer, correct);

      // Hide feedback after 2 seconds and show final result
      setTimeout(() => {
        setShowFeedback(false);
        if (showResult) {
          setShowFinalResult(true);
        }

        const result: QuizResult = {
          question: quizData.question,
          selectedAnswer,
          correctAnswer: quizData.correctAnswer,
          isCorrect: correct,
          feedback: correct ? quizData.correctFeedback : quizData.incorrectFeedback,
          offer: quizData.offer,
        };

        onQuizComplete?.(result);
      }, 2000);
    };

    const handleRetry = () => {
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowFeedback(false);
      setShowFinalResult(false);
    };

    const getOptionClassName = (option: string) => {
      if (!isAnswered) {
        return selectedAnswer === option
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background hover:bg-muted/50 border-muted-foreground/25";
      }

      if (option === quizData.correctAnswer) {
        return "bg-green-500 text-white border-green-600";
      }

      if (option === selectedAnswer && !isCorrect) {
        return "bg-red-500 text-white border-red-600";
      }

      return "bg-muted/30 text-muted-foreground border-muted-foreground/25";
    };

    const getRadioClassName = (option: string) => {
      if (!isAnswered) {
        return selectedAnswer === option
          ? "border-primary bg-primary"
          : "border-muted-foreground/25";
      }

      if (option === quizData.correctAnswer) {
        return "border-green-600 bg-green-500";
      }

      if (option === selectedAnswer && !isCorrect) {
        return "border-red-600 bg-red-500";
      }

      return "border-muted-foreground/25";
    };

    return (
      <div
        ref={ref}
        className={cn(quizVariants({ size, variant }), className)}
        {...props}
      >
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-lg">
              {quizData.question}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {quizData.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                    getOptionClassName(option)
                  )}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      getRadioClassName(option)
                    )}
                  >
                    {selectedAnswer === option && (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer || isAnswered}
              size="lg"
              className="w-full max-w-xs"
            >
              {buttonText}
            </Button>
          </CardFooter>
        </Card>

        {/* ShadCN Dialog for Feedback */}
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span className="text-2xl">{getResultIcon(isCorrect)}</span>
                <span>{getResultTitle(isCorrect)}</span>
              </DialogTitle>
              <DialogDescription className="text-base">
                {isCorrect ? quizData.correctFeedback : quizData.incorrectFeedback}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* ShadCN Dialog for Final Result */}
        <Dialog open={showFinalResult} onOpenChange={setShowFinalResult}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span className="text-2xl">{getResultIcon(isCorrect)}</span>
                <span>{getResultTitle(isCorrect)}</span>
              </DialogTitle>
              <DialogDescription>
                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Quiz Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className={getAnswerColor(isCorrect)}>
                        Your answer: {selectedAnswer}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-green-600">
                        Correct answer: {quizData.correctAnswer}
                      </span>
                    </p>
                  </div>

                  {quizData.offer && (
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold mb-2">{quizData.offer.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {quizData.offer.description}
                      </p>
                      
                      {quizData.offer.code && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="font-mono">
                            {quizData.offer.code}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(quizData.offer!.code!)}
                          >
                            📋
                          </Button>
                        </div>
                      )}
                      
                      {quizData.offer.validUntil && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Valid until: {new Date(quizData.offer.validUntil).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex space-x-3">
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button
                onClick={() => setShowFinalResult(false)}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

Quiz.displayName = "Quiz";

export { Quiz, quizVariants, type QuizProps, type QuizData, type QuizResult }; 