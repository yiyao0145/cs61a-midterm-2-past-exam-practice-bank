// CS 61A Fall 2023 Midterm 2
EXAM_BANK.exams.push({
id: "fa23",
term: "Fall 2023",
points: 45,
questions: [

// ------------------------------------------------------------------ Q1
{
  num: 1, title: "What Would Python Display?", points: 4,
  intro: ["<p>Assume the following code has been executed.</p>"],
  code: `s = range(3, 7)
t = iter(s)
u = map(lambda x: 2 * x, t)
v = [next(t), next(t)]   # This line does not cause an error`,
  after: ["<p>Choose the output displayed by the interactive Python interpreter when each expression below is evaluated or <i>Error</i> if an error occurs. These expressions are evaluated in order and the value of later expressions may be affected by evaluating previous expressions.</p>"],
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 1, prompt: "[-k for k in v if k in s]", promptCode: true,
        type: "choice", options: ["[]", "[3, 4]", "[-3, -4]", "Error"],
        answer: "[-3, -4]",
        explain: `<p>Building <code>v</code> already pulled the first two values off the iterator <code>t</code>, so <code>v</code> is <code>[3, 4]</code>. Both are in <code>range(3, 7)</code>, and negating gives <code>[-3, -4]</code>.</p>
<p>Note that <code>k in s</code> works on a range without consuming anything — <code>s</code> is the range itself, not the iterator.</p>`
      },
      {
        key: "b", label: "(b)", points: 1, prompt: "tuple(u)", promptCode: true,
        type: "choice",
        options: ["(3, 4, 5, 6)", "(3, 4, 5, 6, 7)", "(6, 8, 10, 12)", "(6, 8, 10, 12, 14)", "(10, 12)", "(10, 12, 14)", "Error"],
        answer: "(10, 12)",
        explain: `<p><code>u</code> maps over <code>t</code>, the <i>same</i> iterator that <code>v</code> already drew 3 and 4 from. Only 5 and 6 remain, so doubling gives <code>(10, 12)</code>.</p>`
      },
      {
        key: "c", label: "(c)", points: 1, prompt: "next(t)", promptCode: true,
        type: "choice", options: ["3", "5", "range(3, 7)", "range(5, 7)", "Error"],
        answer: "Error",
        explain: `<p>Part (b) exhausted <code>t</code> completely, so asking for another element raises <code>StopIteration</code>.</p>`
      },
      {
        key: "d", label: "(d)", points: 1, prompt: "next(iter(s)) + next(iter(s))", promptCode: true,
        type: "choice", options: ["6", "7", "10", "11", "Error"],
        answer: "6",
        explain: `<p><code>iter(s)</code> creates a <i>brand-new</i> iterator over the range each time it is called, and each one starts at the beginning. So both calls return 3, and the sum is 6 — the original range is never consumed.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q2
{
  num: 2, title: "Making a List, Checking it Twice", points: 6,
  intro: [
    "<p>Answer the questions about the code below. (The original exam supplied an environment diagram with a labeled blank (a); the diagram itself was not scored.)</p>",
    "<p><i>Reminder:</i> <code>list(s)</code> creates a new list with the same elements as <code>s</code>; <code>s.pop()</code> removes and returns the last element of <code>s</code>.</p>"
  ],
  code: `def push(t, x):
    s = list(t)
    s[1].append(x)

def pull():
    s = list(t)
    u = s.pop()
    return u[1][0]

s = [7, [8, 9]]
t = [6, s]

push(s, pull())
print(t)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 3,
        prompt: "What value fills blank (a) — the value bound to <code>u</code> in the frame for <code>pull</code>? <b>Select all that apply.</b>",
        type: "select", plainOptions: true,
        options: ["None", "A list", "A number", "The object bound to global s", "The object bound to global t",
                  "The same object that s[0] would evaluate to in the global frame",
                  "The same object that s[1] would evaluate to in the global frame",
                  "The same object that t[0] would evaluate to in the global frame",
                  "The same object that t[1] would evaluate to in the global frame"],
        answer: ["A list", "The object bound to global s", "The same object that t[1] would evaluate to in the global frame"],
        explain: `<p>Inside <code>pull</code>, <code>list(t)</code> copies the outer list <code>t</code>, giving a new list <code>[6, &lt;the list [7, [8, 9]]&gt;]</code>. Popping it returns its last element — which is not a copy, but the very same object that global <code>s</code> is bound to.</p>
<p>So <code>u</code> is a list; it is the object bound to global <code>s</code>; and since <code>t</code> was built as <code>[6, s]</code>, it is also the same object <code>t[1]</code> evaluates to. It is not a number, not <code>None</code>, and not <code>t</code> itself.</p>`
      },
      {
        key: "b", label: "(b)", points: 3, prompt: "What would be printed by the expression <code>print(t)</code> at the end?",
        type: "text", oneLine: true, answer: "[6, [7, [8, 9, 8]]]",
        explain: `<p><code>pull()</code> returns <code>u[1][0]</code>, which is <code>[8, 9][0]</code>, i.e. <code>8</code>. It changes nothing.</p>
<p>Then <code>push(s, 8)</code> runs with <code>t = s = [7, [8, 9]]</code> (the parameter shadows the global). <code>list(t)</code> copies the outer list, but <code>s[1]</code> inside <code>push</code> is still the shared inner list <code>[8, 9]</code>, so appending puts <code>8</code> there: <code>[8, 9, 8]</code>.</p>
<p>Global <code>t</code> is <code>[6, s]</code>, and <code>s</code> is <code>[7, [8, 9, 8]]</code>.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q3
{
  num: 3, title: "24-Hour Library", points: 6,
  intro: ["<p>Anyone can check out a book from a library and then bring that book back. Implement the <code>Library</code> and <code>Book</code> classes. A <code>Library</code> takes a list of unique strings called <code>titles</code> and constructs a <code>books</code> dictionary that has strings as keys and <code>Book</code> objects as values. Its <code>checkout</code> method takes a string <code>title</code> and returns the corresponding <code>Book</code> object if that title is not checked out, or prints a message. After <code>bring_back</code> is invoked on that book, it can be checked out again.</p>"],
  code: `class Library:
    """A library with one copy of each title that can be checked out.

    >>> cs = Library(['Composing Programs', 'Python Docs', 'Berkeley Academic Guide'])
    >>> bs = [cs.checkout('Composing Programs'), cs.checkout('Python Docs')]
    >>> cs.checkout('Composing Programs')      # This time, no Book is returned
    Composing Programs is checked out
    >>> bs[0].bring_back()
    >>> cs.checkout('Composing Programs').title   # This time, a Book is returned
    'Composing Programs'
    """
    def __init__(self, titles):
        self.books = {t: Book(t, _______) for t in titles}
                                   (a)
        self.out = []              # A list of Book objects

    def checkout(self, title):
        assert title in self.books, title + " isn't in this library's collection"
        book = _______
                 (b)
        if book not in self.out:
            _______
              (c)
            return book
        else:
            print(book, 'is checked out')

class Book:
    def __init__(self, title, library):
        self.title = title        # a string
        self.library = library    # a Library object

    def bring_back(self):
        _______.remove(_______)
          (d)            (e)

    def __str__(self):
        return _______
                 (f)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 1, prompt: "Fill in blank (a).",
        type: "choice", options: ["self", "self.books", "Library", "Library()", "Library(titles)"],
        answer: "self",
        explain: `<p>Each <code>Book</code> is told which library it belongs to, and that is the library currently being constructed — <code>self</code>. Calling <code>Library(titles)</code> here would recurse forever.</p>`
      },
      {
        key: "b", label: "(b)", points: 1, prompt: "Fill in blank (b).",
        type: "text", oneLine: true, check: false,
        answer: "self.books[title]",
        explain: `<p>The <code>assert</code> above has already confirmed the title is in the dictionary, so look it up to get the <code>Book</code> object.</p>`
      },
      {
        key: "c", label: "(c)", points: 1, prompt: "Fill in blank (c).",
        type: "choice",
        options: ["out.append(book)", "out.extend(book)", "Library.append(book)", "Library.extend(book)",
                  "self.out.append(book)", "self.out.extend(book)"],
        answer: "self.out.append(book)",
        explain: `<p>Record that this book is now checked out by adding it to the library's <code>out</code> list. <code>out</code> is an attribute, so it needs <code>self.</code>; <code>extend</code> would try to iterate over a <code>Book</code>.</p>`
      },
      {
        key: "d", label: "(d)", points: 1, prompt: "Fill in blank (d).",
        type: "choice", options: ["self.", "self.out", "library", "library.out", "self.library.out"],
        answer: "self.library.out",
        explain: `<p>The checked-out list lives on the <i>library</i>, and a <code>Book</code> reaches its library through its own attribute: <code>self.library.out</code>. A <code>Book</code> has no <code>out</code> attribute of its own, and bare <code>library</code> is not in scope in this method.</p>`
      },
      {
        key: "e", label: "(e)", points: 1, prompt: "Fill in blank (e).",
        type: "choice", options: ["self", "title", "library", "self.title", "self.library"],
        answer: "self",
        explain: `<p>The list holds <code>Book</code> objects, so the thing to remove is this book — <code>self</code>.</p>`
      },
      {
        key: "f", label: "(f)", points: 1, prompt: "Fill in blank (f).",
        type: "choice", options: ["self", "title", "self.title", "repr(self)", "repr(title)", "repr(self.title)"],
        answer: "self.title",
        explain: `<p>The doctest shows <code>Composing Programs is checked out</code> — no quotes — so <code>__str__</code> must return the plain title string. <code>repr(self.title)</code> would add quotes, and returning <code>self</code> is not a string at all.</p>`
      }
    ],
    runner: {
      code: `class Library:
    def __init__(self, titles):
        self.books = {t: Book(t, {{a}}) for t in titles}
        self.out = []
    def checkout(self, title):
        assert title in self.books, title + " isn't in this library's collection"
        book = {{b}}
        if book not in self.out:
            {{c}}
            return book
        else:
            print(book, 'is checked out')

class Book:
    def __init__(self, title, library):
        self.title = title
        self.library = library
    def bring_back(self):
        {{d}}.remove({{e}})
    def __str__(self):
        return {{f}}

_log = []
_real_print = print
def _capture(*args):
    _log.append(' '.join([str(a) for a in args]))

print = _capture
cs = Library(['Composing Programs', 'Python Docs', 'Berkeley Academic Guide'])
bs = [cs.checkout('Composing Programs'), cs.checkout('Python Docs')]
again = cs.checkout('Composing Programs')
bs[0].bring_back()
after = cs.checkout('Composing Programs')
print = _real_print`,
      tests: [
        { expr: "_log", expected: "['Composing Programs is checked out']" },
        { expr: "again", expected: "None" },
        { expr: "after.title", expected: "'Composing Programs'" },
        { expr: "str(bs[1])", expected: "'Python Docs'" }
      ]
    }
  }]
},

