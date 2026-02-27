---
title: "The SQL query that took 40 seconds (and the fix)"
date: 2026-02-10
tags: ["sql", "performance"]
---

Had a query joining three tables that took 40 seconds on a dataset of ~500K rows. The fix was embarrassingly simple: add an index on the foreign key column used in the `WHERE` clause. Query time dropped to 200ms.

Lesson: before reaching for query rewrites or caching, always check `EXPLAIN ANALYZE` first. Nine times out of ten, the problem is a missing index or an accidental full table scan.
