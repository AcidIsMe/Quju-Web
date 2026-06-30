---
name: 趣聚平台 · 管理后台
description: Vue 3 admin dashboard for the Quju social activity platform — vibrant, clean, modern.
colors:
  brand: oklch(0.60 0.18 225)
  brand-light: oklch(0.78 0.12 220)
  brand-lighter: oklch(0.90 0.06 215)
  brand-bg: oklch(0.96 0.03 210)
  accent: oklch(0.72 0.15 70)
  accent-light: oklch(0.88 0.08 70)
  accent-bg: oklch(0.97 0.03 70)
  bg-page: oklch(0.975 0.005 240)
  bg-card: '#ffffff'
  sidebar-bg: '#ffffff'
  sidebar-text: oklch(0.45 0.02 250)
  sidebar-text-active: oklch(0.60 0.18 225)
  sidebar-hover-bg: oklch(0.96 0.03 220)
  sidebar-border: oklch(0.92 0.01 240)
  text-primary: oklch(0.18 0.01 250)
  text-secondary: oklch(0.45 0.02 250)
  text-muted: oklch(0.62 0.02 250)
  border-light: oklch(0.92 0.01 240)
  border-muted: oklch(0.95 0.01 240)
  success: oklch(0.62 0.15 155)
  warning: oklch(0.72 0.14 75)
  danger: oklch(0.60 0.18 25)
  info: oklch(0.55 0.02 250)
  table-header: oklch(0.975 0.008 240)
  table-hover: oklch(0.96 0.02 235)
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontWeight: 500
    fontSize: 15px
  heading:
    fontWeight: 700
    fontSize: 22px
  label:
    fontWeight: 500
    fontSize: 12px
    letterSpacing: 0.01em
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 28px
components:
  button-primary:
    backgroundColor: oklch(0.60 0.18 225)
    textColor: '#ffffff'
    rounded: 6px
    padding: 10px 20px
    fontWeight: 500
  button-primary-hover:
    backgroundColor: oklch(0.52 0.18 228)
  button-default:
    backgroundColor: transparent
    textColor: oklch(0.45 0.02 250)
    rounded: 6px
    fontWeight: 500
    border: 1px solid oklch(0.92 0.01 240)
  card-default:
    backgroundColor: '#ffffff'
    rounded: 10px
    border: 1px solid oklch(0.92 0.01 240)
    boxShadow: 0 1px 2px oklch(0 0 0 / 0.04)
  input-default:
    backgroundColor: '#ffffff'
    rounded: 6px
    border: 0 0 0 1px oklch(0.92 0.01 240) inset
    textColor: oklch(0.18 0.01 250)
    placeholderColor: oklch(0.62 0.02 250)
  tag:
    rounded: 4px
    fontWeight: 500
    border: none
  dialog:
    rounded: 14px
    boxShadow: 0 8px 24px oklch(0 0 0 / 0.08)
  sidebar-menu-item:
    rounded: 8px
    height: 42px
    fontWeight: 500
  sidebar-menu-item-active:
    backgroundColor: oklch(0.93 0.04 220 / 0.4)
    textColor: oklch(0.60 0.18 225)
    fontWeight: 600
  sidebar-menu-item-hover:
    backgroundColor: oklch(0.96 0.03 220)
---

# Design System: 趣聚平台 · 管理后台

## 1. Overview

**Creative North Star: "The Clear Desk"**

A management dashboard that feels like sitting down at a clean, sunlit desk — everything in its place, nothing demanding attention that doesn't deserve it. The interface serves the task, not the brand. Color is used as a deliberate signal for interaction and information hierarchy, not as decoration. The system is crisp without being cold, friendly without being casual.

This design explicitly rejects the "dark sidebar + gray data table" enterprise trope. Instead, it uses a pure white sidebar (borrowed from modern tools like Notion and Linear) paired with a vibrant cyan-blue accent extracted from the product logo. The amber secondary accent adds warmth without competing.

**Key Characteristics:**
- **White sidebar** as the primary navigation container, with a thin border-right and subtle shadow to separate from content
- **Cyan-blue brand accent** (oklch 0.60 0.18 225) used for primary actions, active nav indicators, and the login card avatar
- **Amber accent** (oklch 0.72 0.15 70) as a warm secondary cue for warnings and demo mode
- **Rounded but restrained**: 10px cards, 8px menu items, 6px buttons — no pill-shaped over-rounding
- **Transitions**: 200–250ms cubic-bezier(0.4, 0, 0.2, 1) standard, page-fade at 200ms
- **One type family** — system font stack renders crisply at Chinese text sizes
- **Flat-by-default** — shadows only on hover and elevated surfaces (modals, dropdowns)

## 2. Colors

The palette is Restrained: tinted cool neutrals with one vibrant cyan-blue accent used on <15% of any given surface.

