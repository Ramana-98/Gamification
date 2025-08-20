# AEM Wheel Spin Game ClientLib

## Overview
This package converts the React-based Wheel Spin Game into an AEM-compatible ClientLib component that can be easily integrated into Adobe Experience Manager pages.

## Features
- ✅ **AEM Touch UI Dialog** - Configure prizes, colors, and redeem codes
- ✅ **Dynamic Configuration** - All game settings configurable via AEM properties
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Sound Effects** - Optional sound effects for enhanced user experience
- ✅ **Redeem Codes** - Automatic code generation and display
- ✅ **Smooth Animations** - Professional wheel spinning animations
- ✅ **Accessibility** - Keyboard navigation and screen reader support

## Quick Start

### 1. Deploy to AEM
```bash
# Copy the aem-clientlib folder to your AEM project
cp -r aem-clientlib/ /path/to/your/aem/project/
```

### 2. Install via Package Manager
1. Open AEM Package Manager
2. Upload the `aem-clientlib` folder as a package
3. Install the package

### 3. Add to Page
1. Edit any AEM page
2. Open Components browser
3. Find "Gamification" group
4. Drag "Wheel Spin Game" to the page
5. Configure using the dialog

## Configuration Options

### Basic Settings
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Title | Text | "Spin the Wheel!" | Game title displayed above wheel |
| Button Text | Text | "SPIN" | Text on the spin button |
| Spinning Text | Text | "Spinning..." | Text shown during animation |
| Wheel Size | Number | 400 | Canvas size in pixels |
| Animation Duration | Number | 4000 | Spin duration in milliseconds |
| Min Revolutions | Number | 5 | Minimum spin revolutions |
| Max Revolutions | Number | 8 | Maximum spin revolutions |
| Enable Sound | Boolean | true | Toggle sound effects |

### Prize Configuration
Configure prizes as a JSON array:
```json
[
  {
    "text": "10% Off",
    "color": "#FFC300",
    "value": "DISCOUNT10"
  },
  {
    "text": "Free Shipping",
    "color": "#FF5733",
    "value": "FREESHIP"
  }
]
```

### Color Configuration
Configure segment colors as a JSON array:
```json
["#FFC300", "#FF5733", "#C70039", "#900C3F", "#581845", "#2E86C1"]
```

### Redeem Codes
Configure redeem codes as a JSON object:
```json
{
  "DISCOUNT10": "SAVE10",
  "FREESHIP": "FREESHIP",
  "BOGO": "BOGO2024"
}
```

## File Structure
```
aem-clientlib/
├── apps/
│   └── gamification/
│       ├── clientlibs/
│       │   ├── base/                    # Base dependencies
│       │   │   ├── .content.xml
│       │   │   └── css.txt
│       │   └── wheelspin/               # Wheel spin game
│       │       ├── .content.xml         # ClientLib definition
│       │       ├── css.txt              # CSS file registration
│       │       ├── js.txt               # JS file registration
│       │       └── assets/              # Built assets
│       │           ├── index-a3D1GFfS.js
│       │           ├── index-ChgTU3GF.css
│       │           └── aem-integration.js
│       └── components/
│           └── wheelspin/               # AEM component
│               ├── .content.xml         # Component definition
│               ├── wheelspin.html       # Component template
│               └── _cq_dialog/          # Touch UI dialog
│                   └── .content.xml
├── deploy-to-aem.md                     # Deployment guide
├── sample-usage.html                    # Demo page
└── README.md                           # This file
```

## Technical Details

### ClientLib Categories
- `gamification.base` - Base dependencies
- `gamification.wheelspin` - Wheel spin game assets

### Data Attributes
The component uses data attributes to pass AEM properties to JavaScript:
- `data-prizes` - Prize configuration
- `data-colors` - Color configuration
- `data-codes` - Redeem codes
- `data-title` - Game title
- `data-button-text` - Button text
- `data-spinning-text` - Spinning text
- `data-wheel-size` - Wheel size
- `data-animation-duration` - Animation duration
- `data-min-revolutions` - Min revolutions
- `data-max-revolutions` - Max revolutions
- `data-sound-enabled` - Sound toggle

### JavaScript Integration
The `aem-integration.js` file:
1. Reads AEM properties from data attributes
2. Parses JSON configurations
3. Initializes the wheel spin game
4. Handles user interactions
5. Displays results with redeem codes

## Customization

### Adding New Features
1. **Modify AEM Dialog**: Add new fields to `_cq_dialog/.content.xml`
2. **Update Template**: Add new data attributes to `wheelspin.html`
3. **Extend Integration**: Modify `aem-integration.js` to handle new properties
4. **Add Styling**: Update CSS classes for new features

### Styling Customization
```css
/* Custom wheel styling */
.wheel-spin-game {
    /* Your custom styles */
}

/* Custom button styling */
#spin-button {
    /* Your custom styles */
}
```

### Sound Customization
```javascript
// Add custom sound effects
function playCustomSound(soundType) {
    // Your custom sound implementation
}
```

## Troubleshooting

### Common Issues

#### Component Not Appearing
- Check that the component is properly installed
- Verify the component group is visible in AEM
- Check browser console for JavaScript errors

#### Configuration Not Working
- Validate JSON syntax in dialog fields
- Check that data attributes are properly set
- Verify ClientLib is loading correctly

#### Styling Issues
- Ensure Tailwind CSS is available
- Check CSS file loading in Network tab
- Verify CSS classes are applied correctly

### Debug Steps
1. Open browser developer tools
2. Check Console for errors
3. Verify ClientLib loading in Network tab
4. Inspect data attributes on container element
5. Test JSON parsing in Console

### AEM-Specific Issues
1. **ClientLib Not Loading**: Check `/libs/granite/ui/content/dumplibs.html`
2. **Component Not Found**: Verify component installation in CRXDE
3. **Dialog Not Working**: Check dialog XML syntax
4. **Properties Not Saving**: Verify property names in dialog

## Performance Optimization

### Production Recommendations
1. **Minify Assets**: Use AEM's built-in minification
2. **Enable Caching**: Set appropriate cache headers
3. **Optimize Images**: Compress any image assets
4. **Lazy Loading**: Consider lazy loading for multiple instances

### AEM Best Practices
1. **Use ClientLib Categories**: Organize assets properly
2. **Version Assets**: Use versioned file names for cache busting
3. **Monitor Performance**: Use AEM's performance monitoring tools
4. **Test Across Devices**: Ensure responsive behavior

## Support

### Getting Help
1. Check the troubleshooting section above
2. Review the deployment guide
3. Test with the sample usage page
4. Check AEM logs for errors

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial AEM ClientLib implementation
- Touch UI dialog for configuration
- Dynamic prize and code management
- Responsive design
- Sound effects support 