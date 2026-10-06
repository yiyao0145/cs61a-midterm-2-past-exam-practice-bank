# CS61A Midterm 2 Past Exam Practice Bank

A local, interactive practice site for CS61A Midterm 2 material. Every
problem is converted from a real past-exam question (originally
fill-in-the-blank, multiple-choice, or WWPD) into a full coding
implementation problem, while preserving the algorithm/concept, provided
helpers, restrictions, and representative examples from the source exam.

Python runs entirely in the browser via [Skulpt](https://skulpt.org) — no
install, no backend, no build step.

## Use it

```bash
python3 -m http.server 8743
```

then open http://localhost:8743. (Opening `index.html` directly as a
`file://` URL is blocked by some browsers' security policy, so a tiny
static server is the simplest way to run it.)

Pick a problem from the sidebar (filterable by topic), write your
solution, and click **Run tests**. Progressive **Hints**, **Reset code**,
and **Show solution** (with an explanation of the idea and common
mistakes) are available for every problem. Your code and best score per
problem are saved in your browser's local storage.

## What's in the bank

20 problems across Recursion, Tree Recursion, Lists & Dicts, Linked
Lists, Mutation, Higher-Order Functions, and Iterators & Generators —
see the sidebar for the full list. Each problem's "source" line credits
the original exam question it was converted from.

## Files

- `index.html` — the renderer: layout, editor, test runner, hints,
  solutions, filters. You shouldn't need to touch this to add problems.
- `questions.js` — the question bank (`QUESTION_BANK = {prelude, problems}`).
  All problem content lives here, completely separate from the renderer.

## Adding another exam

Hand this project (or Claude, if you're using it) another exam file and
say "add these questions to the bank." Concretely, each new problem is
one object appended to the `problems` array in `questions.js`:

```js
{
  id: "topic-shortname",        // unique, kebab-case
  topic: "Recursion",           // groups problems in the sidebar
  level: 2,                     // 1-4 stars of difficulty
  title: "Problem Title",
  source: "Honest citation of where this came from",
  prompt: [`<p>-ready html strings, one per paragraph`],
  examples: `doctest-style text shown in the Examples box`,
  provided: `optional extra Python source (helper functions/classes)
             shown in "Provided code" and spliced into every test run,
             in addition to the global prelude (Link/ll)`,
  starter: `def f(...):\n    """docstring with doctest"""\n    # YOUR CODE HERE\n`,
  hints: [`progressive hint 1`, `hint 2`, `hint 3`],
  solution: `a correct, idiomatic reference implementation`,
  tests: [
    { setup: ``, expr: `f(1, 2)`, expected: `3` },
    // expected is literal Python SOURCE (compared via repr), not a JSON
    // value. For plain ints/lists/strings/bools/tuples, this is just
    // Python's own repr() of the expected value. For linked lists, write
    // "ll(1, 2, 3)" or "Link.empty" instead (Link's own repr isn't valid
    // Python source).
  ],
  idea: `one paragraph explaining the approach`,
  mistakes: [`common mistake 1`, `common mistake 2`, ...]
}
```

Guidelines carried over from how the first 20 problems were built:
- Convert every original format (fill-in-blank, multiple choice, WWPD,
  etc.) into a full implementation problem whenever that's possible
  without giving away the algorithm. The starter code should only ever
  contain the signature, docstring, and a `# YOUR CODE HERE` placeholder
  — never a partially-filled function body.
- Before trusting a converted solution, verify it against the original
  exam's own doctest examples by actually running it, not just by
  eyeballing it — a few of the trickier mutation/backtracking solutions
  in this bank only turned out correct after being run.
- Hidden tests should cover the given examples plus base cases, normal
  cases, edge cases, and cases that specifically catch the mistakes
  listed in `mistakes`.
- `topic` strings should match an existing one when the concept matches
  (so problems group together in the sidebar) — currently: Recursion,
  Tree Recursion, Lists & Dicts, Linked Lists, Mutation, Higher-Order
  Functions, Iterators & Generators.

## License

MIT, see [LICENSE](LICENSE). The site's code (not the underlying CS61A
problem concepts, which predate this project) is original work.
