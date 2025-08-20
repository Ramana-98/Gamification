import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import type { Product } from "./questions";

interface ResultProps {
  products: Product[];
  onRetry: () => void;
  onNewQuiz: () => void;
}

const Result: React.FC<ResultProps> = ({ products, onRetry, onNewQuiz }) => {
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-500 text-white";
    if (score >= 80) return "bg-blue-500 text-white";
    if (score >= 70) return "bg-yellow-500 text-white";
    return "bg-gray-500 text-white";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return "Perfect Match";
    if (score >= 80) return "Great Match";
    if (score >= 70) return "Good Match";
    return "Fair Match";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="text-center">
        <CardHeader>
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-2xl mb-3 animate-in zoom-in-95">
              🎯
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Personalized Recommendations
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Based on your preferences, here are the products we think you'll love
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card
            key={product.id}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${selectedProduct === product.id ? 'ring-2 ring-primary' : ''
              }`}
            onClick={() => setSelectedProduct(product.id)}
          >
            {/* Match Badge */}
            <div className="absolute top-4 right-4 z-10">
              <Badge className={getMatchColor(product.matchScore)}>
                {getMatchLabel(product.matchScore)}
              </Badge>
            </div>

            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2 mt-1">
                    {product.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  ${product.price}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              </div>

              {/* Match Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Match Score</span>
                  <span className="font-medium">{product.matchScore}%</span>
                </div>
                <Progress
                  value={product.matchScore}
                  className={`h-2 ${product.matchScore >= 90 ? 'bg-green-500' :
                      product.matchScore >= 80 ? 'bg-blue-500' :
                        product.matchScore >= 70 ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Key Features</h4>
                <div className="flex flex-wrap gap-1">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {product.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button
                className="w-full"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle product selection
                  console.log('Selected product:', product);
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Quiz Summary</CardTitle>
          <CardDescription>
            Here's what we learned about your preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="font-semibold text-primary">Top Match</div>
              <div className="text-muted-foreground">{products[0]?.matchScore}%</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="font-semibold text-primary">Price Range</div>
              <div className="text-muted-foreground">
                ${Math.min(...products.map(p => p.price))} - ${Math.max(...products.map(p => p.price))}
              </div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="font-semibold text-primary">Categories</div>
              <div className="text-muted-foreground">
                {[...new Set(products.map(p => p.category))].length}
              </div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="font-semibold text-primary">Avg Rating</div>
              <div className="text-muted-foreground">
                {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onRetry}
          variant="outline"
          size="lg"
          className="flex-1 sm:flex-none"
        >
          Retake Quiz
        </Button>
        <Button
          onClick={onNewQuiz}
          size="lg"
          className="flex-1 sm:flex-none"
        >
          Start New Quiz
        </Button>
      </div>
    </div>
  );
};

export { Result }; 