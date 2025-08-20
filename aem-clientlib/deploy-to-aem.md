# AEM ClientLib Deployment Guide

## Overview
This guide explains how to deploy the Wheel Spin Game as an AEM ClientLib component.

## File Structure
```
aem-clientlib/
├── apps/
│   └── gamification/
│       ├── clientlibs/
│       │   ├── base/
│       │   │   ├── .content.xml
│       │   │   └── css.txt
│       │   └── wheelspin/
│       │       ├── .content.xml
│       │       ├── css.txt
│       │       ├── js.txt
│       │       └── assets/
│       │           ├── index-a3D1GFfS.js
│       │           ├── index-ChgTU3GF.css
│       │           └── aem-integration.js
│       └── components/
│           └── wheelspin/
│               ├── .content.xml
│               ├── wheelspin.html
│               └── _cq_dialog/
│                   └── .content.xml
```

## Deployment Steps

### 1. Upload to AEM
1. Navigate to AEM Package Manager
2. Create a new package or upload the `aem-clientlib` folder
3. Install the package

### 2. Alternative: Direct Upload via CRXDE
1. Open CRXDE Lite in AEM
2. Navigate to `/apps/gamification/`
3. Create the folder structure as shown above
4. Upload each file to its respective location

### 3. Verify Installation
1. Check that the ClientLib is registered:
   - Go to `/libs/granite/ui/content/dumplibs.html`
   - Search for `gamification.wheelspin`
   - Verify it shows the correct JS and CSS files

### 4. Add Component to Page
1. Edit a page in AEM
2. Open the Components browser
3. Look for "Gamification" group
4. Drag "Wheel Spin Game" component to the page
5. Configure the component using the dialog

## Configuration Options

### AEM Dialog Properties
- **Title**: Game title (default: "Spin the Wheel!")
- **Button Text**: Spin button text (default: "SPIN")
- **Spinning Text**: Text shown while spinning (default: "Spinning...")
- **Wheel Size**: Canvas size in pixels (default: 400)
- **Animation Duration**: Spin duration in milliseconds (default: 4000)
- **Min/Max Revolutions**: Spin revolutions range (default: 5-8)
- **Enable Sound**: Toggle sound effects (default: true)
- **Prizes**: JSON array of prize objects
- **Colors**: JSON array of segment colors
- **Redeem Codes**: JSON object mapping prize values to codes

### Example Prize Configuration
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

### Example Color Configuration
```json
["#FFC300", "#FF5733", "#C70039", "#900C3F", "#581845", "#2E86C1"]
```

### Example Code Configuration
```json
{
  "DISCOUNT10": "SAVE10",
  "FREESHIP": "FREESHIP",
  "BOGO": "BOGO2024"
}
```

## Troubleshooting

### Common Issues
1. **Component not appearing**: Check that the component is properly installed and the group is visible
2. **JavaScript errors**: Verify that all JS files are properly loaded in the ClientLib
3. **Styling issues**: Ensure Tailwind CSS is available or include the CSS file
4. **Configuration not working**: Check that JSON properties are valid

### Debug Steps
1. Open browser developer tools
2. Check Console for JavaScript errors
3. Verify ClientLib loading in Network tab
4. Check that data attributes are properly set on the container

## Customization

### Adding New Features
1. Modify `aem-integration.js` to add new functionality
2. Update the AEM dialog to include new configuration options
3. Add new data attributes to `wheelspin.html`
4. Update the integration script to read new properties

### Styling Customization
1. Modify the CSS classes in `aem-integration.js`
2. Add custom CSS to the ClientLib
3. Use AEM's CSS override capabilities

## Performance Considerations

### Optimization Tips
1. Minify JavaScript and CSS files for production
2. Use AEM's ClientLib minification features
3. Consider lazy loading for better performance
4. Optimize images and assets

### Caching
1. Set appropriate cache headers in AEM
2. Use versioned file names for cache busting
3. Consider using AEM's dispatcher for static assets 