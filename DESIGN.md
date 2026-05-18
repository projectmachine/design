---
name: Open Design
description: A warm, collaborative design platform where mixed teams work alongside AI without friction.
colors:
  fired-clay: "#c96442"
  fired-clay-deep: "#b45a3b"
  fired-clay-soft: "#f5d8cb"
  fired-clay-tint: "#fbeee5"
  warm-chalk: "#faf9f7"
  warm-white: "#ffffff"
  cool-whisper: "#eef1f5"
  cool-mist: "#e4e8ef"
  charcoal-veil: "#1a1916"
  charcoal-deep: "#0d0c0a"
  warm-stone: "#74716b"
  stone-soft: "#989590"
  stone-faint: "#b3b0a8"
  border-default: "#e1e5eb"
  border-strong: "#c9d0da"
  border-soft: "#edf0f4"
  selection-blue: "#2563eb"
  status-green: "#1f7a3a"
  status-red: "#9c2a25"
  status-amber: "#b26200"
  status-purple: "#6c3aa6"
typography:
  display:
    fontFamily: "'Source Serif Pro', 'Source Serif 4', 'Iowan Old Style', 'Apple Garamond', Georgia, serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Source Serif Pro', 'Source Serif 4', 'Iowan Old Style', 'Apple Garamond', Georgia, serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "13.5px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.04em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "14px"
  lg: "24px"
  xl: "36px"
components:
  button-primary:
    backgroundColor: "{colors.fired-clay}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-primary-hover:
    backgroundColor: "{colors.fired-clay-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-primary-ghost:
    backgroundColor: "{colors.warm-white}"
    textColor: "{colors.fired-clay}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-veil}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-subtle:
    backgroundColor: "{colors.cool-whisper}"
    textColor: "{colors.charcoal-veil}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  input-default:
    backgroundColor: "{colors.warm-white}"
    textColor: "{colors.charcoal-veil}"
    rounded: "{rounded.sm}"
    padding: "7px 10px"
---

# Design System: Open Design

## 1. Overview

**Creative North Star: "The Open Studio"**

Open Design is a workspace where design thinking happens collectively, in the open, without discipline gatekeeping. The visual system reflects this: warm surfaces that feel like shared space, not cold software. Honest materials — no decorative grain, no manufactured "depth," no chrome that performs capability before delivering it. The accent is a single fired clay that shows up only where action lives. Everything else earns its presence by being useful.

The palette is warm but not precious. Neutrals are bone and chalk rather than clinical white or tech-gray, creating the ambient warmth of a studio with good light rather than a dashboard at 2am. The serif headline moments (brand name, home hero) are the only typographic flourish, anchoring the product's identity without shouting. Body type is the system stack at 13.5px — compact, readable, tool-native.

This system explicitly rejects the aesthetic of interchangeable B2B SaaS: the purple-tinted off-whites, the rounded card grids, the flat neutral everything. It equally rejects the AI-hype aesthetic: no glowing gradients, no neon on dark, no decorative flourishes that signal "made by machine." Capability is communicated through calm precision, not visual drama.

**Key Characteristics:**
- Single accent color (Fired Clay) on fewer than 10% of any surface
- Warm-neutral surfaces in light mode; rich charcoal-brown in dark mode — never cold gray
- Flat-by-default elevation; shadows appear only where UI is structurally lifted
- Serif type reserved for brand and hero moments; UI chrome uses system sans
- 120ms transitions on all state changes; no choreography, no bounce
- Dense, information-rich layout appropriate for a professional tool

## 2. Colors: The Fired Clay Palette

One accent does all the work. Everything else steps aside.

### Primary
- **Fired Clay** (`#c96442`): The action color for all of Open Design's own chrome — primary buttons, focus rings, active states. Named for its earthy, artisanal warmth. Used sparingly; its rarity is what gives it authority.
- **Fired Clay Deep** (`#b45a3b`): The hover and strong-emphasis variant. Slightly cooler and darker, creating readable contrast without shifting hue character.
- **Fired Clay Soft** (`#f5d8cb`): Background tint for selected/highlighted states. Appears behind active fidelity cards or accent-adjacent surfaces.
- **Fired Clay Tint** (`#fbeee5`): The palest wash. Used for ghost button hover states and very subtle accent proximity tints.

