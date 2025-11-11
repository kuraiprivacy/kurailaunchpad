# KURAI Launchpad Design Guidelines

## Design Approach
**Reference-Based Approach**: Crypto/DeFi platforms (Phantom, Uniswap, Pump.fun) + anime aesthetic with Kurai's signature dark purple/neon teal theme.

## Color System
```css
Primary Palette:
- Deep Purple (Background): #1E1436
- Mid Purple (Cards): #2E1B4A
- Neon Teal (Accent): #26E7D7
- Cyan Accent: #3BE8D3
- Pale Glow: #BFEFF3
- Near-Black BG: #0F0B14
- Text Main: #E6F9F8

Gradients:
- Body: linear-gradient(180deg, #0F0B14, #06040a)
- Header: linear-gradient(90deg, rgba(30,20,54,0.8), rgba(46,27,74,0.8))
- Primary Button: linear-gradient(90deg, #26E7D7, #3BE8D3)
```

## Typography
- **Font Family**: Inter, system-ui
- **Headings**: Bold (600-700), larger sizes for hierarchy
- **Body**: Regular (400), E6F9F8 color
- **Accent Text**: Neon teal for CTAs and highlights

## Layout System
**Spacing**: Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Card padding: 1rem (p-4)
- Section spacing: py-8 to py-12
- Component gaps: gap-4 to gap-6

## Component Library

### Header
- Gradient background with border-bottom (neon teal, 8% opacity)
- KURAI logo + tagline: "KURAI — fair launches, ghostly UX"
- Wallet connect button (shows connected pubkey when active)
- Anime aesthetic character art placement

### Cards (.card class)
- Background: rgba(20,14,30,0.6)
- Border: 1px solid rgba(38,231,215,0.06)
- Box-shadow: 0 6px 20px rgba(0,0,0,0.6)
- Border-radius: 16px
- Padding: 1rem

### Buttons (.button-primary)
- Gradient background (teal to cyan)
- Color: Deep purple text
- Padding: 0.6rem 1.2rem
- Border-radius: 12px
- Font-weight: 600

### Forms
- Create Launch Form: Multi-section with launch mode selector, dev allocation inputs, vesting schedule fields
- Input fields with subtle teal borders on focus
- Dropdown selectors for launch types (Batch/LBP/Dutch/Bonding)

### Commit-Reveal Panel
- Hash preview display area
- Commit/Reveal button states with countdown timer
- Visual indicator for commitment status

### Batch Auction Interface
- Sealed order submission form with amount/maxPrice fields
- Order status cards showing "sealed" state
- Settlement trigger button (creator-only)

### Escrow Dashboard
- Balance display with vesting timeline visualization
- Milestone tracker with progress indicators
- Multisig signer list
- Release proposal button

### Audit Log
- Table layout with chronological events
- Search functionality
- Transaction hash links (placeholders)
- Exportable data indicator

## Images
**Hero Section**: Anime-style character art featuring Kurai theme (dark purple/teal palette), placed in header area. If buttons overlay images, use backdrop blur for button backgrounds.

## Animations
Minimal - focus on:
- Subtle hover states on buttons (slight brightness increase)
- Smooth transitions on card interactions
- Loading states for wallet connections and transactions

## Key UI Patterns
- Glass morphism effect on cards (semi-transparent with blur)
- Neon glow accents on interactive elements
- High contrast for readability against dark backgrounds
- Clear visual hierarchy through size, weight, and color
- Crypto-native patterns: wallet states, transaction status, countdown timers