// ------------------------------------------------------------------ Q4
{
  num: 4, title: "A Perfect Question", points: 16,
  intro: ["<p><b>Definition.</b> A <i>perfect square</i> is <code>k*k</code> for some integer <code>k</code>.</p>"],
  sections: [
    {
      label: "(a)", points: 7,
      intro: ["<p>Implement <code>fit</code>, which takes positive integers <code>total</code> and <code>n</code>. It returns <code>True</code> or <code>False</code> indicating whether there are <code>n</code> positive perfect squares that sum to <code>total</code>. The perfect squares need not be unique.</p>"],
      code: `def fit(total, n):
    """Return whether there are n positive perfect squares that sum to total.

    >>> [fit(4, 1), fit(4, 2), fit(4, 3), fit(4, 4)]   # 1*(2*2) for n=1; 4*(1*1) for n=4
    [True, False, False, True]
    >>> [fit(12, n) for n in range(3, 8)]   # 3*(2*2), 3*(1*1)+3*3, 4*(1*1)+2*(2*2)
    [True, True, False, True, False]
    >>> [fit(32, 2), fit(32, 3), fit(32, 4), fit(32, 5)]   # 2*(4*4), 3*(1*1)+2*2+5*5
    [True, False, False, True]
    """
    def f(total, n, k):
        if _______:
             (a)
            return True
        elif _______:
               (b)
            return False
        else:
            return _______
                     (c)
    return f(total, n, 1)`,
      parts: [
        {
          key: "a", label: "i.", points: 2, prompt: "Select <b>all</b> of the options that could fill blank (a).",
          type: "select",
          options: ["total == 0", "n == k", "total == 0 and n == 0", "total == k * k",
                    "total == k * k and n == 1", "total == n * k * k"],
          answer: ["total == 0 and n == 0", "total == k * k and n == 1", "total == n * k * k"],
          explain: `<p>The helper searches with <code>k</code> as the smallest square still allowed, so a success condition must pin down <i>both</i> that the remaining total is used up and that exactly the right number of squares were spent.</p>
<ul>
<li><code>total == 0 and n == 0</code> — the plain base case: nothing left to make, nothing left to spend.</li>
<li><code>total == k * k and n == 1</code> — succeed one step earlier: exactly one square left to place and it fits exactly.</li>
<li><code>total == n * k * k</code> — succeed when the remainder is exactly <code>n</code> copies of the current square. This is strictly more general than the first option (it covers <code>0 == 0 * k * k</code> too).</li>
</ul>
<p>The other three drop the constraint on <code>n</code>, so they report success while squares are still owed — e.g. <code>total == 0</code> would make <code>fit(4, 2)</code> wrongly return <code>True</code>.</p>
<p><i>I checked all six against a brute-force reference for every <code>total</code> up to 40 and <code>n</code> up to 6; exactly these three agree everywhere.</i></p>`
        },
        {
          key: "b", label: "ii.", points: 2, prompt: "Fill in blank (b).",
          type: "text", oneLine: true, check: false,
          answer: "n == 0 or k * k > total",
          explain: `<p>Two ways the search is hopeless: there are no squares left to place but the total is not finished, or even the smallest square still allowed is already bigger than what remains.</p>
<p>That second half is essential — without it <code>k</code> would keep climbing forever on impossible branches instead of failing.</p>`
        },
        {
          key: "c", label: "iii.", points: 3,
          prompt: "Fill in blank (c) with an expression of the form <code>f(___, ___, ___) ___ f(___, ___, ___)</code>.",
          type: "text", rows: 2, check: false,
          answer: "f(total - k * k, n - 1, k) or f(total, n, k + 1)",
          explain: `<p>The classic use-or-skip pair. <i>Use</i> <code>k*k</code>: subtract it, spend one of the <code>n</code> squares, and keep <code>k</code> the same so it can be reused (the squares need not be unique). <i>Skip</i> to the next size: leave <code>total</code> and <code>n</code> alone and move to <code>k + 1</code>.</p>
<p>Keeping <code>k</code> fixed in the first branch and only ever increasing it in the second is what stops the same combination being found twice.</p>`
        }
      ],
      runner: {
        code: `def fit(total, n):
    def f(total, n, k):
        if {{a}}:
            return True
        elif {{b}}:
            return False
        else:
            return {{c}}
    return f(total, n, 1)`,
        tests: [
          { expr: "[fit(4, 1), fit(4, 2), fit(4, 3), fit(4, 4)]", expected: "[True, False, False, True]" },
          { expr: "[fit(12, n) for n in range(3, 8)]", expected: "[True, True, False, True, False]" },
          { expr: "[fit(32, 2), fit(32, 3), fit(32, 4), fit(32, 5)]", expected: "[True, False, False, True]" },
          { expr: "[fit(1, 1), fit(2, 1), fit(9, 1), fit(50, 2)]", expected: "[True, False, True, True]" }
        ]
      }
    },
    {
      label: "(b)", points: 9,
      intro: ["<p>Implement the generator function <code>squares</code>, which takes positive integers <code>total</code> and <code>k</code>. It yields all lists of perfect squares greater or equal to <code>k*k</code> that sum to <code>total</code>. Each list is in non-increasing order (large to small).</p>"],
      code: `def squares(total, k):
    """Yield the ways in which perfect squares greater or equal to k*k sum to total.

    >>> list(squares(10, 1))   # All lists of perfect squares that sum to 10
    [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [4, 1, 1, 1, 1, 1, 1], [4, 4, 1, 1], [9, 1]]
    >>> list(squares(20, 2))   # Only use perfect squares greater or equal to 4 (2*2).
    [[4, 4, 4, 4, 4], [16, 4]]
    """
    assert total > 0 and k > 0
    if total == k * k:
        yield _______
                (d)
    elif total > k * k:
        for s in _______:
                   (e)
            yield _______
                    (f)
        yield from squares(total, k + 1)`,
      parts: [
        {
          key: "d", label: "i.", points: 2, prompt: "Fill in blank (d).",
          type: "text", oneLine: true, check: false,
          answer: "[k * k]",
          accept: ["[total]"],
          explain: `<p>When the remaining total is exactly the current square, there is one way to finish: a list holding that single square. It must be a <i>list</i>, since each yielded result is a list of squares.</p>`
        },
        {
          key: "e", label: "ii.", points: 3, prompt: "Fill in blank (e).",
          type: "text", oneLine: true, check: false,
          answer: "squares(total - k * k, k)",
          explain: `<p>This loop handles "use <code>k*k</code> at least once": the rest of the sum must come from squares that are still at least <code>k*k</code>, so <code>k</code> is unchanged and the total shrinks.</p>
<p>The <code>yield from squares(total, k + 1)</code> line already written below is the complementary "don't use <code>k*k</code> at all" case.</p>`
        },
        {
          key: "f", label: "iii.", points: 1, prompt: "Select <b>all</b> of the options that could fill in blank (f).",
          type: "select",
          options: ["s + k*k", "s.append(k*k)", "s + [k*k]", "[s] + [k*k]"],
          answer: ["s + [k*k]"],
          explain: `<p><code>s</code> is a list of squares that sums to <code>total - k*k</code>; appending the current square to the <i>end</i> keeps the required non-increasing order, since everything in <code>s</code> is at least <code>k*k</code>.</p>
<ul>
<li><code>s + k*k</code> adds a list and a number — <code>TypeError</code>.</li>
<li><code>s.append(k*k)</code> returns <code>None</code>, so the generator would yield <code>None</code>.</li>
<li><code>[s] + [k*k]</code> nests the list inside another list.</li>
</ul>`
        },
        {
          key: "g", label: "iv.", points: 3,
          prompt: "Write an expression containing <code>a</code> that evaluates to the shortest list of perfect squares that sum to an integer <code>a</code>. For example, if <code>a = 32</code>, your expression should evaluate to <code>[16, 16]</code> (not <code>[25, 4, 1, 1, 1]</code>). If two or more such lists are both shortest, it can evaluate to any of them. Assume <code>squares</code> is implemented correctly.",
          type: "text", oneLine: true, check: false,
          answer: "min(squares(a, 1), key=len)",
          explain: `<p><code>squares(a, 1)</code> generates every way to write <code>a</code> as a sum of perfect squares. "Shortest" means fewest elements, so compare by <code>len</code> — and <code>min</code> consumes the generator lazily without needing a list first.</p>`
        }
      ],
      runner: {
        label: "Fill in (i)–(iv), then run the doctests.",
        // The in-browser Python mis-executes deeply recursive `yield from`,
        // so the equivalent explicit loop is used for the fixed last line.
        code: `def squares(total, k):
    assert total > 0 and k > 0
    if total == k * k:
        yield {{d}}
    elif total > k * k:
        for s in {{e}}:
            yield {{f}}
        for __y in squares(total, k + 1):
            yield __y

def shortest(a):
    return {{g}}`,
        tests: [
          { expr: "list(squares(10, 1))", expected: "[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [4, 1, 1, 1, 1, 1, 1], [4, 4, 1, 1], [9, 1]]" },
          { expr: "list(squares(20, 2))", expected: "[[4, 4, 4, 4, 4], [16, 4]]" },
          { expr: "shortest(32)", expected: "[16, 16]" },
          { expr: "len(shortest(10))", expected: "2" }
        ]
      }
    }
  ]
},