### Neutral
- **Warm Chalk** (`#faf9f7`): The app surface. Perceptibly warm against pure white — prevents the layout from reading as a blank document editor.
- **Warm White** (`#ffffff`): Panel and card backgrounds. The step up from Warm Chalk; creates tonal hierarchy without a shadow.
- **Cool Whisper** (`#eef1f5`): Hover state backgrounds, subtle surfaces, second-level differentiation. Slightly cool-leaning to offset the warm accent.
- **Cool Mist** (`#e4e8ef`): Third level; muted backgrounds for inactive or secondary zones.
- **Charcoal Veil** (`#1a1916`): Body text. Warm near-black — never pure `#000`.
- **Charcoal Deep** (`#0d0c0a`): Strong text (headings, emphasized labels). The darkest value in the system.
- **Warm Stone** (`#74716b`): Muted text. Metadata, secondary labels, placeholder context. The workhorse supporting tone.
- **Stone Soft** (`#989590`), **Stone Faint** (`#b3b0a8`): Finer muted gradations for tertiary labels and decorative separators.
- **Border Default** (`#e1e5eb`): Standard border between panels, cards, and sections.
- **Border Strong** (`#c9d0da`): Emphasized border for inputs in focus-adjacent states and strong dividers.
- **Selection Blue** (`#2563eb`): Focus ring and selected-state color, intentionally distinct from Fired Clay. When a CTA and a selected state coexist on the same screen, neither competes with the other.

### Tertiary (Semantic Status)
Status-only: never decorative, never mixed into primary content chrome.
- **Status Green** (`#1f7a3a`) with pale green bg (`#e8f7ee`): Success, connected, live.
- **Status Red** (`#9c2a25`) with pale red bg (`#fdecea`): Error, destructive, disconnected.
- **Status Amber** (`#b26200`) with pale amber bg (`#fff3e0`): Warning, pending, degraded.
- **Status Purple** (`#6c3aa6`) with pale purple bg (`#f3ecf9`): AI agent activity, plugin states.

### Named Rules
**The Fired Clay Rule.** The primary accent appears on fewer than 10% of any given screen. It belongs to CTAs, focus rings, and active indicators — not decoration, not background fills, not borders on cards. When everything is accent, nothing is action.

**The Two-Blue Doctrine.** `#2563eb` (Selection Blue) and `#c96442` (Fired Clay) are both "active" signals, but they serve different semantics. Fired Clay means "do this." Selection Blue means "this is selected." Never substitute one for the other; use them on the same screen when needed.

**The Warm Neutral Rule.** No surface in this system is pure `#000` or pure `#fff`. The warmth in the neutrals is what distinguishes the studio from a blank document. Even `--bg-panel: #ffffff` reads as white-ish against `#faf9f7`, not as pure white against gray.

## 3. Typography

**Display/Headline Font:** Source Serif Pro (fallbacks: Source Serif 4, Iowan Old Style, Apple Garamond, Georgia, serif)
**Body/UI Font:** System sans-serif stack (Inter, Segoe UI, Roboto, Helvetica Neue — platform-native)
**Mono Font:** System monospace (SF Mono, Menlo, Consolas)

**Character:** The serif is a guest, not a resident. It appears for brand and hero moments — the "Open Design" wordmark on the home screen, the hero prompt title — then steps back and lets the system sans run the product. This pairing avoids the premium-but-inaccessible feel of full-serif UI while giving the product a distinctive identity anchor. The system sans stack keeps the tool feeling native and fast rather than font-heavy.

### Hierarchy
- **Display** (600 weight, 30px, line-height 1.2, tracking −0.02em): Hero headings on the home screen. Serif stack. Reserved for the single branded moment per view.
- **Headline** (600 weight, 16px, line-height 1.3): Section headings, brand name in the top bar. Serif stack. Max two per screen.
- **Title** (600 weight, 13.5px, line-height 1.4, tracking −0.01em): Panel headers, modal titles, list group labels. System sans. The dominant heading level in the UI.
- **Body** (400 weight, 13.5px, line-height 1.5): All prose, descriptions, chat messages, comment text. System sans. Line length target 65–75ch in reading contexts.
- **Label** (600 weight, 11px, tracking +0.04em): Eyebrows, status pills, group labels, secondary nav labels. All-caps when used as category markers; sentence-case for action labels.

