# Coding Style Guide

## CSS Preferences

### Layout & Spacing
- **Prefer `aspect-ratio`** over setting explicit `width` and `height` properties
- **Prefer `gap`** over margins for spacing between elements
- **Prefer CSS Grid** over Flexbox when possible
- **Use CSS Grid** for layouts instead of flexbox + margins
- **Minimize use of margins** - prefer padding, gap, or grid for spacing

### Transform Properties
- **Use individual transform properties** instead of the `transform` shorthand:
  - Use `translate` instead of `transform: translate()`
  - Use `scale` instead of `transform: scale()`
  - Use `rotate` instead of `transform: rotate()`
  - This provides better performance and cleaner code

### Examples

#### ✅ Preferred
```css
.icon {
    inline-size: 2.5rem;
    aspect-ratio: 1;
}

.container {
    display: grid;
    gap: var(--spacing-md);
    margin-inline: auto;
}

.flex-container {
    display: flex;
    gap: var(--spacing-sm);
}

.button:hover {
    translate: 0 -2px;
    scale: 1.05;
}
```

#### ❌ Avoid
```css
.icon {
    width: 2.5rem;
    height: 2.5rem; /* Use aspect-ratio instead */
}

.container {
    display: flex;
    margin-bottom: var(--spacing-md); /* Use gap instead */
    margin-left: auto; /* Use margin-inline instead */
    margin-right: auto; /* Use margin-inline instead */
}

.flex-container {
    display: flex;
    margin: 0 var(--spacing-sm); /* Use gap instead */
}

.button:hover {
    transform: translateY(-2px) scale(1.05); /* Use individual properties instead */
}
```

### Utility Classes
- **Use utility classes** for common patterns (like `.center`, `.between`, etc.)
- **Avoid duplication** - extract common styles into reusable classes
- **Keep utility classes generic** - don't include technology names (e.g., `.center` not `.flex-center`)

### CSS Properties
- **Use `inset: 0`** instead of `top: 0; left: 0; right: 0; bottom: 0;`
- **Use shorthand properties** when possible (e.g., `background` instead of separate `background-*` properties)
- **Prefer CSS variables** for design tokens (colors, spacing, etc.)
- **Prefer logical properties** over physical properties:
  - `inline-size` instead of `width`
  - `block-size` instead of `height`
  - `margin-inline` instead of `margin-left/right`
  - `margin-block` instead of `margin-top/bottom`
  - `padding-inline` instead of `padding-left/right`
  - `padding-block` instead of `padding-top/bottom`

### Code Organization
- **DRY principle** - Don't Repeat Yourself
- **Consolidate similar styles** into shared rules
- **Use semantic class names** that describe purpose, not appearance
- **Group related styles** together

### Responsive Design
- **Use CSS Grid** for responsive layouts
- **Prefer container queries** over media queries when possible
- **Use logical properties** (e.g., `margin-inline` instead of `margin-left/right`)

## JavaScript Preferences

### Code Style
- **Use modern ES6+ features** (arrow functions, destructuring, etc.)
- **Prefer functional programming** approaches when possible
- **Use descriptive variable names**
- **Keep functions small and focused**

### JSDoc Documentation
- **Use JSDoc comments** for all functions, classes, and complex variables
- **Include type annotations** to make code more type-safe
- **Document parameters, return values, and exceptions**
- **Use JSDoc for better IDE support and code documentation**

#### ✅ Preferred JSDoc Examples
```javascript
/**
 * Generates a random password based on specified criteria
 * @param {Object} options - Password generation options
 * @param {number} options.length - Length of the password
 * @param {boolean} options.includeUppercase - Include uppercase letters
 * @param {boolean} options.includeLowercase - Include lowercase letters
 * @param {boolean} options.includeNumbers - Include numbers
 * @param {boolean} options.includeSymbols - Include symbols
 * @returns {string} Generated password
 * @throws {Error} When no character types are selected
 */
const generatePassword = ({ length, includeUppercase, includeLowercase, includeNumbers, includeSymbols }) => {
    // Implementation
};

/**
 * Updates the strength indicator based on password criteria
 * @param {string} password - The password to evaluate
 * @param {Object} options - Password generation options
 * @returns {Object} Strength information
 */
const calculateStrength = (password, options) => {
    // Implementation
};
```

#### ❌ Avoid
```javascript
// No documentation
const generatePassword = (options) => {
    // Implementation
};

// Inline comments instead of JSDoc
const calculateStrength = (password, options) => {
    // Calculate password strength
    // Returns strength info
};
```

### DOM Manipulation
- **Use CSS classes** for state changes instead of inline styles
- **Prefer `classList`** over direct style manipulation
- **Use event delegation** when appropriate

### Modern JavaScript Features
- **Use arrow functions** for callbacks and short functions
- **Use destructuring** for object and array assignments
- **Use template literals** for string interpolation
- **Use const/let** instead of var
- **Use optional chaining** (`?.`) and nullish coalescing (`??`)
- **Use array methods** like `map`, `filter`, `reduce` instead of loops when appropriate

#### ✅ Preferred ES6+ Examples
```javascript
/**
 * Updates the UI with generated password
 * @param {string} password - The password to display
 */
const updatePasswordDisplay = (password) => {
    const output = document.querySelector('.password-output');
    output.value = password ?? '';
};

/**
 * Handles checkbox changes
 * @param {Event} event - The change event
 */
const handleCheckboxChange = ({ target }) => {
    const { checked, value } = target;
    // Implementation
};

/**
 * Gets all selected options
 * @returns {string[]} Array of selected option values
 */
const getSelectedOptions = () => {
    return Array.from(document.querySelectorAll('.option-checkbox:checked'))
        .map(checkbox => checkbox.value);
};
```

## General Principles

### Maintainability
- **Write self-documenting code**
- **Use consistent naming conventions**
- **Comment complex logic**
- **Keep code DRY and modular**

### Performance
- **Minimize DOM queries** - cache selectors when possible
- **Use efficient CSS selectors**
- **Prefer CSS animations** over JavaScript animations

### Accessibility
- **Use semantic HTML**
- **Include proper ARIA attributes**
- **Ensure keyboard navigation works**
- **Provide screen reader support**

---

*This guide should be referenced when making code changes to ensure consistency with preferred coding practices.* 