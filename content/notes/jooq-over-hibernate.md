---
title: Why I reach for jOOQ over Hibernate for read-heavy services
date: 2026-02-12
tags: [java, jooq, hibernate, databases]
---

Hibernate is great when your domain model maps cleanly to your schema and you're doing mostly CRUD. But in read-heavy services where you need complex joins, projections, and aggregations, it fights you more than it helps.

The N+1 problem is the classic example, but the deeper issue is that Hibernate's abstraction assumes you want to work with entities. When you just need a flat projection for an API response, you end up writing JPQL that's basically SQL with extra steps, or dropping down to native queries and losing type safety.

jOOQ gives you type-safe SQL that maps directly to what the database is actually doing. You write the query you want, and you can see exactly what SQL gets generated. No lazy loading surprises, no unexpected queries in your logs.

The tradeoff is more boilerplate for writes. For services that are 80%+ reads (which is most of what I build), that tradeoff is worth it every time.
