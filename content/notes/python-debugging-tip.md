---
title: "Python debugging: stop using print()"
date: 2026-02-25
tags: ["python", "debugging"]
---

I spent way too long using `print()` to debug Python code. The built-in `breakpoint()` function (Python 3.7+) drops you into `pdb` at that exact line. You can inspect variables, step through code, and evaluate expressions interactively. It's faster and you don't have to clean up print statements afterward.

```python
def process_data(items):
    breakpoint()  # drops into debugger here
    return [transform(item) for item in items]
```

For more complex debugging, `ipdb` gives you tab completion and syntax highlighting. Install it and set `PYTHONBREAKPOINT=ipdb.set_trace` in your environment.