### Named Rules
**The Serif Reserve.** The serif is used in exactly two contexts: the brand name and the home hero headline. Any new surface that reaches for the serif must justify it as a brand or editorial moment. Product UI chrome — panels, toolbars, lists, dialogs — uses system sans only.

**The Size Floor.** Nothing below 11px. Labels at 11px use weight 600 and tracking +0.04em to maintain legibility at that floor. Mono code uses 0.92em (relative to parent, never below 11px absolute).

## 4. Elevation

This system is flat by default. Tonal layering — surface stepping from Warm Chalk to Warm White to Cool Whisper — creates visual hierarchy at rest. Shadows are structural: they signal that a layer has lifted above the document plane, not that it wants to be noticed.

### Shadow Vocabulary
- **xs** (`0 1px 0 rgba(28,27,26,0.04)`): Micro-separation for primary buttons (the inset bottom-edge highlight). Not visible as a drop shadow; felt more than seen.
- **sm** (`0 1px 2px rgba(28,27,26,0.05), 0 1px 3px rgba(28,27,26,0.04)`): Hero prompt card at rest. Gentle elevation, barely above the surface.
- **md** (`0 6px 24px rgba(28,27,26,0.07), 0 2px 6px rgba(28,27,26,0.04)`): Focused prompt card, popovers, elevated panels. Signals interactivity.
- **lg** (`0 24px 60px rgba(28,27,26,0.16), 0 8px 16px rgba(28,27,26,0.07)`): Modals, dropdowns, floating menus. The highest structural layer.

In dark mode, all shadow values increase significantly (0.3–0.6 opacity) to compensate for the dark background reducing contrast differential.

### Named Rules
**The Flat-by-Default Rule.** Surfaces are flat at rest. A panel on top of another panel does not get a shadow — it gets a border and a background step. Shadows appear only when UI is physically lifted: dropdowns, modals, flyouts, floating elements. If you're tempted to add a shadow to a card, use a background tint instead.

**The Structural-Only Rule.** Shadows are not decorative. There are no glow effects, no "ambient light" shadow halos around accent elements, no colored shadows. The shadow tint is always the near-black base (`rgba(28,27,26,...)` in light mode, `rgba(0,0,0,...)` in dark), never the accent color.

## 5. Components

### Buttons
Buttons come in four variants. All share 8px radius, 6px 12px padding, 500 weight, and 120ms transitions.

- **Shape:** Gently rounded (8px radius). Not pill, not sharp. Approachable without being playful.
- **Primary** (bg: Fired Clay `#c96442`, text: white, subtle inset xs-shadow): The loudest affordance on any screen. Used for the single most important action — Create, Save, Submit. Never used for secondary or tertiary actions.
- **Primary hover/focus** (bg: Fired Clay Deep `#b45a3b`): Deepens without shift in hue.
- **Primary Ghost** (bg: white, border: Fired Clay, text: Fired Clay): For secondary accent actions that share a screen with Primary. Keeps the clay color family without the weight fill.
- **Ghost** (bg: transparent, border: Border Default, text: Charcoal Veil): Default secondary action. Blends into chrome; readable but not prominent.
- **Subtle** (bg: Cool Whisper, no border, text: Charcoal Veil): Tertiary or toolbar actions. The quietest button, used in dense UI where multiple actions compete.
- **Focus ring:** 2px solid Fired Clay, 2px offset. All variants share this.
- **Disabled:** 50% opacity. No special treatment.

### Inputs and Fields
Inputs are intentionally neutral — they should never compete with the Primary button.

- **Style:** 1px border (Border Default), 8px radius, 7px 10px padding, Warm White background.
- **Focus:** Selection Blue border (`#2563eb`) with a 3px soft blue glow ring (`rgba(37,99,235,0.16)`). Intentionally separate from Fired Clay so a focused input and a CTA can coexist on screen without color collision.
- **Special rule (entry sidebar):** Form fields in the entry sidebar use a quiet near-black focus treatment (3px `rgba(28,27,26,0.08)` halo) so the orange Create CTA stays the loudest element in the panel.
- **Placeholder:** Stone Faint (`#b3b0a8`).
- **Disabled:** 55% opacity.

