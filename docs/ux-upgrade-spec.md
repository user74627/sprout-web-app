# Sprout Web UX Upgrade Spec

This document turns the current demo into a product-quality web experience while keeping the GitHub Pages demo link fast and no-login.

## Product Principles

- The pet should be the emotional center of every session.
- Tasks should feel lightweight to add and satisfying to complete.
- Rewards should be understandable before the user completes a task.
- Demo mode should be impressive within the first 30 seconds.
- The Firebase version should preserve the same UI, replacing only persistence/auth.

## Home

Current state: pet, health bar, coins, and today's active tasks.

Upgrade target:
- Hero dashboard with pet, mood, level, XP, health, streak, coins, and a daily progress ring.
- "Next best task" card that highlights the easiest available task to complete.
- Quick-add task CTA above the fold.
- Daily summary: completed today, active today, total rewards available.
- Empty state that teaches the loop: add task -> complete -> feed pet -> earn coins -> buy gear.

Success criteria:
- A first-time demo visitor understands the app without reading instructions.
- A returning user can complete a task in one tap from Home.

## Tasks

Current state: add/check/delete with difficulty and all/active/completed filters.

Upgrade target:
- Task fields: title, difficulty, category, due date, recurrence, notes.
- Filters: Today, Upcoming, Recurring, Completed.
- Sorting: due soon first, then difficulty/reward.
- Bulk completed history by day.
- Reward preview on every task.
- Duplicate-completion guard in both demo and backend.

Success criteria:
- Adding a task takes less than 15 seconds.
- Completed tasks stay visible enough to reinforce progress, but not clutter today's focus.

## Shop

Current state: static item grid, buy/equip, coin check.

Upgrade target:
- Categories: Hats, Face, Neck, Badges, Backgrounds.
- Item locks by level or streak.
- Owned/equipped filters.
- Live pet preview with selected item before buying.
- Clear coin shortfall copy.

Success criteria:
- Users can see what they are saving toward.
- Buying cannot double-spend or duplicate inventory.

## Profile / Progress

Current state: user card, pet card, basic stats, reset demo.

Upgrade target:
- Rename to Progress if the page becomes stat-focused.
- Weekly completion chart.
- Streak, best day, total XP, level, coins earned/spent.
- Pet timeline: recent mood changes and completed-task events.
- Settings section: pet name, demo reset, logout, notification preference when Firebase/mobile are enabled.

Success criteria:
- Users can understand their habit momentum at a glance.

## Onboarding

Demo mode:
- Auto-enter demo from GitHub Pages.
- Seed tasks and enough coins to try the shop.
- Banner explains that data is saved only in the visitor's browser.

Production mode:
- Auth page explains why accounts matter: save pet, sync devices, reminders.
- First run asks for pet name and first task.

## Visual Direction

- Keep the friendly soft-card design.
- Add richer but lightweight visuals: progress rings, pill stats, reward bursts, and more pet state feedback.
- Avoid adding heavy animation dependencies until core flows are stable.

