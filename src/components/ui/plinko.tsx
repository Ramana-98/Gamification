import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { defaultPlinkoConfig } from "@/lib/config-loader";

const plinkoVariants = cva(
  "relative flex flex-col items-center justify-center",
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

interface PlinkoPrize {
  text: string;
  value?: string;
  color?: string;
  icon?: string;
  multiplier?: number;
}

interface PlinkoProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof plinkoVariants> {
  prizes: PlinkoPrize[];
  boardWidth?: number;
  boardHeight?: number;
  pinRows?: number;
  ballSize?: number;
  pinSize?: number;
  animationDuration?: number;
  title?: string;
  buttonText?: string;
  droppingText?: string;
  disabled?: boolean;
  onDropStart?: () => void;
  onDropEnd?: (result: PlinkoPrize) => void;
}

interface Pin {
  x: number;
  y: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const Plinko = React.forwardRef<HTMLDivElement, PlinkoProps>(
  (
    {
      className,
      size,
      variant,
      prizes = defaultPlinkoConfig.prizes,
      boardWidth = defaultPlinkoConfig.defaults.boardWidth,
      boardHeight = defaultPlinkoConfig.defaults.boardHeight,
      pinRows = defaultPlinkoConfig.defaults.pinRows,
      ballSize = defaultPlinkoConfig.defaults.ballSize,
      pinSize = defaultPlinkoConfig.defaults.pinSize,
      animationDuration = defaultPlinkoConfig.defaults.animationDuration,
      title = defaultPlinkoConfig.defaults.title,
      buttonText = defaultPlinkoConfig.defaults.buttonText,
      droppingText = defaultPlinkoConfig.defaults.droppingText,
      disabled = false,
      onDropStart,
      onDropEnd,
      ...props
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [dropping, setDropping] = React.useState(false);
    const [dropResult, setDropResult] = React.useState<PlinkoPrize | null>(null);
    const [pins, setPins] = React.useState<Pin[]>([]);
    const [ball, setBall] = React.useState<Ball | null>(null);
    const [dropStartTime, setDropStartTime] = React.useState(0);
    const [dropPath, setDropPath] = React.useState<{ x: number; y: number }[]>([]);
    const animationRef = React.useRef<number | null>(null);

    // Calculate pin positions
    React.useEffect(() => {
      const newPins: Pin[] = [];
      const pinSpacing = boardWidth / (pinRows + 1);
      const rowSpacing = (boardHeight - 200) / pinRows; // Leave space for prizes at bottom

      // Start from row 1 to skip the top pin (row 0)
      for (let row = 1; row < pinRows; row++) {
        const pinsInRow = row + 1;
        const rowWidth = pinsInRow * pinSpacing;
        const startX = (boardWidth - rowWidth) / 2 + pinSpacing / 2;

        for (let col = 0; col < pinsInRow; col++) {
          newPins.push({
            x: startX + col * pinSpacing,
            y: 100 + row * rowSpacing, // Start 100px from top
          });
        }
      }

      setPins(newPins);
    }, [boardWidth, boardHeight, pinRows, pinSize]);

    const drawBoard = React.useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid pattern
      ctx.strokeStyle = "#16213e";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }



      // Draw pins
      ctx.fillStyle = "#ffd700";
      pins.forEach((pin) => {
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, pinSize, 0, 2 * Math.PI);
        ctx.fill();

        // Add metallic effect
        ctx.strokeStyle = "#ffed4e";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add highlight
        ctx.beginPath();
        ctx.arc(pin.x - 2, pin.y - 2, pinSize / 3, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fill();
      });

      // Draw prize slots at bottom
      const slotWidth = boardWidth / prizes.length;
      prizes.forEach((prize, index) => {
        const x = index * slotWidth;
        const y = boardHeight - 80;
        const width = slotWidth - 4;
        const height = 60;

        // Draw slot background
        ctx.fillStyle = prize.color || "#2c3e50";
        ctx.fillRect(x + 2, y, width, height);

        // Draw slot border
        ctx.strokeStyle = "#34495e";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y, width, height);

        // Draw prize text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(prize.text, x + width / 2 + 2, y + height / 2);

        // Draw prize icon if available
        if (prize.icon) {
          ctx.font = "20px Arial, sans-serif";
          ctx.fillText(prize.icon, x + width / 2 + 2, y + height / 2 - 15);
        }
      });

      // Draw ball if dropping
      if (ball) {
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        ctx.fill();

        // Add ball shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(ball.x + 2, ball.y + 2, ball.radius, 0, 2 * Math.PI);
        ctx.fill();

        // Add ball highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(ball.x - 2, ball.y - 2, ball.radius / 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw drop path trail
      if (dropPath.length > 1) {
        ctx.strokeStyle = "rgba(231, 76, 60, 0.6)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(dropPath[0].x, dropPath[0].y);
        dropPath.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    }, [pins, ball, dropPath, prizes, boardWidth, boardHeight, pinSize]);

    // Animation loop
    React.useEffect(() => {
      if (dropping && ball) {
        const animate = () => {
          const currentTime = Date.now();
          const elapsed = currentTime - dropStartTime;
          const progress = Math.min(elapsed / animationDuration, 1);

          // Update ball position based on physics simulation
          const gravity = 0.5;
          const friction = 0.98;
          const bounce = 0.7;

          // Apply gravity
          ball.vy += gravity;

          // Update position
          ball.x += ball.vx;
          ball.y += ball.vy;

          // Apply friction
          ball.vx *= friction;

          // Check pin collisions
          pins.forEach((pin) => {
            const dx = ball.x - pin.x;
            const dy = ball.y - pin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ball.radius + pinSize;

            if (distance < minDistance) {
              // Collision detected
              const angle = Math.atan2(dy, dx);

              // Move ball away from pin
              ball.x = pin.x + Math.cos(angle) * minDistance;
              ball.y = pin.y + Math.sin(angle) * minDistance;

              // Bounce off pin with some randomness
              const randomAngle = angle + (Math.random() - 0.5) * 0.5;
              const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
              ball.vx = Math.cos(randomAngle) * speed * bounce;
              ball.vy = Math.sin(randomAngle) * speed * bounce;
            }
          });

          // Check wall collisions
          if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx = Math.abs(ball.vx) * bounce;
          } else if (ball.x + ball.radius > boardWidth) {
            ball.x = boardWidth - ball.radius;
            ball.vx = -Math.abs(ball.vx) * bounce;
          }

          // Add current position to drop path
          setDropPath(prev => [...prev, { x: ball.x, y: ball.y }]);

          // Check if ball reached bottom
          if (ball.y >= boardHeight - 100) {
            // Determine which prize slot the ball landed in
            const slotWidth = boardWidth / prizes.length;
            const slotIndex = Math.floor(ball.x / slotWidth);
            const clampedIndex = Math.max(0, Math.min(slotIndex, prizes.length - 1));
            const result = prizes[clampedIndex];

            setDropResult(result);
            setDropping(false);
            setBall(null);
            setDropPath([]);

            if (onDropEnd) {
              onDropEnd(result);
            }

            return;
          }

          setBall({ ...ball });

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [dropping, ball, dropStartTime, animationDuration, pins, prizes, boardWidth, boardHeight, onDropEnd]);

    // Draw board whenever dependencies change
    React.useEffect(() => {
      drawBoard();
    }, [drawBoard]);

    const handleDrop = () => {
      if (dropping || disabled) return;

      // Start drop animation from top center
      const startX = boardWidth / 2;
      const startY = 20;
      const initialVx = (Math.random() - 0.5) * 1; // Smaller random horizontal velocity
      const initialVy = 0;

      setBall({
        x: startX,
        y: startY,
        vx: initialVx,
        vy: initialVy,
        radius: ballSize,
      });

      setDropPath([{ x: startX, y: startY }]);
      setDropResult(null);
      setDropping(true);
      setDropStartTime(Date.now());

      if (onDropStart) {
        onDropStart();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(plinkoVariants({ size, variant }), className)}
        {...props}
      >
        {title && (
          <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
            {title}
          </h3>
        )}

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={boardWidth}
            height={boardHeight}
            className="border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
          />

          {/* Drop button overlay */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={handleDrop}
              disabled={dropping || disabled}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {dropping ? droppingText : buttonText}
            </Button>
          </div>

          {/* Result display */}
          {dropResult && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl border-2 border-yellow-400 animate-pulse">
                <div className="text-center">
                  <div className="text-4xl mb-2">{dropResult.icon}</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    {dropResult.text}
                  </div>
                  {dropResult.value && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {dropResult.value}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prize legend */}
        <div className="mt-4 grid grid-cols-5 gap-2 max-w-md mx-auto">
          {prizes.slice(0, 10).map((prize, index) => (
            <div
              key={`prize-${prize.text}-${index}`}
              className="text-center p-2 rounded text-xs"
              style={{ backgroundColor: prize.color || "#2c3e50" }}
            >
              <div className="text-white font-bold">{prize.text}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Plinko.displayName = "Plinko";

export { Plinko }; 