// CS 61A Fall 2024 Midterm 2
EXAM_BANK.exams.push({
id: "fa24",
term: "Fall 2024",
points: 45,
questions: [

// ------------------------------------------------------------------ Q1
{
  num: 1, title: "What Would Python Display?", points: 5,
  intro: ["<p>Assume the following code has been executed.</p>"],
  code: `scare = Tree(0, [Tree(4), Tree(5, [Tree(10)]), Tree(2)])
crow = Tree(9, [scare, Tree(7, [Tree(6)])])

def climb(t, f):
    if t.is_leaf():
        return [t.label]
    return [t.label] + climb(max(t.branches, key=f), f)

def run(t):
    if t.is_leaf():
        return t.label
    else:
        return max(map(run, t.branches))

def hide(t):
    return t.label

jump = {(2 * x - 1): x for x in range(50)}`,
  after: ["<p>Write the value of each expression below or <i>Error</i> if an error occurs.</p>"],
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 1, prompt: "crow.branches[0].label", promptCode: true,
        type: "text", oneLine: true, answer: "0",
        explain: `<p><code>crow</code>'s first branch is <code>scare</code>, whose label is <code>0</code>.</p>`
      },
      {
        key: "b", label: "(b)", points: 1, prompt: "[hide(b) for b in scare.branches]", promptCode: true,
        type: "text", oneLine: true, answer: "[4, 5, 2]",
        explain: `<p><code>hide</code> just reads a label, so this collects the labels of <code>scare</code>'s three branches in order.</p>`
      },
      {
        key: "c", label: "(c)", points: 1, prompt: "climb(crow, hide)", promptCode: true,
        type: "text", oneLine: true, answer: "[9, 7, 6]",
        explain: `<p><code>climb</code> walks down from the root, each step taking the branch that maximizes <code>f</code>. With <code>f = hide</code>, that is the branch with the largest <i>label</i>: from <code>crow</code> (9) the branches are labelled 0 and 7, so it takes 7; from there the only branch is 6, which is a leaf.</p>`
      },
      {
        key: "d", label: "(d)", points: 1, prompt: "climb(crow, run)", promptCode: true,
        type: "text", oneLine: true, answer: "[9, 0, 5, 10]",
        explain: `<p>With <code>f = run</code>, each branch is scored by the largest <i>leaf</i> beneath it. From <code>crow</code>: the <code>scare</code> branch has leaves 4, 10 and 2 (max 10) while the other branch has only leaf 6, so it descends into <code>scare</code> (label 0). From <code>scare</code>, the branch containing 10 wins (label 5), then 10 is a leaf.</p>`
      },
      {
        key: "e", label: "(e)", points: 1, prompt: "jump[jump[13]]", promptCode: true,
        type: "text", oneLine: true, answer: "4",
        explain: `<p><code>jump</code> maps <code>2x - 1</code> to <code>x</code> for <code>x</code> in <code>range(50)</code>, i.e. odd keys to their index. <code>jump[13]</code> needs <code>2x - 1 == 13</code>, so <code>x</code> is 7. Then <code>jump[7]</code> needs <code>2x - 1 == 7</code>, so the value is 4.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q2
{
  num: 2, title: "Pizza by the Slice", points: 5,
  intro: ["<p>Answer the questions about the code below. (The original exam also supplied a blank environment diagram; the diagram itself was not scored.)</p>"],
  code: ` 1: def slice_up(s):
 2:     copy = s
 3:     t = [copy]
 4:     while len(s) > 1:
 5:         t.append(s[:len(s)-1])
 6:         s.pop()
 7:         s[0] = len(s)
 8:     return t
 9:
10: t = [3, 4, 5]
11: print(slice_up(t))
12: print(t)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 3, prompt: "What would be printed by the expression <code>print(slice_up(t))</code> on line 11?",
        type: "text", oneLine: true, answer: "[[1], [3, 4], [2]]",
        explain: `<p><code>copy = s</code> does <b>not</b> copy — both names refer to the same list, and <code>t</code> holds that very object, so whatever happens to <code>s</code> shows up in <code>t[0]</code> at the end.</p>
<ul>
<li>Start: <code>s</code> is <code>[3, 4, 5]</code>. Append the slice <code>[3, 4]</code> (a genuine copy), pop to <code>[3, 4]</code>, then <code>s[0] = len(s)</code> makes it <code>[2, 4]</code>.</li>
<li>Next round: append the slice <code>[2]</code>, pop to <code>[2]</code>, then <code>s[0] = 1</code> makes it <code>[1]</code>. Now <code>len(s)</code> is 1 and the loop ends.</li>
</ul>
<p>So <code>t</code> is <code>[s, [3, 4], [2]]</code> and <code>s</code> has ended up as <code>[1]</code>.</p>`
      },
      {
        key: "b", label: "(b)", points: 1, prompt: "What would be printed by the expression <code>print(t)</code> on line 12?",
        type: "choice",
        options: ["[1]", "[2]", "[3]", "[1, 4]", "[2, 4]", "[3, 4]", "[1, 4, 5]", "[2, 4, 5]", "[3, 4, 5]"],
        answer: "[1]",
        explain: `<p>The global <code>t</code> is the list that was passed in as <code>s</code> — and the function mutated it down to a single element whose value was overwritten with <code>len(s)</code>, i.e. <code>[1]</code>. (The local <code>t</code> inside <code>slice_up</code> is a different list entirely.)</p>`
      },
      {
        key: "c", label: "(c)", points: 1,
        prompt: "What is the order of growth of the time it takes to evaluate <code>list(list(q))</code> for a list of numbers <code>q</code> in terms of the length of <code>q</code>? Assume that creating a list with one element takes constant time, and making a copy of a list takes linear time in the length of the list.",
        type: "choice", plainOptions: true,
        options: ["exponential", "quadratic", "linear", "logarithmic", "constant"],
        answer: "linear",
        explain: `<p>Each <code>list(...)</code> call copies its argument once, which is linear. Doing that twice is still linear — two passes of <i>n</i> work is <i>2n</i>, and constant factors do not change the order of growth.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q3
{
  num: 3, title: "CS 61A Software Store", points: 6,
  intro: [
    "<p>A <code>Store</code> instance has a list of <code>branches</code>, and each branch is also a <code>Store</code> instance, forming a tree of stores. Each <code>Store</code> instance also has a list of programs (strings) called its <code>inventory</code>. For a <code>Store</code>:</p>",
    "<ul><li>The <code>copies(s)</code> method returns the number of times <code>s</code> appears in the inventories of all nodes in its tree of stores.</li>" +
    "<li>The <code>add_to(k)</code> method returns a function that takes a string and appends it to the inventory of its <code>k</code>th branch. Assume that <code>k</code> is non-negative and less than the number of branches.</li></ul>"
  ],
  code: `class Store:
    """A Store selling programs has branches forming a tree of Stores.

    >>> north, south = Store(['Cats', 'Ants']), Store(['Cats', 'Cats', 'Hog'])
    >>> east, west = Store(['Cats', 'Hog', 'Hog'], [north, south]), Store(['Cats', 'Cats', 'Ants'])
    >>> main = Store(['Ants', 'Ants', 'Hog'], [east, west])
    >>> east.copies('Cats')    # 1 in north, 2 in south, 1 in east
    4
    >>> main.copies('Ants')    # 2 in main, 1 in north, 1 in west
    4
    >>> main.add_to(1)('Ants') # Add 'Ants' to the inventory of west
    >>> [main.copies('Ants'), west.copies('Ants')]
    [5, 2]
    """
    def __init__(self, programs, branches=[]):
        assert all([isinstance(b, Store) for b in branches])
        self.branches = branches
        self.inventory = programs

    def copies(self, s):
        """Return the number of times s appears in all inventories of this tree."""
        return sum([_______ for p in self.inventory if p == s] + [_______ for b in self.branches])
                      (a)                                          (b)

    def add_to(self, k):
        """Return a function that appends a string to the inventory of the branch at index k."""
        return _______
                 (c)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 1, prompt: "Fill in blank (a).",
        type: "choice", options: ["1", "p", "len(p)", "len(self.inventory)"],
        answer: "1",
        explain: `<p>The comprehension has already filtered down to the matching entries, so each surviving element should contribute <code>1</code> to the count. Using <code>p</code> would try to add strings to numbers.</p>`
      },
      {
        key: "b", label: "(b)", points: 2, prompt: "Fill in blank (b).",
        type: "text", oneLine: true, check: false,
        answer: "b.copies(s)",
        explain: `<p>The second list contributes one number per branch: how many copies that whole subtree holds. That is the same question one level down, so it is the recursive call — and because each branch is itself a <code>Store</code>, it is a method call on <code>b</code>.</p>`
      },
      {
        key: "c", label: "(c)", points: 3, prompt: "Fill in blank (c).",
        type: "text", oneLine: true, check: false,
        answer: "lambda x: self.branches[k].inventory.append(x)",
        explain: `<p><code>add_to</code> must <i>return a function</i>, not do the appending itself — the doctest calls it as <code>main.add_to(1)('Ants')</code>. The returned lambda closes over both <code>self</code> and <code>k</code>, so when it is finally called it appends to the right branch's inventory.</p>`
      }
    ],
    runner: {
      code: `class Store:
    def __init__(self, programs, branches=[]):
        assert all([isinstance(b, Store) for b in branches])
        self.branches = branches
        self.inventory = programs
    def copies(self, s):
        return sum([{{a}} for p in self.inventory if p == s] + [{{b}} for b in self.branches])
    def add_to(self, k):
        return {{c}}

north, south = Store(['Cats', 'Ants']), Store(['Cats', 'Cats', 'Hog'])
east, west = Store(['Cats', 'Hog', 'Hog'], [north, south]), Store(['Cats', 'Cats', 'Ants'])
main = Store(['Ants', 'Ants', 'Hog'], [east, west])
before = [east.copies('Cats'), main.copies('Ants')]
main.add_to(1)('Ants')`,
      tests: [
        { expr: "before", expected: "[4, 4]" },
        { expr: "[main.copies('Ants'), west.copies('Ants')]", expected: "[5, 2]" },
        { expr: "main.copies('Hog')", expected: "4" }
      ]
    }
  }]
},

