# Orakl Brand & Motion Guide

**Status:** Working design authority  
**Scope:** Orakl platform homepage, shared platform surfaces, and the relationship between Orakl and its game brands.

---

## 1. Brand idea

Orakl is the calm, connected platform that holds multiple competitive game experiences.

The platform should feel:

- clear
- simple
- connected
- consistent
- punchy when interaction or competition calls for it

Orakl itself remains visually restrained. Individual games introduce stronger colour, energy and personality.

---

## 2. Product relationship

Orakl is the umbrella platform, not a betting product.

Predictor, Faux Stakes and future games are separate game experiences using shared platform capabilities such as identity, competitions, leaderboards and accounts.

The visual system should communicate the same distinction:

- **Orakl:** neutral, architectural, connected, calm
- **Games:** colourful, energetic, expressive, reactive

---

## 3. Core visual language

The shared Orakl language is built from:

- connected circular nodes
- straight or gently curved connecting lines
- generous whitespace
- warm neutral surfaces
- sharp typography
- controlled motion
- game colour introduced only with intent

The system should feel modern and digital without becoming cold or over-technical.

---

## 4. Colour system

### Platform colours

| Role | Colour | Value |
|---|---|---|
| Porcelain | Warm primary platform surface | `#F8F7F4` |
| White | Contrast surface and section background | `#FFFFFF` |
| Ink | Primary text | `#171717` |
| Charcoal | Neutral brand accent and node sculpture | `#272725` |
| Stone 500 | Muted text | `#75736D` |
| Stone 200 | Borders | `#DEDBD3` |

### Game colours

| Game | Brand colour | Soft colour |
|---|---|---|
| Predictor | Signal Blue `#0057FF` | `#EAF1FF` |
| Faux Stakes | Orange `#F05A28` | `#FFF0E9` |

Future games receive their own accent but must use the same interaction and surface rules.

### Colour hierarchy

- Porcelain establishes the Orakl platform.
- White separates and sharpens sections.
- Charcoal is the default Orakl colour.
- Saturated colours belong to games.
- A game colour should appear because a game is present, active, selected or hovered.

Avoid decorating neutral platform areas with arbitrary saturated colour.

---

## 5. Logo system

### 5.1 Flat Orakl Mark

The flat mark is the compact platform logo used in navigation, UI, favicons and small brand placements.

It retains the existing connected-node structure and adds a simple triangular trophy base:

- two additional lower nodes
- no bottom-middle node
- no handles
- no added internal complexity

The mark should continue to read primarily as a connected network and only secondarily suggest a trophy.

### 5.2 3D Orakl Node Motif

The homepage hero uses a separate 3D interpretation of the flat mark.

It is not a flat SVG extruded into space.

It is a spatial connected-node sculpture arranged in a trophy silhouette:

- nodes form a rounded cup volume
- nodes continue around the rear of the sculpture
- rods connect through real depth
- outer node structures form trophy handles
- the lower form narrows into a stem
- the base reflects the triangular character of the flat mark

The object should reveal its depth while rotating. It must never look like a flat network spinning on a vertical axis.

### Relationship between both marks

The flat and 3D marks share:

- the connected-node language
- a central vertical axis
- trophy-like proportions
- round nodes and clean connecting rods
- the same colour behaviour

They do not need identical node counts or geometry.

---

## 6. Homepage structure

### 6.1 Hero

**Background:** Porcelain

The hero introduces Orakl before introducing any game.

Content:

- Orakl platform headline
- concise supporting copy
- primary call to action
- large 3D node motif

The hero should not contain an energy-line motif. The 3D sculpture is the visual focus.

The sculpture begins in neutral charcoal and rotates slowly with a gentle float.

### 6.2 Game list

**Section background:** White  
**Card background:** Porcelain

Games appear as a horizontal list of cards. Each card represents a separate game homepage.

Each game card contains:

- game name
- short value proposition
- relevant action or directional cue
- game brand colour
- energy-line motif using that game colour

The energy line should be clearly visible but must not overpower the card content.

### 6.3 Platform information section

**Background:** Porcelain

This section explains the connected Orakl platform: shared identity, competitions, leaderboards and cross-game structure.

A faint neutral energy-line motif may appear as a background watermark.

It should support the idea of connection without becoming a focal animation.

---

## 7. Game card interaction

### Resting state

- Porcelain card
- game colour used selectively
- energy motif visible at restrained opacity
- limited or no shadow
- no continuous movement

### Hover or keyboard focus

The card:

- moves upward slightly
- gains a modest elevation increase
- strengthens its game-colour presence
- animates its energy motif

Recommended movement:

- translation: approximately `-6px` to `-8px`
- duration: `180ms` to `260ms`
- easing: smooth ease-out, not springy by default

### Homepage response

Hovering or focusing a game card temporarily changes the homepage accent to that game's brand colour.

The response may include:

- the 3D Orakl sculpture changing from charcoal to the game colour
- selected interactive accents adopting the game colour
- a restrained colour tint or glow in the immediate homepage environment

The entire page should not become a fully saturated game-colour background.

On pointer leave or focus loss, the homepage returns smoothly to neutral Orakl styling.

### Click behaviour

Clicking a game card navigates to that game's public homepage.

Examples:

- Predictor card → Predictor homepage
- Faux Stakes card → Faux Stakes homepage

The card must behave as a real accessible link, not a clickable `div`.

---

## 8. Energy-line motif

The energy line represents connection, activity and movement through the Orakl network.

### Homepage use

