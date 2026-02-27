---
title: "Java records as DTOs: the gotcha with Jackson and no-arg constructors"
date: 2026-01-18
tags: [java, jackson, records]
---

Java records look perfect for DTOs. Immutable, concise, `equals`/`hashCode` for free. But if you're using Jackson for deserialization, there's a subtle issue: records don't have a no-arg constructor, and older Jackson versions (pre-2.12) can't deserialize them without extra config.

Even on 2.12+, you need the `jackson-module-parameter-names` module registered, and your project needs to be compiled with `-parameters` so Jackson can match JSON fields to constructor parameters by name.

```java
// This works only if parameter names are preserved at compile time
public record CreateOrderRequest(
    String customerId,
    List<LineItem> items,
    BigDecimal total
) {}
```

In Gradle:
```groovy
tasks.withType(JavaCompile) {
    options.compilerArgs.add('-parameters')
}
```

Without this, Jackson falls back to matching by position, which breaks silently when you refactor the field order. Spent an hour debugging a 400 error that turned out to be `customerId` and `items` getting swapped during deserialization.
