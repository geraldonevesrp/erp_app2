# Layout System Documentation

## Overview
This document describes the modular layout system used across different modules in the ERP application. Each module (ERP, Master, Revendas) follows the same pattern to ensure consistency and maintainability.

## Layout Structure
Each module's layout consists of three main components:

### 1. Main Layout (`[module]-layout.tsx`)
- Manages the overall layout state and structure
- Handles responsive behavior
- Contains the sidebar and header components
- Key features:
  - Responsive menu state management
  - Smooth transitions for menu open/close
  - Automatic mobile detection and adaptation

```typescript
interface LayoutProps {
  children: React.ReactNode
  menuItems: MenuGroup[] // Navigation items
}
```

### 2. Sidebar (`[module]-sidebar.tsx`)
- Handles the navigation menu
- Shows logo and profile information
- Features:
  - Responsive behavior (mobile/desktop)
  - Smooth slide animations
  - Overlay for mobile view
  - Automatic closing on mobile navigation

### 3. Header (`[module]-header.tsx`)
- Contains top bar actions
- Manages menu toggle
- User profile and theme controls
- Features:
  - Menu toggle button
  - Theme switcher
  - Notifications
  - User profile dropdown

## Key Features

### Responsive Behavior
- Mobile (<768px):
  - Menu starts closed
  - Opens with overlay
  - Closes automatically on navigation
  - Full screen menu when open

- Desktop (≥768px):
  - Menu can be toggled
  - Smooth content transitions
  - No overlay
  - Persistent state

### Transitions
- Menu sliding: `transition-transform duration-300`
- Content adjustment: `transition-[padding] duration-300`
- Smooth state changes in both directions

### State Management
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(true)

// Mobile detection
useEffect(() => {
  const handleResize = () => {
    const isMobile = window.innerWidth < 768
    setIsMenuOpen(!isMobile)
  }
  
  handleResize()
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

## CSS Classes Structure

### Layout Container
```css
.layout-container {
  flex h-screen overflow-hidden transition-[padding] duration-300
  md:pl-64 (when menu open)
  md:pl-0 (when menu closed)
}
```

### Sidebar
```css
.sidebar {
  fixed md:fixed top-0 left-0 h-screen w-64
  bg-background border-r z-40
  transition-transform duration-300 ease-in-out
  translate-x-0 (when open)
  -translate-x-full (when closed)
}
```

### Content Area
```css
.content-area {
  flex flex-col flex-1 h-full overflow-hidden w-full
}
```

## Implementation Guide

1. Create the three core components for your module:
   - `[module]-layout.tsx`
   - `[module]-sidebar.tsx`
   - `[module]-header.tsx`

2. Follow the component structure and props interface
3. Implement responsive behavior using the provided patterns
4. Ensure all transitions and animations are consistent
5. Test thoroughly on both mobile and desktop views

## Best Practices

1. Always maintain the modular structure
2. Keep state management in the main layout component
3. Use consistent transition timings
4. Follow the established responsive patterns
5. Maintain accessibility features
6. Use type-safe interfaces for props

## Directory Structure
```
src/
  components/
    [module]/
      layout/
        [module]-layout.tsx
        [module]-sidebar.tsx
        [module]-header.tsx
```

## Example Usage
```typescript
// In your page layout
import { ModuleLayout } from '@/components/[module]/layout/[module]-layout'

export default function Layout({ children }) {
  const menuItems = [/* your menu items */]
  return <ModuleLayout menuItems={menuItems}>{children}</ModuleLayout>
}
```
