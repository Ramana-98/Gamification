# FloatingWheelGame Component

A React component that wraps the existing SpinWheel game in a floating icon with popup modal functionality.

## Features

- **Floating Icon**: Small, animated icon positioned in the bottom-right corner
- **Popup Modal**: Full-screen modal that opens when the icon is clicked
- **Game Preservation**: All existing SpinWheel game logic is preserved
- **Responsive Design**: Works across different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard support (ESC to close)
- **Smooth Animations**: Fade-in/out modal with backdrop blur

## Usage

```tsx
import { FloatingWheelGame } from '@/components/FloatingWheelGame';

// Basic usage
<FloatingWheelGame
  segments={[
    { text: "Prize 1", color: "#FF6B6B" },
    { text: "Prize 2", color: "#4ECDC4" },
    { text: "Prize 3", color: "#45B7D1" }
  ]}
  onSpinStart={() => console.log('Spinning started')}
  onSpinEnd={(result) => console.log('Won:', result.text)}
/>

// With all props
<FloatingWheelGame
  segments={segments}
  wheelSize={300}
  animationDuration={3000}
  minRevolutions={3}
  maxRevolutions={5}
  title="Spin to Win!"
  buttonText="SPIN"
  spinningText="Spinning..."
  disabled={false}
  onSpinStart={handleSpinStart}
  onSpinEnd={handleSpinEnd}
  className="custom-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segments` | `SpinWheelSegment[]` | `[]` | Array of wheel segments with text, color, and optional value |
| `wheelSize` | `number` | `300` | Size of the wheel in pixels |
| `animationDuration` | `number` | `3000` | Duration of spin animation in milliseconds |
| `minRevolutions` | `number` | `3` | Minimum number of wheel revolutions |
| `maxRevolutions` | `number` | `5` | Maximum number of wheel revolutions |
| `title` | `string` | `"Spin the Wheel!"` | Title displayed above the wheel |
| `buttonText` | `string` | `"SPIN"` | Text on the spin button |
| `spinningText` | `string` | `"Spinning..."` | Text shown while spinning |
| `disabled` | `boolean` | `false` | Whether the wheel is disabled |
| `onSpinStart` | `() => void` | `undefined` | Callback when spinning starts |
| `onSpinEnd` | `(result: SpinWheelSegment) => void` | `undefined` | Callback when spinning ends |
| `className` | `string` | `undefined` | Additional CSS classes |

## Styling

The component uses Tailwind CSS classes and includes:

- **Floating Icon**: Purple-to-pink gradient with hover effects and pulse animation
- **Modal**: Backdrop blur with centered content
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Focus management and keyboard navigation

## Integration

The component is designed to work with the existing SpinWheel game logic. Simply replace the direct SpinWheel usage with FloatingWheelGame and pass the same props.

## Example Integration

```tsx
// Before (direct SpinWheel usage)
{activeGame === 'wheel' && (
  <SpinWheel
    segments={configs.spinWheel.segments}
    onSpinStart={handleSpinStart}
    onSpinEnd={handleSpinEnd}
    // ... other props
  />
)}

// After (floating wheel game)
<FloatingWheelGame
  segments={configs.spinWheel.segments}
  onSpinStart={handleSpinStart}
  onSpinEnd={handleSpinEnd}
  // ... other props
/>
```