// ------------------------------------------------------------------ Q5
{
  num: 5, title: "Only Paths", points: 7,
  intro: ["<p>Implement <code>only_paths</code>, which takes a <code>Tree</code> of numbers <code>t</code> and a number <code>n</code>. It returns a new <code>Tree</code> with only the nodes of <code>t</code> on a path from the root to a leaf with labels that sum to <code>n</code>, or <code>None</code> if no path sums to <code>n</code>. Do not mutate <code>t</code>.</p>"],
  code: `def only_paths(t, n):
    """Return a Tree with only the nodes of t along paths from the root to a leaf of t
    for which the node labels of the path sum to n. If no paths sum to n, return None.

    >>> print(only_paths(Tree(5, [Tree(2), Tree(1, [Tree(2)]), Tree(1, [Tree(1)])]), 7))
    5
      2
      1
        1
    >>> t = Tree(3, [Tree(4), Tree(1, [Tree(3, [Tree(2)]), Tree(2, [Tree(1)]), Tree(5), Tree(3)])])
    >>> print(only_paths(t, 7))
    3
      4
      1
        2
          1
        3
    >>> print(only_paths(t, 9))
    3
      1
        3
          2
        5
    >>> print(only_paths(t, 3))
    None
    """
    if _______:
         (a)
        return t
    new_branches = [_______ for b in t.branches]
                      (b)
    if _______(new_branches):
         (c)
        return Tree(t.label, [b for b in new_branches if _______])
                                                           (d)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 2, prompt: "Fill in blank (a).",
        type: "text", oneLine: true, check: false,
        answer: "t.is_leaf() and t.label == n",
        explain: `<p>A path ends at a leaf, and it qualifies exactly when the remaining target is used up by that leaf's own label. Only then is the leaf itself returned.</p>
<p>A leaf whose label misses the target falls through to the lines below, where <code>new_branches</code> is empty, <code>any([])</code> is <code>False</code>, and the function implicitly returns <code>None</code> — which is just what a dead end should produce.</p>`
      },
      {
        key: "b", label: "(b)", points: 3, prompt: "Fill in blank (b).",
        type: "text", oneLine: true, check: false,
        answer: "only_paths(b, n - t.label)",
        explain: `<p>Recurse into each branch, reducing the target by the label already consumed at this node. Each entry comes back as either a pruned subtree or <code>None</code>.</p>`
      },
      {
        key: "c", label: "(c)", points: 1, prompt: "Fill in blank (c).",
        type: "choice", options: ["all", "any", "has", "only_paths"],
        answer: "any",
        explain: `<p>This node is worth keeping if <i>at least one</i> branch leads to a qualifying path. Requiring <code>all</code> of them would throw away nodes that have even a single dead-end branch.</p>`
      },
      {
        key: "d", label: "(d)", points: 1, prompt: "Fill in blank (d).",
        type: "choice", options: ["only_paths(b, n)", "b.label == n", "b.label != n", "b is None", "b is not None"],
        answer: "b is not None",
        explain: `<p><code>new_branches</code> still contains the <code>None</code>s from branches that led nowhere; keep only the real subtrees. Note <code>b</code> here is already a result, so re-calling <code>only_paths</code> would be both wrong and wasteful.</p>`
      },
      {
        key: "aplus", label: "(e)", points: 0, aplus: true,
        prompt: "Fill in the blank to implement <code>only_long_paths</code>, which takes a <code>Tree</code> of numbers <code>t</code> and a number <code>n</code>. It returns a new <code>Tree</code> containing only the nodes of <code>t</code> that lie on a path from the root to a leaf for which <b>the sum of the labels plus the length of the path</b> is <code>n</code>. Do not mutate <code>t</code>. You may not write <code>and</code>, <code>or</code>, <code>if</code>, <code>[</code> or <code>]</code>. Assume <code>only_paths</code> is implemented correctly.",
        code: `only_paths = _______

def only_long_paths(t, n):
    """Return a Tree with only the nodes of t along paths from the root to a leaf of t
    for which the sum of node labels plus the length of the path is n.

    >>> example = Tree(5, [Tree(3), Tree(1, [Tree(2)]), Tree(1, [Tree(1)])])
    >>> only_long_paths(example, 10)   # paths 5-3 (length 2) and 5-1-1 (length 3)
    Tree(5, [Tree(3), Tree(1, [Tree(1)])])
    """
    return only_paths(t, n)`,
        type: "text", rows: 3, check: false,
        answer: "lambda t, n, f=only_paths: f(t, n - 1)",
        explain: `<p>Counting the path length is the same as charging <code>label + 1</code> at every node instead of <code>label</code>. Equivalently: before each node is processed, knock one extra off the target.</p>
<p>Rebinding the global name <code>only_paths</code> to a wrapper does this everywhere at once, because the original function looks <code>only_paths</code> up <i>by name</i> when it recurses — so every recursive call goes through the wrapper and loses another 1.</p>
<p>The default argument <code>f=only_paths</code> captures the original function at definition time; without it, the new binding would refer to itself and recurse forever.</p>`
      }
    ],
    runner: {
      label: "Fill in (a)–(d) — the A+ blank is checked separately below — then run the doctests.",
      code: `def only_paths(t, n):
    if {{a}}:
        return t
    new_branches = [{{b}} for b in t.branches]
    if {{c}}(new_branches):
        return Tree(t.label, [b for b in new_branches if {{d}}])

t = Tree(3, [Tree(4), Tree(1, [Tree(3, [Tree(2)]), Tree(2, [Tree(1)]), Tree(5), Tree(3)])])`,
      tests: [
        { expr: "only_paths(Tree(5, [Tree(2), Tree(1, [Tree(2)]), Tree(1, [Tree(1)])]), 7)",
          expected: "Tree(5, [Tree(2), Tree(1, [Tree(1)])])" },
        { expr: "only_paths(t, 7)", expected: "Tree(3, [Tree(4), Tree(1, [Tree(2, [Tree(1)]), Tree(3)])])" },
        { expr: "only_paths(t, 9)", expected: "Tree(3, [Tree(1, [Tree(3, [Tree(2)]), Tree(5)])])" },
        { expr: "only_paths(t, 3)", expected: "None" }
      ]
    }
  },
  {
    parts: [],
    runner: {
      label: "A+ check: fill in the A+ blank above, then run this. (A correct <code>only_paths</code> is supplied.)",
      prelude: `def only_paths(t, n):
    if t.is_leaf() and t.label == n:
        return t
    new_branches = [only_paths(b, n - t.label) for b in t.branches]
    if any(new_branches):
        return Tree(t.label, [b for b in new_branches if b is not None])`,
      code: `only_paths = {{aplus}}

def only_long_paths(t, n):
    return only_paths(t, n)

example = Tree(5, [Tree(3), Tree(1, [Tree(2)]), Tree(1, [Tree(1)])])`,
      tests: [
        { expr: "only_long_paths(example, 10)", expected: "Tree(5, [Tree(3), Tree(1, [Tree(1)])])" }
      ]
    }
  }]
},

// ------------------------------------------------------------------ Q6
{
  num: 6, title: "After Party", points: 6,
  intro: ["<p>Implement <code>after</code>, which takes a linked list <code>s</code> and values <code>a</code> and <code>b</code>. It returns whether an element of <code>s</code> equal to <code>b</code> appears after an element of <code>s</code> equal to <code>a</code>.</p>"],
  code: `def after(s, a, b):
    """Return whether b comes after a in linked list s.

    >>> t = Link(3, Link(6, Link(5, Link(4))))
    >>> after(t, 6, 4)
    True
    >>> after(t, 4, 6)
    False
    >>> after(t, 6, 6)
    False
    """
    def find(s, n, f):
        if s == Link.empty:
            return _______
                     (a)
        elif s.first == n:
            return f(s.rest)
        else:
            return find(s.rest, n, f)
    return find(s, a, lambda rest: _______)
                                     (b)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 1, prompt: "Fill in blank (a).",
        type: "choice", options: ["n", "True", "False", "a < b", "f(Link.empty)"],
        answer: "False",
        explain: `<p>Running off the end of the list without finding <code>n</code> means the thing being looked for is not there — so the whole search fails.</p>`
      },
      {
        key: "b", label: "(b)", points: 4, prompt: "Fill in blank (b). You may not use <code>or</code>, <code>and</code>, <code>if</code>, <code>[</code>, or <code>]</code>.",
        type: "text", rows: 2, check: false,
        answer: "find(rest, b, lambda r: True)",
        explain: `<p><code>find(s, a, f)</code> searches for the first <code>a</code> and then hands the <i>remainder</i> of the list to <code>f</code>. So the callback's job is to answer: does <code>b</code> appear in what is left?</p>
<p>That is another <code>find</code> — this time for <code>b</code>, with a callback that simply reports success. Note this also gives the right answer when <code>a == b</code>: the search for the second occurrence starts strictly after the first, so a single <code>6</code> correctly yields <code>False</code>.</p>`
      },
      {
        key: "c", label: "(c)", points: 1,
        prompt: "What is the order of growth of the run time of an efficient implementation of <code>after</code> in terms of the length of <code>s</code>? Here, efficient means that you have filled in the blanks to give the function the fastest order of growth.",
        type: "choice", plainOptions: true,
        options: ["Constant", "Logarithmic", "Linear", "Quadratic", "Exponential"],
        answer: "Linear",
        explain: `<p>The first <code>find</code> scans forward until it hits <code>a</code>; the second picks up where the first left off and scans the remainder. Together they walk each node at most once, so the time is proportional to the length of the list.</p>`
      }
    ],
    runner: {
      code: `def after(s, a, b):
    def find(s, n, f):
        if s == Link.empty:
            return {{a}}
        elif s.first == n:
            return f(s.rest)
        else:
            return find(s.rest, n, f)
    return find(s, a, lambda rest: {{b}})

t = Link(3, Link(6, Link(5, Link(4))))`,
      tests: [
        { expr: "after(t, 6, 4)", expected: "True" },
        { expr: "after(t, 4, 6)", expected: "False" },
        { expr: "after(t, 6, 6)", expected: "False" },
        { expr: "after(Link(1, Link(1)), 1, 1)", expected: "True" },
        { expr: "after(Link.empty, 1, 2)", expected: "False" }
      ]
    }
  }]
}

]});