- never in the hero
- visible on game cards in the game's colour
- faint and neutral in the later platform-information section

### Game homepage use

On individual game pages, the energy line can become more active and expressive:

- animated flow travelling along a path
- node pulses as energy reaches them
- game-specific colour
- stronger visibility than on the platform homepage

### Visual rules

- prefer thin paths
- use a small number of meaningful nodes
- avoid random decorative tangles
- maintain visual direction and readable flow
- avoid full-screen constant motion
- do not animate every line simultaneously

The motif should feel designed, not procedurally noisy.

---

## 9. Motion language

Motion should communicate state, relationship or depth.

### Three.js / React Three Fiber

Use for:

- the hero's 3D node sculpture
- rotation
- subtle floating
- real depth and handle geometry
- colour transitions across the sculpture

### Anime.js

Use for:

- energy travelling through SVG paths
- line drawing or flow
- node pulses
- sequenced game-page motif animations

### CSS transitions

Use for:

- card lift
- shadows
- local colour transitions
- opacity
- focus and hover states

### Motion principles

- calm at rest
- responsive on interaction
- no movement without purpose
- avoid mechanical, fast spinning
- avoid excessive bounce
- avoid simultaneous competing animations

### Reduced motion

Respect `prefers-reduced-motion`:

- stop or greatly reduce sculpture rotation
- remove floating motion
- replace energy travel with a static highlighted path
- preserve colour and focus feedback

---

## 10. 3D sculpture behaviour

### Resting state

- neutral charcoal
- slow rotation, approximately one turn every 15–20 seconds
- slight tilt
- subtle vertical float
- no energetic pulses by default

### Game hover state

When a game card is hovered or focused:

- sculpture transitions to the game brand colour
- optional future enhancement: colour propagates through connected rods and nodes
- transition remains smooth and controlled

### Exit state

- return to charcoal
- no abrupt reset
- no accumulated spin speed or interaction momentum

---

## 11. Typography

Current direction:

- display/headings: Space Grotesk
- body/UI: Inter

Typography should remain clean and direct.

Use:

- compact heading tracking
- clear hierarchy
- short supporting paragraphs
- restrained uppercase labels

Avoid:

- overly playful display type
- long decorative headings
- dense marketing copy

---

## 12. Surface and elevation rules

### Porcelain

Use for:

- hero background
- game cards
- later platform-information section
- warm neutral branded areas

### White

Use for:

- the game-list section background
- raised UI surfaces where extra contrast is needed
- modals, menus and forms

### Elevation

- resting cards should remain quiet
- hover elevation should be modest
- shadows must stay neutral and soft
- avoid glassmorphism and heavy glow effects

---

## 13. Accessibility and interaction

- all game cards must be keyboard focusable links
- hover behaviour must also work on keyboard focus
- colour must not be the only signifier of state
- maintain sufficient text and control contrast
- decorative SVG motifs should use `aria-hidden="true"`
- the flat logo should retain an accessible title or label where appropriate
- touch devices should not depend on hover to reveal essential content

---

## 14. What belongs to Orakl vs a game

### Orakl owns

- Porcelain and white surface rhythm
- charcoal neutral state
- node-network visual language
- 3D trophy sculpture
- typography
- shared layout and interaction quality
- restrained platform energy motif

### Each game owns

- saturated accent colour
- stronger energy animation
- game-specific imagery and content
- product-specific landing-page personality
- game-specific state and competition visuals

This distinction should remain visible even when shared components are reused.

---

## 15. Avoid

- handles on the flat Orakl Mark
- a bottom-middle node in the flat trophy base
- a 3D mark that is merely a flat logo rotating
- energy lines in the homepage hero
- saturated colour across the whole homepage on hover
- permanent homepage theme changes caused by card hover
- motion that exists only as decoration
- unrelated visual styles between games
- turning Orakl itself into a game brand

---

## 16. Implementation order

1. Replace the existing flat `OraklMark` with the approved trophy-base SVG.
2. Rebuild the homepage surface order:
   - Porcelain hero
   - white game-list section
   - Porcelain game cards
   - Porcelain platform-information section
3. Add the horizontal game-card structure and real link navigation.
4. Add shared hover/focus accent state at homepage level.
5. Connect game accent state to the 3D sculpture colour.
6. Build the 3D trophy-shaped node cluster.
7. Add static energy motifs to game cards and platform information.
8. Add restrained card energy animation.
9. Add reduced-motion behaviour.
10. Expand the energy system on individual game homepages.

---

## 17. Agreed decisions

- The hero uses a Porcelain background.
- The hero contains the 3D node motif and no energy line.
- The game-list section uses a white background.
- Game cards use Porcelain backgrounds.
- Each game card uses its respective game colour and energy-line motif.
- The following information section returns to Porcelain.
- That later section may contain a faint energy-line motif.
- Hovering or focusing a game card lifts it slightly.
- Hovering or focusing temporarily changes the homepage accent to the game's brand colour.
- Leaving the card restores the neutral platform appearance.
- Clicking a card navigates to that game's public homepage.
- The flat logo has no handles and no bottom-middle node.
- The 3D hero motif has spatial handles and nodes arranged around a real trophy volume.

---

## 18. Deferred decisions

These are intentionally not finalised yet:

- exact 3D node count and coordinates
- final handle geometry
- exact hover tint coverage outside the card
- whether sculpture colour changes all at once or travels through the network
- final energy-line paths for each game
- exact copy and CTA text for the homepage sections
- mobile presentation of the horizontal game list