### Primary
- **Brand Blue** (oklch 0.60 0.18 225): Primary button, active sidebar menu item (background + text + indicator bar), focused input ring, link/breadcrumb hover, header avatar gradient. Extracted from the product logo's cyan-blue (#4fc3f7) tweaked toward slightly deeper chroma.
- **Brand Blue Light** (oklch 0.78 0.12 220): Hover states, secondary fill, avatar gradient complement.
- **Brand Blue Lighter** (oklch 0.90 0.06 215): Subtle tinted backgrounds, tag/surface hints.
- **Brand Blue BG** (oklch 0.96 0.03 210): Barely-tinted hover surface for brand-affiliated areas.

### Accent (Secondary)
- **Warm Amber** (oklch 0.72 0.15 70): Warning semantics, demo mode button border+hover, tag (warning type), alert calls-to-action.
- **Amber Light** (oklch 0.88 0.08 70): Warning backgrounds (tag fill, card callout).
- **Amber BG** (oklch 0.97 0.03 70): Alert container background.

### Neutral
- **Page Background** (oklch 0.975 0.005 240): Slightly cool-tinted off-white. Almost imperceptibly blue-shifted from pure white to reduce eye strain during extended admin sessions.
- **Card White** (#ffffff): Primary surface for cards, sidebar, header, dialogs.
- **Text Primary** (oklch 0.18 0.01 250): Body text, table content, headings. High contrast.
- **Text Secondary** (oklch 0.45 0.02 250): Labels, secondary info, breadcrumb current page.
- **Text Muted** (oklch 0.62 0.02 250): Placeholder text, secondary breadcrumb links, empty-state descriptions.
- **Border Light** (oklch 0.92 0.01 240): Card outlines, divider lines, input default state.
- **Border Muted** (oklch 0.95 0.01 240): Cell dividers, sub-group borders.

### Semantic
- **Success Green** (oklch 0.62 0.15 155): Approved/published tags, "Restore" actions, success trend arrows.
- **Warning** (oklch 0.72 0.14 75): Pending review tags, moderation status.
- **Danger** (oklch 0.60 0.18 25): Rejected/banned tags, "Take down" / "Ban" actions, error trend arrows.
- **Info** (oklch 0.55 0.02 250): Neutral informational tags.

### The One-Voice Rule
Brand blue appears on ≤15% of any given screen. Its rarity is the point — when it appears (primary button, active nav item, focused input), it means "you can interact here." Overuse would collapse the signal into noise.

### The Table Header Rule
Table headers sit at oklch(0.975 0.008 240) — a whisper of cool tint that distinguishes them from data rows without competing. They are not gray.

## 3. Typography

**Body Text:** System font stack — with PingFang SC and Microsoft YaHei as the CJK-priority faces, then Apple/Google system sans as fallback.

**Character:** One-family system stack. No external fonts, no CLS cost, no friction. The stack is ordered for Chinese-reader legibility first (PingFang > Microsoft YaHei) with the standard Western sans fallback. At 14px (body), Chinese characters render with balanced density and crisp stroke terminals.

### Hierarchy
- **Heading** (700, 22px, 1.3): H2 page titles. Only used once per page in the page-header area.
- **Title** (600, 15-16px, 1.4): Card headers, dialog titles, section labels.
- **Body** (400, 14px, 1.5): Table content, form labels, paragraph text, menu items.
- **Small** (400, 13px, 1.4): Breadcrumbs, secondary descriptions, pagination text.
- **Label** (500, 12px, 1): Tag text, stat card labels, small metadata.
- **Stat Value** (700, 26-28px, 1.2): Data values in stat cards.

### The No-Fluid Rule
No clamp() anywhere. Product UIs at consistent viewport sizes don't need fluid typography. Headings are fixed px values.

## 4. Elevation

The system is **flat by default, layered on demand**. It uses a three-tier shadow vocabulary to communicate depth only when it carries meaning — no decorative shadows on surfaces at rest.

### Shadow Vocabulary
- **Shadow sm** (`0 1px 2px oklch(0 0 0 / 0.04)`): Default card state at rest.
- **Shadow md** (`0 4px 12px oklch(0 0 0 / 0.06)`): Card hover, dropdown menus.
- **Shadow lg** (`0 8px 24px oklch(0 0 0 / 0.08)`): Modal dialog, elevated panel.
- **Shadow sidebar** (`1px 0 8px oklch(0 0 0 / 0.05)`): Sidebar-right separator glow.

### The Flat-By-Default Rule
Surfaces are flat at rest. Shadows appear only as a response to state (hover on cards, open modal, dropdown open). A card with `shadow-sm` should be the lightest possible visible container distinction — if the border already signals the boundary, you may not even notice the shadow. That is correct.

## 5. Components

### Buttons
- **Shape:** Rounded rectangle (6px radius). Full-width buttons (login) use 10px for emphasis.
- **Primary:** Brand blue background, white text, no border. Hover: brightens by 8% filter. Active: darker shade.
- **Default:** Transparent background, secondary text, 1px solid border-light. Hover: brand-ish border + hover bg.
- **Text/Link:** No background, no border, inline with content. Types: primary (brand), success (green), warning (amber), danger (red). Consistent 12-13px small size.
- **Dashed (Demo):** Dashed light border, muted text. Hover: amber border + amber-bg background. Distinctive affordance that says "this is a non-standard path."

### Tags / Status Pills
- **Style:** Small (12px), plain effect, round (4px border-radius). No border. Bold-enough text weight (500).
- **Semantic colors:** success (green), warning (amber), danger (red), info (gray). Each with a matching background tint (effect="plain") and matching text in the semantic hue.
- **Usage:** Only for status indicators in tables and list items. Not for filtering, categorization, or decoration.

### Cards
- **Corner Style:** Rounded (10px radius).
- **Background:** Pure white (#fff).
- **Border:** 1px solid border-light.
- **Shadow Strategy:** `shadow-sm` at rest, `shadow-md` on hover. The hover lift translates 2px upward.
- **Internal Padding:** 20px content area.
- **Nesting:** Nested cards are always wrong. Use a different affordance (callout, filled section) for sub-containers.

### Inputs / Fields
- **Style:** White background, 1px border (border-light) via inset `box-shadow`, 6px radius.
- **Hover:** Border shifts to brand-light (oklch 0.78 0.12 220).
- **Focus:** 1.5px brand-blue border inset. No glow, no shadow.
- **Placeholder:** Text-muted (oklch 0.62 0.02 250) for contrast compliance (~4.5:1 against white). The common failure mode of near-invisible placeholder is explicitly avoided.
- **Disabled:** Fill at `oklch(0.97 0.01 240)`, text at muted.

### Dialogs
- **Style:** Centered modal, 14px border-radius, `shadow-lg`. No backdrop blur.
- **Header:** 22px top padding, 24px horizontal. Title weight 600.
- **Body:** 16px top, 24px horizontal, 20px bottom.
- **Footer:** 0/24/20 (left/right/bottom). Right-aligned action buttons.
- **Backdrop:** Semi-transparent dark (`rgba(0,0,0,0.3)`). No blur.

### Tables
- **Style:** Borderless within a card container. The card border wraps the table.
- **Header Row:** Transparent background (no fill). Bold weight (600), secondary text color.
- **Striped Rows:** Even rows at `oklch(0.985 0.005 240)` — barely perceptible alternating.
- **Hover Row:** `oklch(0.96 0.02 235)` — a whisper of brand tint.
- **Font:** 14px body, 500 bold for activity names.

### Sidebar Navigation
- **Background:** Pure white with 1px right border (sidebar-border) and a subtle right shadow.
- **Logo area:** 64px tall, centered, with border-bottom separator.
- **Menu items:** 8px border-radius, 42px height, 10px horizontal margin, 14px font, 500 weight.
- **Active state:** Tinted blue background (oklch 0.93 0.04 220 / 0.4), brand-blue text, 3px left color bar indicator.
- **Hover state:** Subtle blue-gray tint (sidebar-hover-bg).
- **Collapse button:** Bottom of sidebar, separated by top border. Label "收起侧栏" next to fold icon.

### Breadcrumb
- **Style:** Inline text with separator dots. Single line, 13px, muted color.
- **Hover:** Brand blue on clickable items.
- **Current page:** Secondary text color, 500 weight, no link.

## 6. Do's and Don'ts

### Do:
- **Do** use brand blue for one primary action per view — and only one.
- **Do** keep the white sidebar white. No dark mode sidebar.
- **Do** use semantic colors (green/amber/red) consistently for status tags across all pages.
- **Do** let table text breathe — adequate column padding, visible row separation via subtle striping.
- **Do** use the breadcrumb + page header + content-card pattern on every list/detail page.
- **Do** test text contrast, especially placeholder text against white backgrounds.
- **Do** respect prefers-reduced-motion: page-fade becomes instant, hover lifts become color-only.

### Don't:
- **Don't** use dark sidebar backgrounds. The "dark sidebar + gray table" is the enterprise anti-pattern we explicitly reject.
- **Don't** use gradient text (`background-clip: text`) anywhere. It's decorative, never meaningful.
- **Don't** use side-stripe borders (border-left/right >1px as colored accent on cards/list items).
- **Don't** use muted gray (sub-4.5:1 contrast) for body text. Light gray "for elegance" makes admin users squint.
- **Don't** over-round things. Buttons are 6px, not 9999px. Cards are 10px, not 16px.
- **Don't** animate transitions slower than 250ms for product UI. Users are working, not watching.
- **Don't** use display or novelty fonts in UI labels, buttons, or data. System stack only.
- **Don't** stack cards inside cards. Use a filled background section or a separate container.
- **Don't** put numbered section markers (01/02/03) as section eyebrows. They don't carry information here.
- **Don't** use glassmorphism (backdrop blur + transparency) as a decorative default.