// ------------------------------------------------------------------ Q4
{
  num: 4, title: "Almost a Perfect Question", points: 18,
  intro: ["<p><b>Definition.</b> A <i>proper divisor</i> of an integer <code>n</code> is an integer <code>d</code> less than <code>n</code> that evenly divides <code>n</code>, and so <code>n</code> divided by <code>d</code> has no remainder. A <i>semiperfect</i> number is a positive integer that is the sum of some (or all) of its proper divisors. For example, <code>24 = 2 + 4 + 6 + 12</code> and so it is semiperfect. The sum of divisors cannot contain repeated numbers.</p>"],
  sections: [
    {
      label: "(a)", points: 6,
      intro: ["<p>Implement <code>semiperfect</code>, which takes a positive integer <code>n</code>. It returns <code>True</code> if <code>n</code> is semiperfect and <code>False</code> otherwise.</p>"],
      code: `def semiperfect(n):
    """Return whether positive integer n is a sum of some (or all) of its proper divisors.

    >>> [k for k in range(1, 40) if semiperfect(k)]
    [6, 12, 18, 20, 24, 28, 30, 36]
    """
    def f(s, d):
        if _______:
             (a)
            return True
        if d >= n:
            return False
        if _______ and f(_______, d + 1):
             (b)         (c)
            return True
        return _______
                 (d)
    return f(n, 1)`,
      parts: [
        {
          key: "a", label: "i.", points: 1, prompt: "Fill in blank (a).",
          type: "choice", options: ["n == 0", "s == 0", "s == d", "n == d"],
          answer: "s == 0",
          explain: `<p><code>s</code> is how much of the target sum is still unaccounted for; it starts at <code>n</code> and shrinks as divisors are spent. Reaching exactly <code>0</code> means some set of proper divisors added up to <code>n</code>.</p>`
        },
        {
          key: "b", label: "ii.", points: 1, prompt: "Fill in blank (b).",
          type: "choice", options: ["n % d == 0", "s % d == 0", "n % d > 0", "s % d > 0"],
          answer: "n % d == 0",
          explain: `<p>Only genuine proper divisors of <code>n</code> may be used, and divisibility is a property of <code>n</code>, not of the shrinking remainder <code>s</code>.</p>`
        },
        {
          key: "c", label: "iii.", points: 2, prompt: "Fill in blank (c).",
          type: "text", oneLine: true, check: false,
          answer: "s - d",
          explain: `<p>This is the "use <code>d</code>" branch: spending the divisor reduces what is left to make by <code>d</code>. The <code>d + 1</code> already written in the call ensures each divisor can be used at most once.</p>`
        },
        {
          key: "d", label: "iv.", points: 2, prompt: "Fill in blank (d).",
          type: "text", oneLine: true, check: false,
          answer: "f(s, d + 1)",
          explain: `<p>This is the "skip <code>d</code>" branch, reached when <code>d</code> is not a divisor or when using it did not pan out: the target is unchanged, and the search moves on to the next candidate.</p>`
        }
      ],
      runner: {
        code: `def semiperfect(n):
    def f(s, d):
        if {{a}}:
            return True
        if d >= n:
            return False
        if {{b}} and f({{c}}, d + 1):
            return True
        return {{d}}
    return f(n, 1)`,
        tests: [
          { expr: "[k for k in range(1, 40) if semiperfect(k)]", expected: "[6, 12, 18, 20, 24, 28, 30, 36]" },
          { expr: "semiperfect(1)", expected: "False" },
          { expr: "semiperfect(28)", expected: "True" },
          { expr: "semiperfect(100)", expected: "True" }
        ]
      }
    },
    {
      label: "(b)", points: 6,
      intro: ["<p>Implement <code>subsums</code>, a generator function that takes a list of unique (no repeats) positive integers <code>s</code> and a positive integer <code>n</code>. It yields all sublists of <code>s</code> that sum to <code>n</code>. A sublist of <code>s</code> is a list containing some of the elements of <code>s</code> in order. The <code>subsums</code> function should not yield the same list twice. The lists may appear in any order.</p>"],
      code: `def subsums(s, n):
    """Yield all sublists of s that sum to n.

    >>> list(subsums([1, 2, 3, 6, 9], 18))
    [[1, 2, 6, 9], [3, 6, 9]]
    >>> list(subsums([1, 2, 3, 4, 6], 16))
    [[1, 2, 3, 4, 6]]
    >>> list(subsums([1, 2, 3, 4, 6, 8, 12], 12))
    [[1, 2, 3, 6], [1, 3, 8], [2, 4, 6], [4, 8], [12]]
    """
    if s:
        if _______:
             (e)
            yield [n]
        for t in _______:
                   (f)
            yield _______
                    (g)
        yield from _______
                     (h)`,
      parts: [
        {
          key: "e", label: "i.", points: 1, prompt: "Fill in blank (e).",
          type: "choice", options: ["n == s", "n == s[0]", "n in s", "[n] == s"],
          answer: "n == s[0]",
          explain: `<p>The <code>yield [n]</code> underneath produces a one-element sublist, and the only element this call is entitled to use on its own is the first one. So that case applies exactly when <code>s[0]</code> already equals the whole target.</p>
<p><code>n in s</code> would be wrong — it would yield <code>[n]</code> for an element further down the list, which the recursive calls will handle themselves (and would duplicate results).</p>`
        },
        {
          key: "f", label: "ii.", points: 3, prompt: "Fill in blank (f).",
          type: "text", oneLine: true, check: false,
          answer: "subsums(s[1:], n - s[0])",
          explain: `<p>This loop builds the sublists that <i>do</i> use <code>s[0]</code>: the rest of the list must make up the remaining target <code>n - s[0]</code>.</p>`
        },
        {
          key: "g", label: "iii.", points: 1, prompt: "Fill in blank (g).",
          type: "choice", options: ["s + t", "[s] + t", "s[1:] + t", "s[:1] + t"],
          answer: "s[:1] + t",
          explain: `<p>Stick <code>s[0]</code> on the front of each sublist found in the rest. <code>s[:1]</code> is a one-element <i>list</i>, so <code>+</code> concatenates properly; <code>s[0] + t</code> would be a number plus a list.</p>`
        },
        {
          key: "h", label: "iv.", points: 1, prompt: "Fill in blank (h).",
          type: "choice", options: ["subsums(s, n)", "subsums(s[1:], n)", "subsums(s, n - 1)", "subsums(s[1:], n - 1)"],
          answer: "subsums(s[1:], n)",
          explain: `<p>And this is the "don't use <code>s[0]</code>" half: the same target, drawn from the remaining elements. Between the loop above and this line, every sublist is generated exactly once.</p>`
        }
      ],
      runner: {
        // The in-browser Python mis-executes deeply recursive `yield from`,
        // so the equivalent explicit loop is used here. Blank (h) is unchanged.
        code: `def subsums(s, n):
    if s:
        if {{e}}:
            yield [n]
        for t in {{f}}:
            yield {{g}}
        for __y in {{h}}:
            yield __y`,
        tests: [
          { expr: "list(subsums([1, 2, 3, 6, 9], 18))", expected: "[[1, 2, 6, 9], [3, 6, 9]]" },
          { expr: "list(subsums([1, 2, 3, 4, 6], 16))", expected: "[[1, 2, 3, 4, 6]]" },
          { expr: "list(subsums([1, 2, 3, 4, 6, 8, 12], 12))", expected: "[[1, 2, 3, 6], [1, 3, 8], [2, 4, 6], [4, 8], [12]]" },
          { expr: "list(subsums([5], 5))", expected: "[[5]]" },
          { expr: "list(subsums([5], 4))", expected: "[]" }
        ]
      }
    },
    {
      label: "(c)", points: 6,
      intro: ["<p>Implement <code>semisums</code>, which takes a positive integer <code>n</code>. It returns a list of all lists of unique (no repeats) proper divisors of <code>n</code> that sum to <code>n</code>. You may call <code>semiperfect</code> and <code>subsums</code>.</p>"],
      code: `def semisums(n):
    """Return a list of all lists (with no repeats) of
    proper divisors of n that sum to n.

    >>> semisums(22)   # 22 is not semiperfect, so there are no sums.
    []
    >>> semisums(30)   # 30 is semiperfect. It has three different sums.
    [[1, 3, 5, 6, 15], [2, 3, 10, 15], [5, 10, 15]]
    """
    return list( _______ ([k for k in range(1, n) if _______ ], _______ ))
                   (i)                                 (j)        (k)`,
      parts: [
        {
          key: "i", label: "i.", points: 1, prompt: "Fill in blank (i).",
          type: "choice", options: ["map", "filter", "sorted", "subsums", "semiperfect"],
          answer: "subsums",
          explain: `<p>The job is exactly what <code>subsums</code> does: given a list of candidate numbers and a target, produce every sublist that hits the target. Wrapping it in <code>list</code> turns the generator into the required list.</p>`
        },
        {
          key: "j", label: "ii.", points: 1, prompt: "Fill in blank (j).",
          type: "choice", options: ["semiperfect(n)", "semiperfect(k)", "semiperfect(n) or semiperfect(k)", "n % k == 0"],
          answer: "n % k == 0",
          explain: `<p>The comprehension builds the pool of candidates, which must be the <i>proper divisors</i> of <code>n</code>. <code>range(1, n)</code> already stops short of <code>n</code>, so all that is left is the divisibility test.</p>`
        },
        {
          key: "k", label: "iii.", points: 1, prompt: "Fill in blank (k).",
          type: "text", oneLine: true, check: false,
          answer: "n",
          explain: `<p>The target the divisors must add up to is <code>n</code> itself — that is the definition of semiperfect.</p>`
        },
        {
          key: "l", label: "iv.", points: 3,
          prompt: "Fill in blank (l) of <code>primitive_semiperfect</code>, a function that takes a positive integer <code>n</code>. It returns <code>True</code> if <code>n</code> is semiperfect and no smaller semiperfect number is a divisor of <code>n</code>. Your answer should have two expressions separated by a comma.",
          code: `def primitive_semiperfect(n):
    """Return whether n is semiperfect and has no semiperfect proper divisors.

    >>> [k for k in range(1, 300) if primitive_semiperfect(k)]
    [6, 20, 28, 88, 104, 272]
    """
    return semiperfect(n) and not any(map(semiperfect, filter(_______)))
                                                               (l)`,
          type: "text", oneLine: true, check: false,
          answer: "lambda k: n % k == 0, range(1, n)",
          explain: `<p><code>filter</code> takes a predicate and an iterable. Here it should keep the proper divisors of <code>n</code>, so the predicate is <code>lambda k: n % k == 0</code> and the iterable is <code>range(1, n)</code>.</p>
<p>Then <code>map(semiperfect, ...)</code> tests each of those divisors, and <code>not any(...)</code> demands that none of them is itself semiperfect.</p>`
        }
      ],
      runner: {
        label: "Fill in (i)–(iv), then run the doctests. (<code>semiperfect</code> and <code>subsums</code> are supplied.)",
        prelude: `def semiperfect(n):
    def f(s, d):
        if s == 0:
            return True
        if d >= n:
            return False
        if n % d == 0 and f(s - d, d + 1):
            return True
        return f(s, d + 1)
    return f(n, 1)

def subsums(s, n):
    if s:
        if n == s[0]:
            yield [n]
        for t in subsums(s[1:], n - s[0]):
            yield s[:1] + t
        for __y in subsums(s[1:], n):
            yield __y`,
        code: `def semisums(n):
    return list( {{i}} ([k for k in range(1, n) if {{j}} ], {{k}} ))

def primitive_semiperfect(n):
    return semiperfect(n) and not any(map(semiperfect, filter({{l}})))`,
        tests: [
          { expr: "semisums(22)", expected: "[]" },
          { expr: "semisums(30)", expected: "[[1, 3, 5, 6, 15], [2, 3, 10, 15], [5, 10, 15]]" },
          { expr: "semisums(6)", expected: "[[1, 2, 3]]" },
          { expr: "[k for k in range(1, 120) if primitive_semiperfect(k)]", expected: "[6, 20, 28, 88, 104]" }
        ]
      }
    }
  ]
},

