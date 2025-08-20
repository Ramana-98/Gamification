import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-3", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && typeof child.props === 'object' && child.props !== null) {
          return React.cloneElement(child, {
            checked: (child.props as any).value === value,
            onValueChange,
          } as any)
        }
        return child
      })}
    </div>
  )
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onValueChange?: (value: string) => void
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => (
    <label
      className={cn(
        "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-accent/50",
        props.checked ? "border-primary bg-primary/5" : "border-border"
      )}
    >
      <input
        ref={ref}
        type="radio"
        value={value}
        checked={props.checked}
        onChange={(e) => onValueChange?.(e.target.value)}
        className="sr-only"
        {...props}
      />
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
        props.checked ? "border-primary bg-primary" : "border-border"
      )}>
        {props.checked && (
          <div className="w-2 h-2 bg-white rounded-full" />
        )}
      </div>
      <span className="font-medium text-foreground">{children}</span>
    </label>
  )
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem } 