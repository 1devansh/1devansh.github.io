---
title: Tracking down a 200ms GC pause in a latency-sensitive service
date: 2026-01-30
tags: [java, gc, performance]
---

Had a service with p99 latency spiking to 200ms+ every few minutes. The application logic was fine. Turned out to be G1GC's mixed collection phase kicking in when the old generation filled up.

The root cause was a cache implementation using `LinkedHashMap` that was holding references to large objects longer than necessary. G1 was promoting these to old gen, then doing expensive mixed collections to reclaim them.

Two things fixed it:

1. Switched to Caffeine with a `maximumWeight` policy so the cache evicted based on actual memory pressure, not just entry count.
2. Tuned `-XX:MaxGCPauseMillis=50` and `-XX:G1HeapRegionSize=16m` to give G1 better hints about our latency requirements.

p99 dropped to under 30ms. The lesson: when latency spikes are periodic and don't correlate with traffic, look at GC logs first. Enable them with `-Xlog:gc*:file=gc.log:time,uptime,level,tags` and check for long mixed collection pauses.
