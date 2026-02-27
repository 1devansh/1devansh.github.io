---
title: AI Makes It Harder to Learn When You're Starting Out
date: 2026-02-20
tags: [engineering, ai, learning]
---

I've been writing code professionally for over four years now. I use Copilot daily. I use LLMs to debug, to explore unfamiliar APIs, to draft boilerplate. These tools genuinely make me faster.

But I had to earn the intuition first.

## The problem with shortcuts you take too early

When I was learning Java and building my first Spring Boot services, I had to sit with the confusion. I had to read stack traces line by line, understand why a `NullPointerException` was happening three layers deep in dependency injection, and figure out what `@Transactional` actually does under the hood.

That friction is where learning happens. Not in the answer, but in the search for it.

If I had Copilot autocompleting my code back then, I would have shipped things faster. But I wouldn't have understood why they worked. And when they broke in production at 2 AM, I wouldn't have known where to look.

## Borrowed understanding doesn't compound

Here's what I've noticed with junior engineers who rely heavily on AI from day one: they can produce code quickly, but they struggle to debug it. They can't explain why a particular pattern was chosen. They don't build the mental models that let you reason about systems when things go wrong.

AI gives you answers. But engineering is about developing judgment. Judgment comes from struggling with problems long enough that the patterns become second nature.

## When AI actually helps

Once you have a foundation, AI is a multiplier. I use it to:

- Explore unfamiliar libraries without reading 50 pages of docs
- Generate test scaffolding so I can focus on the actual test logic
- Quickly prototype ideas before committing to an approach
- Catch silly mistakes in code review

The key difference is that I can evaluate what it gives me. I know when the suggestion is wrong, when it's using an outdated pattern, or when it's solving the wrong problem entirely.

## What I'd tell someone starting out

Write code the hard way first. Build a project without Copilot. Debug without asking ChatGPT. Read the actual documentation. Sit with the discomfort of not knowing.

You'll be slower for a few months. But you'll build something that AI can't give you: real understanding of the systems you're working with. And that understanding is what separates engineers who can maintain and evolve complex systems from those who can only generate code.

The tools aren't going anywhere. You'll have plenty of time to use them. But the window for building deep intuition is early in your career, and it closes faster than you think.