// ------------------------------------------------------------------ Q5
{
  num: 5, title: "How Long is this Exam?", points: 11,
  sections: [
    {
      label: "(a)", points: 5,
      intro: ["<p>Implement <code>longer</code>, which takes two linked lists of numbers <code>s</code> and <code>t</code>. It returns the longer of the two. If they have the same length, it returns <code>s</code>.</p>"],
      code: `def longer(s, t):
    """Return the longer linked list, s or t. (Same length? return s.)

    >>> longer(Link(2, Link(3)), Link.empty)
    Link(2, Link(3))
    >>> longer(Link(2, Link(3)), Link(4, Link(5)))
    Link(2, Link(3))
    >>> longer(Link(2, Link(3)), Link(4, Link(5, Link(6, Link(7)))))
    Link(4, Link(5, Link(6, Link(7))))
    >>> longer(Link.empty, Link.empty) is Link.empty
    True
    """
    a, b = s, t
    while b is not Link.empty:
        if _______:
             (a)
            return _______
                     (b)
        _______
          (c)
    return _______
             (d)`,
      parts: [
        {
          key: "a", label: "i.", points: 2, prompt: "Fill in blank (a).",
          type: "text", oneLine: true, check: false,
          answer: "a is Link.empty",
          accept: ["a == Link.empty"],
          explain: `<p>The two pointers walk forward together. The loop condition already guarantees <code>b</code> still has elements, so if <code>a</code> has run out, <code>t</code> is strictly longer.</p>`
        },
        {
          key: "b", label: "ii.", points: 1, prompt: "Fill in blank (b).",
          type: "choice", options: ["a", "b", "s", "t", "longer(a, b)", "longer(s, t)"],
          answer: "t",
          explain: `<p>The function must return one of the <i>original</i> lists, not the walking pointer. <code>b</code> points at a suffix of <code>t</code>, so returning <code>b</code> would hand back a partial list.</p>`
        },
        {
          key: "c", label: "iii.", points: 1, prompt: "Fill in blank (c).",
          type: "choice",
          options: ["a = a.rest", "a = s.rest", "b = b.rest", "b = t.rest", "a, b = a.rest, b.rest", "a, b = s.rest, t.rest"],
          answer: "a, b = a.rest, b.rest",
          explain: `<p>Both pointers must advance one step per iteration — that lockstep is what makes "whoever runs out first is shorter" work. Advancing only one would loop forever or compare nothing useful.</p>`
        },
        {
          key: "d", label: "iv.", points: 1, prompt: "Fill in blank (d).",
          type: "choice", options: ["a", "b", "s", "t", "longer(a, b)", "longer(s, t)"],
          answer: "s",
          explain: `<p>Falling out of the loop means <code>b</code> ran out while <code>a</code> had not — so <code>s</code> is at least as long as <code>t</code>. That covers both "<code>s</code> is longer" and the tie, which the problem says should also return <code>s</code>.</p>`
        }
      ],
      runner: {
        code: `def longer(s, t):
    a, b = s, t
    while b is not Link.empty:
        if {{a}}:
            return {{b}}
        {{c}}
    return {{d}}`,
        tests: [
          { expr: "longer(Link(2, Link(3)), Link.empty)", expected: "Link(2, Link(3))" },
          { expr: "longer(Link(2, Link(3)), Link(4, Link(5)))", expected: "Link(2, Link(3))" },
          { expr: "longer(Link(2, Link(3)), Link(4, Link(5, Link(6, Link(7)))))", expected: "Link(4, Link(5, Link(6, Link(7))))" },
          { expr: "longer(Link.empty, Link.empty) is Link.empty", expected: "True" },
          { expr: "longer(Link.empty, Link(1))", expected: "Link(1)" }
        ]
      }
    },
    {
      label: "(b)", points: 6,
      intro: [
        "<p>Implement <code>longest</code>, which takes a linked list of positive integers <code>s</code> and a positive integer <code>n</code>. It returns the longest sublist of <code>s</code> with elements that sum to a number less than or equal to <code>n</code>. Do not mutate <code>s</code>. In case of a tie, return any of the longest sublists whose sum is <code>n</code> or less. Assume <code>longer</code> is implemented correctly.</p>",
        "<p>A sublist of a linked list <code>s</code> is a linked list with some (or none or all) of the elements of <code>s</code> in order. Assume the sum of the elements of <code>Link.empty</code> is 0. <code>Link.empty</code> is a sublist of any linked list.</p>"
      ],
      code: `def longest(s, n):
    """Return the longest sublist of s that sums to n or less.

    >>> longest(Link(5, Link(1, Link(3, Link(4, Link(2, Link(7)))))), 7)
    Link(1, Link(3, Link(2)))
    >>> longest(Link(5, Link(1, Link(3, Link(4, Link(2, Link(7)))))), 70)
    Link(5, Link(1, Link(3, Link(4, Link(2, Link(7))))))
    >>> longest(Link(3, Link(4, Link(5))), 2) is Link.empty
    True
    """
    if s is Link.empty:
        return s
    t = _______
          (e)
    if _______:
         (f)
        return longer( _______ , t)
                         (g)
    else:
        return t`,
      parts: [
        {
          key: "e", label: "i.", points: 1, prompt: "Fill in blank (e).",
          type: "choice",
          options: ["longest(s, n)", "longest(s, n - s.first)", "longest(s.rest, n)", "longest(s.rest, n - s.first)"],
          answer: "longest(s.rest, n)",
          explain: `<p><code>t</code> is the best sublist that <i>skips</i> the first element: the rest of the list, with the budget untouched.</p>`
        },
        {
          key: "f", label: "ii.", points: 2, prompt: "Fill in blank (f).",
          type: "text", oneLine: true, check: false,
          answer: "s.first <= n",
          explain: `<p>Including the first element is only worth considering if it fits in the budget at all. Since every element is positive, an element larger than <code>n</code> can never appear in a valid sublist.</p>`
        },
        {
          key: "g", label: "iii.", points: 3, prompt: "Fill in blank (g).",
          type: "text", rows: 2, check: false,
          answer: "Link(s.first, longest(s.rest, n - s.first))",
          explain: `<p>This is the "use the first element" candidate: keep <code>s.first</code> in front of the best sublist of the rest, with the budget reduced by what it consumed. <code>longer</code> then picks whichever of the two candidates has more elements.</p>
<p>Building a new <code>Link</code> (rather than reusing <code>s</code>) is what keeps the original list unmutated.</p>`
        }
      ],
      runner: {
        label: "Fill in (i)–(iii), then run the doctests. (A correct <code>longer</code> is supplied.)",
        prelude: `def longer(s, t):
    a, b = s, t
    while b is not Link.empty:
        if a is Link.empty:
            return t
        a, b = a.rest, b.rest
    return s`,
        code: `def longest(s, n):
    if s is Link.empty:
        return s
    t = {{e}}
    if {{f}}:
        return longer( {{g}} , t)
    else:
        return t

ex = Link(5, Link(1, Link(3, Link(4, Link(2, Link(7))))))`,
        tests: [
          { expr: "longest(ex, 7)", expected: "Link(1, Link(3, Link(2)))" },
          { expr: "longest(ex, 70)", expected: "Link(5, Link(1, Link(3, Link(4, Link(2, Link(7))))))" },
          { expr: "longest(Link(3, Link(4, Link(5))), 2) is Link.empty", expected: "True" },
          { expr: "ex", expected: "Link(5, Link(1, Link(3, Link(4, Link(2, Link(7))))))" }
        ]
      }
    }
  ]
},

