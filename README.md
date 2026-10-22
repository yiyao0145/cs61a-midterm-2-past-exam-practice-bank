# CS61A Midterm 2 Past Exam Practice Bank

Twenty standalone coding problems for CS61A Midterm 2. Each one is converted
from a real past-exam question (originally fill-in-the-blank, multiple choice
or WWPD) into a full coding problem, keeping the algorithm, provided helpers,
restrictions and representative examples from the source exam.

Python runs entirely in your browser via [Skulpt](https://skulpt.org). There is
nothing to install and no backend.

## Run it

```bash
python3 -m http.server 8743
```

Then open http://localhost:8743.

Pick a problem in the sidebar (filter by topic), write the whole function, and
click **Run tests**. Every problem has progressive **Hints**, **Reset code**,
and **Show solution** with the idea behind it and common mistakes. Your code and
best score per problem are saved in your browser.

The bank covers Recursion, Tree Recursion, Lists & Dicts, Linked Lists,
Mutation, Higher-Order Functions, and Iterators & Generators.

## Files

- `index.html` - the page: editor, test runner, hints, solutions, filters.
- `questions.js` - all the problem data, kept separate from the page.
- `theme.css`, `theme.js` - the look, with a light/dark toggle.

## Adding a problem

Append an object to the `problems` array in `questions.js`:

```js
{
  id: "topic-shortname",   // unique
  topic: "Recursion",      // groups problems in the sidebar
  level: 2,                // 1-4 difficulty
  title: "Problem Title",
  source: "Where this came from",
  prompt: [`html paragraph`],
  examples: `doctest-style text`,
  provided: `optional helper code shown and run with every test`,
  starter: `def f(...):\n    """docstring"""\n    # YOUR CODE HERE\n`,
  hints: [`hint 1`, `hint 2`],
  solution: `reference implementation`,
  tests: [{ setup: ``, expr: `f(1, 2)`, expected: `3` }],  // expected is Python source
  idea: `why the solution works`,
  mistakes: [`common mistake`]
}
```

Starter code should hold only the signature, docstring and `# YOUR CODE HERE`.
For linked-list results write `expected` as `ll(1, 2, 3)` or `Link.empty`.

## License

MIT, see [LICENSE](LICENSE).
