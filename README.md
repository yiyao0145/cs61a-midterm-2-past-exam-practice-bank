# CS61A Midterm 2 Past Exam Practice Bank

Two local, interactive study tools for CS61A Midterm 2. Python runs
entirely in the browser via [Skulpt](https://skulpt.org) — no install, no
backend, no build step.

| Page | What it is |
| --- | --- |
| `index.html` | **Practice bank** — 20 standalone coding problems, each converted from a past-exam question into a full implementation problem with hidden tests, hints, and a reference solution. |
| `exams.html` | **Past exams** — six real Midterm 2 exams (Spring 2023 → Fall 2025) in their original form, answerable on screen: multiple choice, select-all, WWPD, and fill-in-the-blank code. |

## Use it

```bash
python3 -m http.server 8743
```

then open http://localhost:8743. (Opening the files directly as `file://`
URLs is blocked by some browsers' security policy, so a tiny static
server is the simplest way to run them.)

## The practice bank (`index.html`)

Every problem is converted from a real past-exam question (originally
fill-in-the-blank, multiple-choice, or WWPD) into a full coding
implementation problem, while preserving the algorithm/concept, provided
helpers, restrictions, and representative examples from the source exam.

Pick a problem from the sidebar (filterable by topic), write your
solution, and click **Run tests**. Progressive **Hints**, **Reset code**,
and **Show solution** (with an explanation of the idea and common
mistakes) are available for every problem. Your code and best score per
problem are saved in your browser's local storage.

20 problems across Recursion, Tree Recursion, Lists & Dicts, Linked
Lists, Mutation, Higher-Order Functions, and Iterators & Generators. Each
problem's "source" line credits the question it was converted from.

## The past exams (`exams.html`)

Six complete exams, question by question, with the original point values
and question types intact — 176 answer blanks in total, plus a countdown
timer if you want to sit one under time.

- Multiple-choice, select-all, and short-answer responses are **checked
  automatically**.
- Fill-in-the-blank code questions have a **Run tests** button: your
  blanks are substituted into the real function and the exam's own
  doctests are executed.
- Every question also has a **Show answer** button with a worked solution
  and explanation.

**About those answers:** the exam PDFs ship without an answer key, so
every answer in `exams.html` is my own worked solution, not official
course material. Each one was verified by actually running the code —
all 44 code runners pass their doctests with the stated answers — but
they are not authoritative, and the UI labels them as such.

## Files

- `index.html` / `questions.js` — the practice bank and its question data.
- `exams.html` — the past-exam renderer: layout, inputs, checking, timer,
  and the Skulpt runner.
- `exam-data.js` — shared scaffolding: the `EXAM_BANK` object, the study
  guide reference, and the `Link`/`Tree` prelude used by every runner.
  The file's header comment documents the full data shape.
- `theme.css` / `theme.js` — the shared look for both pages: a dark
  terminal-style theme with a light-mode toggle that remembers your choice.
  Change colors in the `:root` variables at the top of `theme.css`.
- `exams/<term>.js` — one file per exam, each pushing one exam onto
  `EXAM_BANK.exams`. Add a new exam by dropping in a file and adding a
  `<script>` tag in `exams.html`.

## Adding more material

To add a **whole exam**, create `exams/<term>.js` following the shape
documented at the top of `exam-data.js`, then add a `<script>` tag for it
in `exams.html`. To add **individual practice problems**, append to the
`problems` array in `questions.js`:

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