// ------------------------------------------------------------------ Q6
{
  num: 6, title: "Nice Path!", points: 0,
  intro: ["<p>Fill in the blank of <code>max_path</code>, which takes a <code>Tree</code> of integers <code>t</code> and a function <code>g</code>. It returns a list <code>s</code> containing the labels along the path from the root of <code>t</code> to a leaf for which <code>g(s)</code> is as large or larger than for any other path. In case of a tie, return any path with a maximum <code>g(s)</code> value.</p>"],
  code: `def climb(t, f):
    if t.is_leaf():
        return [t.label]
    return [t.label] + climb(max(t.branches, key=f), f)

def max_path(t, g):
    """Return the path s from the root of t to a leaf for which g(s) is largest.

    >>> scare = Tree(0, [Tree(4), Tree(5, [Tree(10)]), Tree(2)])
    >>> crow = Tree(4, [Tree(5), Tree(9, [scare, Tree(7, [Tree(6)])]), Tree(8)])
    >>> max_path(crow, lambda p: -p[-1])            # The path to the smallest leaf
    [4, 9, 0, 2]
    >>> max_path(crow, len)                         # The longest path
    [4, 9, 0, 5, 10]
    >>> max_path(crow, lambda p: -abs(p[0]-p[-1]))  # To the leaf closest in value to the root
    [4, 9, 0, 4]
    """
    x = [t.label]   # You can use x instead of [t.label] to shorten your answer!
    return climb(t, lambda b: _______ )`,
  sections: [{
    parts: [{
      key: "aplus", label: "(a)", points: 0, aplus: true,
      prompt: "Fill in the blank.",
      type: "text", rows: 3, check: false,
      answer: "g(x + max_path(b, lambda p: g(x + p)))",
      explain: `<p><code>climb</code> descends greedily, at each node taking the branch that scores highest under the key function. So the key for a branch <code>b</code> must be <i>the best score achievable by any complete path going through <code>b</code></i> — not just something local about <code>b</code>.</p>
<p>The best path through <code>b</code> is <code>max_path</code> of <code>b</code>, but scored from the perspective of the current node: a path <code>p</code> inside <code>b</code> really becomes <code>x + p</code> once the current label is prefixed. Hence the inner <code>lambda p: g(x + p)</code>.</p>
<p>Having found that best continuation, the key value itself is <code>g</code> of the whole path, <code>g(x + max_path(b, ...))</code>. This works for <code>len</code> and for the sign-flipped distance functions in the doctests alike, because nothing assumes anything about <code>g</code>.</p>`
    }],
    runner: {
      label: "Fill in the blank, then run the doctests. (<code>climb</code> is supplied.)",
      prelude: `def climb(t, f):
    if t.is_leaf():
        return [t.label]
    return [t.label] + climb(max(t.branches, key=f), f)`,
      code: `def max_path(t, g):
    x = [t.label]
    return climb(t, lambda b: {{aplus}} )

scare = Tree(0, [Tree(4), Tree(5, [Tree(10)]), Tree(2)])
crow = Tree(4, [Tree(5), Tree(9, [scare, Tree(7, [Tree(6)])]), Tree(8)])`,
      tests: [
        { expr: "max_path(crow, lambda p: -p[-1])", expected: "[4, 9, 0, 2]" },
        { expr: "max_path(crow, len)", expected: "[4, 9, 0, 5, 10]" },
        { expr: "max_path(crow, lambda p: -abs(p[0]-p[-1]))", expected: "[4, 9, 0, 4]" }
      ]
    }
  }]
}

]});
