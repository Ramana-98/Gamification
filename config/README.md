# Configuration Files - React Environment

This directory contains JSON configuration files for the React gamification application. These files allow easy customization of prizes, segments, and component settings without modifying the component code.

## File Structure

### Spin Wheel Configuration
**File**: `spin-wheel-prizes.json`

```json
{
  "segments": [
    {
      "text": "10% Off",
      "color": "#FFC300",
      "value": "DISCOUNT10"
    }
  ],
  "defaults": {
    "wheelSize": 400,
    "animationDuration": 4000,
    "title": "Spin the Wheel!"
  }
}
```

### Pick-a-Gift Configuration
**File**: `pick-a-gift-prizes.json`

```json
{
  "prizes": [
    {
      "text": "30% OFF",
      "value": "Use code: GIFT30",
      "color": "#e74c3c",
      "icon": "🎯",
      "probability": 0.15
    }
  ],
  "defaults": {
    "title": "Choose a Gift!",
    "animationDuration": 1000
  }
}
```

### Scratch Card Configuration
**File**: `scratch-card-prizes.json`

```json
{
  "prizes": [
    {
      "text": "25% Discount",
      "value": "Code: SCRATCH25",
      "color": "#4CAF50",
      "icon": "🎉"
    }
  ],
  "defaults": {
    "cardWidth": 300,
    "cardHeight": 200,
    "title": "Scratch Card"
  }
}
```

## React Integration

The React application automatically loads these configurations:

1. **Dynamic Loading**: Configurations are loaded on component mount using `useEffect`
2. **Fallback Support**: If JSON files fail to load, default configurations are used
3. **Type Safety**: All configurations are typed with TypeScript interfaces
4. **Hot Reload**: Changes to JSON files are reflected after page refresh

## Development Workflow

### Editing Prizes
1. Modify the JSON files in this directory
2. Refresh the React application
3. Changes are immediately reflected in the UI

### Adding New Segments/Prizes
1. Add new objects to the arrays in the respective JSON files
2. Ensure proper formatting and required fields
3. Refresh to see new options

### Customizing Defaults
1. Modify the `defaults` section in each JSON file
2. Update values like sizes, animations, and text
3. Refresh to apply changes

## AEM Migration Path

When migrating to AEM, these configurations can be:

1. **Content Fragments**: Stored as AEM content fragments
2. **Component Dialogs**: Edited through AEM component editors
3. **Multi-site Support**: Different configurations per site/brand
4. **Version Control**: AEM content versioning for configurations

## Configuration Schema

### Spin Wheel Segments
- `text`: Display text on the wheel
- `color`: Hex color code for the segment
- `value`: Optional identifier for tracking

### Pick-a-Gift Prizes
- `text`: Prize display text
- `value`: Redemption instructions
- `color`: Prize background color
- `icon`: Emoji icon for visual appeal
- `probability`: Weight for random selection (0.0-1.0)

### Scratch Card Prizes
- `text`: Prize display text
- `value`: Redemption instructions
- `color`: Prize background color
- `icon`: Emoji icon for visual appeal

## Best Practices

### Colors
- Use hex color codes (e.g., "#FFC300")
- Ensure good contrast with white text
- Consider brand colors for consistency

### Icons
- Use emoji icons for visual appeal
- Keep icons relevant to the prize
- Consider accessibility for screen readers

### Probabilities (Pick-a-Gift)
- Values should sum to 1.0 (100%)
- Higher values = more likely to be selected
- "Try Again!" typically has highest probability

### Values
- Use clear, descriptive codes
- Include redemption instructions
- Consider tracking/analytics needs 