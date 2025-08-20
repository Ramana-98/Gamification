import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { defaultSpinWheelConfig } from "@/lib/config-loader";
import { playContinuousSound, playIntervalSound, stopSound, stopInterval, playSound } from "@/lib/sound-effects";

const spinWheelVariants = cva(
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
        default: "bg-background px-4", // Added horizontal padding
        card: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl",
        minimal: "bg-transparent px-4", // Added horizontal padding
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

interface SpinWheelSegment {
  text: string;
  color: string;
  value?: string;
}

interface SpinWheelProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof spinWheelVariants> {
  segments: SpinWheelSegment[];
  wheelSize?: number;
  animationDuration?: number;
  minRevolutions?: number;
  maxRevolutions?: number;
  title?: string;
  buttonText?: string;
  spinningText?: string;
  disabled?: boolean;
  onSpinStart?: () => void;
  onSpinEnd?: (result: SpinWheelSegment) => void;
  onSpinClick?: () => void;
  userEmail?: string;
}

const SpinWheel = React.forwardRef<HTMLDivElement, SpinWheelProps>(
  (
    {
      className,
      size,
      variant,
      segments = defaultSpinWheelConfig.segments,
      wheelSize = defaultSpinWheelConfig.defaults.wheelSize,
      animationDuration = defaultSpinWheelConfig.defaults.animationDuration,
      minRevolutions = defaultSpinWheelConfig.defaults.minRevolutions,
      maxRevolutions = defaultSpinWheelConfig.defaults.maxRevolutions,
      title = defaultSpinWheelConfig.defaults.title,
      buttonText = defaultSpinWheelConfig.defaults.buttonText,
      spinningText = defaultSpinWheelConfig.defaults.spinningText,
      disabled = false,
      onSpinStart,
      onSpinEnd,
      onSpinClick,
      userEmail,
      ...props
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [spinning, setSpinning] = React.useState(false);
    const [spinResult, setSpinResult] = React.useState<SpinWheelSegment | null>(
      null
    );
    const [rotation, setRotation] = React.useState(0);
    const [startSpinTime, setStartSpinTime] = React.useState(0);
    const [spinDuration, setSpinDuration] = React.useState(0);
    const [finalRotation, setFinalRotation] = React.useState(0);

    const drawWheel = React.useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw wheel shadow
      ctx.save();
      ctx.translate(centerX + 2, centerY + 2);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fill();
      ctx.restore();

      // Draw the wheel segments
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      const arcSize = (2 * Math.PI) / segments.length;

      segments.forEach((segment, i) => {
        const startAngle = i * arcSize;
        const endAngle = (i + 1) * arcSize;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();

        // Add metallic border
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.stroke();

        // Add subtle gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw text for each segment with proper radial orientation
        ctx.save();
        const segmentCenterAngle = i * arcSize + arcSize / 2;
        const textRadius = radius * 0.7; // Position text at 70% of radius

        // Rotate to the segment's center angle
        ctx.rotate(segmentCenterAngle);

        // Set text properties for radial orientation
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px Arial, sans-serif";
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        // Draw text radially (like clock needles pointing toward center)
        ctx.fillText(segment.text, textRadius, 0);

        ctx.restore();
      });
      ctx.restore();

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#e5e7eb";
      ctx.stroke();

      // Draw pointer (re-designed for clear right-side placement and pointing inwards)
      ctx.beginPath();
      // Tip of the arrow (closest to wheel, pointing left)
      ctx.moveTo(centerX + radius - 5, centerY);
      // Top base point (further right, above center)
      ctx.lineTo(centerX + radius + 15, centerY - 10);
      // Bottom base point (further right, below center)
      ctx.lineTo(centerX + radius + 15, centerY + 10);
      ctx.closePath();
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }, [rotation, segments]);

    // Cleanup sounds on unmount
    React.useEffect(() => {
      return () => {
        stopSound('wheel-spin-sound');
        stopInterval('wheel-tick-sound');
      };
    }, []);

    const handleSpin = () => {
      if (spinning || disabled) return;

      // If email is required but not provided, trigger email input
      if (onSpinClick && !userEmail) {
        onSpinClick();
        return;
      }

      setSpinning(true);
      setSpinResult(null);
      onSpinStart?.();

      // Play realistic wheel spin sound
      playSound('wheel-spin', { volume: 0.3 }).catch(console.warn);

      // Start interval tick sounds (every 150ms during spin for realism)
      const tickInterval = Math.max(100, animationDuration / 25); // More realistic tick timing
      playIntervalSound('wheel-tick', 'wheel-tick-sound', tickInterval, { volume: 0.08 }).catch(console.warn);

      const totalRevolutions =
        minRevolutions + Math.random() * (maxRevolutions - minRevolutions);
      const targetSegmentIndex = Math.floor(Math.random() * segments.length);
      const segmentAngle = (2 * Math.PI) / segments.length;
      const targetSegmentCenterAngle =
        targetSegmentIndex * segmentAngle + segmentAngle / 2;
      const winningMargin = 0.0000001;
      const rotationToAlignTarget =
        ((0 -
          targetSegmentCenterAngle +
          winningMargin +
          2 * Math.PI) %
          (2 * Math.PI));
      const calculatedFinalRotation =
        totalRevolutions * 2 * Math.PI + rotationToAlignTarget;

      setFinalRotation(calculatedFinalRotation);
      setStartSpinTime(Date.now());
      setSpinDuration(animationDuration);
    };

    React.useEffect(() => {
      drawWheel();

      if (spinning) {
        const animate = () => {
          const now = Date.now();
          const elapsed = now - startSpinTime;
          const progress = Math.min(elapsed / spinDuration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 4);

          const currentRotation = finalRotation * easedProgress;
          setRotation(currentRotation);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setSpinning(false);

            // Stop all wheel sounds
            stopSound('wheel-spin-sound');
            stopInterval('wheel-tick-sound');

            // Play realistic wheel stop sound with bounce effect
            playSound('wheel-stop', { volume: 0.25 }).catch(console.warn);

            // Calculate winning segment
            const segmentAngle = (2 * Math.PI) / segments.length;
            const normalizedFinalRotation =
              ((finalRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            // Adjusted angleUnderPointer for pointer on the right (0 radians)
            let angleUnderPointer =
              ((0 - normalizedFinalRotation + 2 * Math.PI) %
                (2 * Math.PI));

            if (angleUnderPointer < 0) {
              angleUnderPointer += 2 * Math.PI;
            }

            const winningIndex = Math.floor(
              (angleUnderPointer + 0.0000001) / segmentAngle
            );
            const result = segments[winningIndex];

            setSpinResult(result);
            onSpinEnd?.(result);
          }
        };
        requestAnimationFrame(animate);
      }
    }, [
      spinning,
      rotation,
      startSpinTime,
      spinDuration,
      finalRotation,
      segments,
      drawWheel,
      onSpinEnd,
    ]);

    return (
      <div
        ref={ref}
        className={cn(
          spinWheelVariants({ size, variant }),
          "px-4", // Added horizontal padding
          className
        )}
        {...props}
      >
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
            {title}
          </h2>
        )}

        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            width={wheelSize}
            height={wheelSize}
            className="rounded-full shadow-lg"
            style={{ filter: spinning ? "blur(0.5px)" : "none" }}
          />
          {spinning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                {spinningText}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleSpin}
          disabled={spinning || disabled}
          size="lg"
          className="min-w-[120px] font-semibold"
          data-spin-button={true}
        >
          {spinning ? spinningText : buttonText}
        </Button>

        {spinResult && !spinning && (
          <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-center">
            <p className="text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
              Congratulations! You won:
            </p>
            <div className="bg-white/30 backdrop-blur-sm rounded-md py-3 px-4 border border-white/20">
              <p className="text-lg font-bold text-white mb-1 drop-shadow-sm">{spinResult.text}</p>
              {spinResult.value && (
                <p className="text-sm text-white/80 drop-shadow-sm">
                  {spinResult.value}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SpinWheel.displayName = "SpinWheel";

export {
  SpinWheel,
  spinWheelVariants,
  type SpinWheelProps,
  type SpinWheelSegment,
};
