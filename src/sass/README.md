# Birthhelper Styling Guide

This document provides guidelines for using the styling system in the Birthhelper project.

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Variables](#variables)
4. [Mixins](#mixins)
5. [Utility Classes](#utility-classes)
6. [Component Styles](#component-styles)
7. [Best Practices](#best-practices)

## Overview

The Birthhelper styling system uses SCSS to provide a consistent and maintainable approach to styling components. The system includes:

- Global variables for colors, spacing, typography, etc.
- Mixins for common patterns
- Utility classes for quick styling
- Component styles for reusable UI elements

## File Structure

```
src/sass/
├── variables.scss       # Global variables
├── mixins/              # Mixins directory
│   ├── _responsive.scss # Responsive mixins
│   ├── _common.scss     # Common mixins
│   └── no-list.scss     # List reset mixin
├── utilities.scss       # Utility classes
├── components.scss      # Component styles
├── general.scss         # General styles
├── normalize.scss       # CSS normalization
└── style.scss           # Main style file
```

## Variables

Variables are defined in `variables.scss` and organized into categories:

### Colors

```scss
// Primary colors
$blue: #487ff1;
$green: #30c469;
$red: #ef424c;

// Semantic colors
$text-primary: $dark;
$text-secondary: $dark-grey;
$success: $green;
$error: $red;
```

### Spacing

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-base: 16px;
$spacing-md: 24px;
$spacing-lg: 32px;
```

### Breakpoints

```scss
$breakpoints: (
  'sm': $mobile-width-only,
  'md': $tablet-width,
  'lg': $desktop-width
);
```

## Mixins

### Responsive Mixins

```scss
// Use the respond-to mixin for responsive design
@include respond-to('md') {
  // Styles for tablet and above
}

// Use the mobile-first mixin for properties that change at different breakpoints
@include mobile-first('font-size', 14px, 16px, 18px);
```

### Layout Mixins

```scss
// Use the flex mixin for flexbox layouts
@include flex(row, center, center);

// Use the grid mixin for grid layouts
@include grid(3, $spacing-base);

// Use the container mixin for container elements
@include container(1200px, $spacing-base);
```

### Component Mixins

```scss
// Use the card mixin for card elements
@include card($spacing-base, $border-radius-base, 2);

// Use the avatar mixin for avatar elements
@include avatar(44px);

// Use the button mixins for buttons
@include button-base;
@include button-size('md');
@include button-variant($blue);
```

## Utility Classes

Utility classes are available for common styling needs:

### Display

```html
<div class="d-flex">...</div>
<div class="d-none d-md-block">...</div>
```

### Flexbox

```html
<div class="d-flex flex-column align-items-center justify-content-between">...</div>
```

### Spacing

```html
<div class="mt-base mb-lg px-md">...</div>
```

### Typography

```html
<p class="text-primary font-bold text-center">...</p>
```

## Component Styles

Common component styles are available in `components.scss`:

### Buttons

```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-success btn-lg">Large Success Button</button>
<button class="btn btn-light btn-sm">Small Light Button</button>
```

### Cards

```html
<div class="card">
  <div class="card-header">Card Header</div>
  <div class="card-body">Card Content</div>
  <div class="card-footer">Card Footer</div>
</div>
```

### Forms

```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input type="text" class="form-control" placeholder="Input">
</div>
```

## Best Practices

1. **Use variables for consistency**
   - Always use color variables instead of hardcoded values
   - Use spacing variables for consistent spacing

2. **Use mixins for common patterns**
   - Use the flex mixin for flexbox layouts
   - Use the respond-to mixin for responsive design

3. **Use utility classes for quick styling**
   - Use utility classes for one-off styling needs
   - Combine utility classes for complex styling

4. **Use component styles for reusable elements**
   - Use component styles for common UI elements
   - Extend component styles with additional classes

5. **Import only what you need**
   - Import only the variables and mixins you need in component-specific styles
   - The main style.scss already imports everything for global styles

6. **Follow the mobile-first approach**
   - Start with mobile styles
   - Use respond-to mixin for larger screens

7. **Use modern CSS features**
   - Use CSS Grid for layout
   - Use CSS Custom Properties for dynamic values
   - Use the :has() selector for parent-based styling
