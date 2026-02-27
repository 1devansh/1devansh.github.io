---
title: Virtual threads and synchronized blocks don't mix
date: 2026-02-24
tags: [java, concurrency, loom]
---

If you're using Java 21 virtual threads with `synchronized` blocks that do blocking I/O inside them, the virtual thread gets pinned to its carrier thread. This defeats the entire purpose of virtual threads because you're back to blocking an OS thread.

The fix is to replace `synchronized` with `ReentrantLock`. Virtual threads can unmount from the carrier when parked on a `ReentrantLock`, but not when blocked on a monitor (which is what `synchronized` uses internally).

```java
// Bad: pins the virtual thread
synchronized (lock) {
    resultSet = statement.executeQuery();
}

// Good: virtual thread can unmount while waiting
reentrantLock.lock();
try {
    resultSet = statement.executeQuery();
} finally {
    reentrantLock.unlock();
}
```

You can detect pinning at runtime with `-Djdk.tracePinnedThreads=short`. Worth running this in staging if you're migrating to virtual threads.
