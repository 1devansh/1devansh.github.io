---
title: "Design your API for the caller, not the database"
date: 2026-01-15
tags: ["api", "design"]
---

Made this mistake early on: I designed REST endpoints that mirrored my database tables exactly. The result was an API that was easy to build but painful to consume. Clients had to make multiple requests and stitch data together themselves.

Better approach: think about what the frontend (or consumer) actually needs, then shape your response around that. It's okay if one endpoint pulls from three tables. The caller shouldn't have to know about your schema.
