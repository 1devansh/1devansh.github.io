---
title: "Rebase vs merge: when it actually matters"
date: 2026-01-28
tags: ["git", "workflow"]
---

The rebase vs. merge debate is mostly noise. Here's when it actually matters:

Use **rebase** for local feature branches before opening a PR. It keeps history linear and makes code review easier.

Use **merge** for shared branches and when you want to preserve the context of when work was integrated.

Never rebase commits that have been pushed to a shared branch. That's the one rule that actually matters.
