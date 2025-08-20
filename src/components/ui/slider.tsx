import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  min?: number
  max?: number
  step?: number
  showLabels?: boolean
  minLabel?: string
  maxLabel?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, showLabels = true, minLabel, maxLabel, ...props }, ref) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-primary/20",
            className
          )}
          {...props}
        />
        {showLabels && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{minLabel || min}</span>
            <span className="font-medium text-foreground">
              {props.value || min}
            </span>
            <span>{maxLabel || max}</span>
          </div>
        )}
      </div>
    </div>
  )
)
Slider.displayName = "Slider"

export { Slider } 