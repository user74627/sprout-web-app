# Sprout Brand Specification

## Product identity

Sprout is a warm, botanical habit companion. The plant pet is the primary identity asset and should remain the emotional center of the product.

## Assets

- App/favicon mark: `public/sprout.svg`
- Pet illustration and mood states: `src/components/Pet/Pet.jsx`
- Product UI reference: the existing React application and `everything.txt`

## Color roles

- Forest: `#173C2B` — primary ink and deep brand surface
- Leaf: `#5DA84A` — growth, completion, health, and primary action
- Moss: `#3F7F3B` — depth and interactive emphasis
- Parchment: `#F8F4E9` — canvas
- Soil: `#6B5745` — secondary ink
- Sun: `#E8B73E` — XP, coins, celebration
- Coral: `#D9684C` — hard tasks and destructive emphasis

## Typography

DM Sans is the current product typeface and remains the body and display family for this iteration. Display settings use heavier weights, tighter tracking, and larger contrast to create a more characterful hierarchy without adding another network dependency.

## Shape and material

- Habitat and hero shapes: 24–32px radii
- Cards and modules: 16–20px radii
- Controls: 12–16px radii, with pill shapes reserved for compact status
- Depth comes from warm tonal layering, hairline borders, and soft botanical shadows

## Motion

- State feedback: 140–220ms
- Panels and task completion: 240–420ms spring movement
- Pet idle motion: slow 3–5 second breathing cycle
- All nonessential motion is disabled when reduced motion is requested

## Protected identity contracts

- Keep the Sprout name, plant pet, warm green/soil palette, and reward-garden language
- Keep existing task, reward, shop, demo, Firebase, and route behavior
- Do not replace the pet or logo with unrelated decorative artwork