### Cards and Containers
- **Corner Style:** Gently rounded (12px radius for mid-level containers; 16px for large featured cards and the hero prompt input).
- **Background:** Warm White (`#ffffff`) against Warm Chalk (`#faf9f7`) background — tonal separation without a shadow.
- **Shadow Strategy:** sm-shadow at rest for featured/interactive cards only (home hero prompt card). Standard content panels: border + background step, no shadow.
- **Border:** Border Default (`#e1e5eb`), 1px.
- **Internal padding:** 14–24px depending on content density.

### Navigation Rail
- **Style:** Icon-only, 56px wide, `bg-panel` background, 1px border-right separating it from main content.
- **Items:** 40×40px tap targets, 8px radius hover/active treatment in Cool Whisper.
- **Hover labels:** Slide-in tooltips appear to the right of the rail on hover. Text-only, no icon.
- **Active state:** Fired Clay icon color, no background fill. The color alone is sufficient.

### Status Chips
Semantic-only: never decorative. Each has a paired text color, background, and border from the status family.

- **Structure:** Inline-flex, pill radius (999px), 4px 8px padding, 11px 600-weight label.
- **Green chip:** `#1f7a3a` text, `#e8f7ee` bg, `#c6ead2` border.
- **Red chip:** `#9c2a25` text, `#fdecea` bg, `#f5c6c2` border.
- **Amber chip:** `#b26200` text, `#fff3e0` bg. (No explicit amber border token — uses Border Default.)
- **Purple chip (AI/agent):** `#6c3aa6` text, `#f3ecf9` bg, `#e4d4f1` border.

### Home Hero Prompt Card (Signature)
The product's distinctive entry point. A centered large textarea container with rounded-lg (16px) radius and a focus state that blends the accent into the border.

- **At rest:** Border Default, shadow-sm, Warm White background.
- **On focus-within:** Border color blends `color-mix(in srgb, var(--accent) 40%, var(--border))`, shadow escalates to shadow-md.
- **On drag-active:** Deeper blend (56%), adds a 3px outer accent glow ring.
- The prompt card is max 720px wide, centered, with 14px internal padding.

## 6. Do's and Don'ts

### Do:
- **Do** use Fired Clay (`#c96442`) exclusively for primary CTAs, active indicators, and focus rings. Its rarity is its power.
- **Do** use tonal surface steps (Warm Chalk → Warm White → Cool Whisper) to create hierarchy before reaching for shadows or borders.
- **Do** keep body copy at 13.5px / 1.5 line-height minimum. Dense product UI is appropriate; illegible UI is not.
- **Do** use Selection Blue (`#2563eb`) for "currently selected" states so CTAs and selections can coexist without competing.
- **Do** restrict serif type (Source Serif Pro) to brand-identity and hero headline moments only.
- **Do** treat shadows as structural signals, not atmospheric decoration. A shadow means "this layer is floating."
- **Do** warm every neutral slightly. Backgrounds at `#faf9f7`, near-blacks at `#1a1916`, not `#fff` and `#000`.
- **Do** use status colors (green, red, amber, purple) with their matching bg/border pairs — never in isolation.
- **Do** set `prefers-reduced-motion` overrides for all transitions and animations.

### Don't:
- **Don't** use a muted purple or blue-gray as the primary accent. Generic SaaS cream — the Notion-clone off-white background with a muted purple-blue accent and rounded card grids — is explicitly what this system is not.
- **Don't** use gradient text, glassmorphism, glowing halos, neon-on-dark, or purple gradients. These signals belong to the AI-hype aesthetic that Open Design explicitly rejects. Capability is communicated through calm precision, not visual drama.
- **Don't** add shadows to resting panels or cards. A content card on a Warm Chalk background gets a border and a tonal background step, not a drop shadow.
- **Don't** use Fired Clay as a background fill for non-interactive surfaces, decorative borders, or section separators. The accent is for action only.
- **Don't** use `border-left` or `border-right` as a colored accent stripe on cards, list items, or callouts. Never. Use background tint, full border, or nothing.
- **Don't** let the serif type escape its reserved zones. Nav items, panel headers, input labels, and body copy are system sans territory.
- **Don't** use identical card grids as the primary layout pattern. Same-sized cards with icon + heading + text repeated endlessly is the anti-reference.
- **Don't** confuse the two blue values: Selection Blue (`#2563eb`) is for "is selected," and Fired Clay (`#c96442`) is for "do this." Substituting one for the other collapses the semantic distinction the system depends on.
