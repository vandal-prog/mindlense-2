# Troubleshooting Guide

## Issue: About Modal and Onchify Attribution Not Showing

### Quick Checks:

1. **Check Browser Console**:
   - Press F12 to open Developer Tools
   - Look for any JavaScript errors
   - Check if you see "About button clicked" when clicking the About button

2. **Verify Components Are Loaded**:
   - Look for "AboutModal render - isOpen: true" in console when clicking About
   - Check if the Test button appears and works

3. **Check CSS Issues**:
   - The modal has z-index of 9999 to ensure it appears on top
   - Check if any CSS is hiding the footer

### Debugging Steps:

1. **Test the Test Button**:
   - Click the green "Test" button in the header
   - If this modal appears, the issue is with the AboutModal component
   - If this modal doesn't appear, there's a general modal issue

2. **Check Footer Visibility**:
   - Scroll to the bottom of the page
   - Look for "Created by Onchify" text
   - If not visible, check if there are CSS issues

3. **Console Debugging**:
   - Open browser console (F12)
   - Click the About button
   - Look for console.log messages
   - Check for any error messages

### Common Issues:

1. **Build Issues**:
   - Components might not be built properly
   - Try running `npm run build` locally

2. **CSS Conflicts**:
   - Other CSS might be hiding elements
   - Check if elements have `display: none` or `visibility: hidden`

3. **JavaScript Errors**:
   - Any JavaScript error can prevent components from rendering
   - Check console for error messages

### Quick Fixes:

1. **Force Refresh**:
   - Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache

2. **Check Network**:
   - Ensure all JavaScript files are loading
   - Check Network tab in Developer Tools

3. **Verify Environment**:
   - Make sure you're on the correct page (Dashboard)
   - Check if you're logged in properly

### Expected Behavior:

- **About Button**: Blue button with "About" text in the header
- **Test Button**: Green button with "Test" text in the header
- **Footer**: "Created by Onchify" link at the bottom of the page
- **Modal**: Should appear as overlay when clicking About or Test buttons

### If Still Not Working:

1. Check if the components are being imported correctly
2. Verify there are no TypeScript errors
3. Check if the build process is including all files
4. Look for any console errors that might be preventing rendering
