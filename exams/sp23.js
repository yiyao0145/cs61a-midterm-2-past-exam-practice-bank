// CS 61A Spring 2023 Midterm 2
EXAM_BANK.exams.push({
id: "sp23",
term: "Spring 2023",
points: 45,
questions: [

// ------------------------------------------------------------------ Q1
{
  num: 1, title: "What Would Python Display?", points: 6,
  intro: ["<p>Assume the following code has been executed.</p>"],
  code: `def chain(s):
    return [s[0], s[1:]]

silver = [2, chain([3, 4, 5])]
gold = [silver[0], silver[1].pop()]
silver[0] = 1
platinum = chain(chain([6, 7, 8]))`,
  after: [
    "<p>Write the output displayed by the interactive Python interpreter when each expression below is evaluated.</p>",
    "<p><i>Hint:</i> Try drawing an environment diagram! <i>Reminder:</i> <code>s.pop()</code> removes and returns the last item in list <code>s</code>.</p>"
  ],
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 2, prompt: "silver", promptCode: true,
        type: "text", oneLine: true, answer: "[1, [3]]",
        explain: `<p><code>chain([3, 4, 5])</code> returns <code>[3, [4, 5]]</code>, so <code>silver</code> starts as <code>[2, [3, [4, 5]]]</code>.</p>
<p>Then <code>silver[1].pop()</code> removes the last element of that inner list <code>[3, [4, 5]]</code> — the <code>[4, 5]</code> — leaving it as just <code>[3]</code>. Finally <code>silver[0] = 1</code> replaces the 2.</p>`
      },
      {
        key: "b", label: "(b)", points: 2, prompt: "gold", promptCode: true,
        type: "text", oneLine: true, answer: "[2, [4, 5]]",
        explain: `<p><code>gold</code> was built <i>before</i> <code>silver[0] = 1</code> ran, so its first element is the old value <code>2</code> — numbers are not shared references that change later.</p>
<p>Its second element is whatever <code>pop()</code> returned, which is the list <code>[4, 5]</code> that was removed from <code>silver</code>'s inner list.</p>`
      },
      {
        key: "c", label: "(c)", points: 2, prompt: "platinum", promptCode: true,
        type: "text", oneLine: true, answer: "[6, [[7, 8]]]",
        explain: `<p>Work outward from the inside: <code>chain([6, 7, 8])</code> is <code>[6, [7, 8]]</code>.</p>
<p>Now apply <code>chain</code> to that: its <code>s[0]</code> is <code>6</code> and its <code>s[1:]</code> is <code>[[7, 8]]</code> — a slice is always a list, so the single remaining element stays wrapped. The result is <code>[6, [[7, 8]]]</code>.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q2
{
  num: 2, title: "Letter Grade", points: 10,
  sections: [
    {
      label: "(a)", points: 4,
      intro: ["<p>Implement the <code>Letter</code> class. A <code>Letter</code> has two instance attributes: <code>contents</code> (a str) and <code>sent</code> (a bool). Each <code>Letter</code> can only be sent once. The <code>send</code> method prints whether the letter was sent, and if it was, returns the reply, which is a new <code>Letter</code> instance with the same contents, but in all caps. <i>Hint:</i> <code>'hi'.upper()</code> evaluates to <code>'HI'</code>.</p>"],
      code: `class Letter:
    """A letter receives an all-caps reply when sent successfully.

    >>> hi = Letter('Hello, World!')
    >>> hi.send()
    Hello, World! has been sent.
    HELLO, WORLD!
    >>> hi.send()
    Hello, World! was already sent.
    >>> Letter('Hey').send().send()
    Hey has been sent.
    HEY has been sent.
    HEY
    """
    def __init__(self, contents):
        self.contents = contents
        _______
          (a)

    def send(self):
        if self.sent:
            print(self, 'was already sent.')
        else:
            print(self, 'has been sent.')
            _______
              (b)
            return _______
                     (c)

    def __repr__(self):
        # Note: since no __str__ method is defined, the repr and str strings are the same.
        return self.contents`,
      parts: [
        {
          key: "a", label: "i.", points: 1, prompt: "Fill in blank (a).",
          type: "text", oneLine: true, check: false,
          answer: "self.sent = False",
          explain: `<p>A freshly created letter has not been sent yet, and <code>send</code> reads <code>self.sent</code> immediately — so the attribute has to exist from the start.</p>`
        },
        {
          key: "b", label: "ii.", points: 1, prompt: "Fill in blank (b).",
          type: "text", oneLine: true, check: false,
          answer: "self.sent = True",
          explain: `<p>Mark this letter as sent so that a second <code>send()</code> takes the "was already sent" branch — which is exactly what the second doctest line checks.</p>`
        },
        {
          key: "c", label: "iii.", points: 2, prompt: "Fill in blank (c).",
          type: "text", oneLine: true, check: false,
          answer: "Letter(self.contents.upper())",
          explain: `<p>The reply is a <i>new</i> <code>Letter</code> holding the uppercased contents. It must be a new object, not <code>self</code>: the last doctest calls <code>.send()</code> on the reply and expects it to succeed, which it could not do if the reply were the already-sent original.</p>`
        }
      ],
      runner: {
        code: `class Letter:
    def __init__(self, contents):
        self.contents = contents
        {{a}}
    def send(self):
        if self.sent:
            print(self, 'was already sent.')
        else:
            print(self, 'has been sent.')
            {{b}}
            return {{c}}
    def __repr__(self):
        return self.contents

_log = []
_real_print = print
def _capture(*args):
    _log.append(' '.join([str(a) for a in args]))

print = _capture
hi = Letter('Hello, World!')
r1 = hi.send()
r2 = hi.send()
r3 = Letter('Hey').send().send()
print = _real_print`,
        tests: [
          { expr: "_log[0]", expected: "'Hello, World! has been sent.'" },
          { expr: "repr(r1)", expected: "'HELLO, WORLD!'" },
          { expr: "_log[1]", expected: "'Hello, World! was already sent.'" },
          { expr: "r2", expected: "None" },
          { expr: "_log[2]", expected: "'Hey has been sent.'" },
          { expr: "_log[3]", expected: "'HEY has been sent.'" },
          { expr: "repr(r3)", expected: "'HEY'" }
        ]
      }
    },
    {
      label: "(b)", points: 6,
      intro: ["<p>Implement the <code>Numbered</code> class. A <code>Numbered</code> letter has a <code>number</code> attribute equal to how many numbered letters have previously been constructed. This number appears in its repr string. Assume <code>Letter</code> is implemented correctly.</p>"],
      code: `class Numbered(Letter):
    """A numbered letter has a different repr method that shows its number.

    >>> hey = Numbered('Hello, World!')
    >>> hey.send()
    #0 has been sent.
    HELLO, WORLD!
    >>> Numbered('Hi!').send()
    #1 has been sent.
    HI!
    >>> hey
    #0
    """
    number = 0

    def __init__(self, contents):
        super().__init__(contents)
        _______
          (d)
        _______
          (e)

    def __repr__(self):
        return '#' + _______
                       (f)`,
      parts: [
        {
          key: "d", label: "i.", points: 2, prompt: "Fill in blank (d).",
          type: "choice",
          options: ["Numbered.number = 0", "Numbered.number = number", "Numbered.number = self.number",
                    "self.number = 0", "self.number = number", "self.number = Numbered.number"],
          answer: "self.number = Numbered.number",
          explain: `<p>Give this instance its own <code>number</code> attribute, copied from the running class-level counter. That snapshot is why <code>hey</code> still shows <code>#0</code> after a second letter has been made.</p>
<p>Assigning to <code>Numbered.number</code> here would change the shared counter instead of recording this letter's number, and bare <code>number</code> is not in scope.</p>`
        },
        {
          key: "e", label: "ii.", points: 2, prompt: "Fill in blank (e).",
          type: "text", oneLine: true, check: false,
          answer: "Numbered.number = Numbered.number + 1",
          accept: ["Numbered.number += 1"],
          explain: `<p>Now advance the shared counter so the <i>next</i> numbered letter gets the following number. This must target the class attribute — <code>self.number += 1</code> would only bump this one instance.</p>`
        },
        {
          key: "f", label: "iii.", points: 2, prompt: "Fill in blank (f).",
          type: "text", oneLine: true, check: false,
          answer: "str(self.number)",
          explain: `<p><code>'#'</code> is a string and <code>self.number</code> is an integer, so it has to be converted before concatenating.</p>`
        }
      ],
      runner: {
        label: "Fill in (i)–(iii), then run the doctest. (A correct <code>Letter</code> is supplied. Note: the in-browser Python does not support zero-argument <code>super()</code>, so the supplied skeleton calls <code>Letter.__init__(self, contents)</code> instead.)",
        prelude: `class Letter:
    def __init__(self, contents):
        self.contents = contents
        self.sent = False
    def send(self):
        if self.sent:
            print(self, 'was already sent.')
        else:
            print(self, 'has been sent.')
            self.sent = True
            return Letter(self.contents.upper())
    def __repr__(self):
        return self.contents`,
        code: `class Numbered(Letter):
    number = 0
    def __init__(self, contents):
        Letter.__init__(self, contents)
        {{d}}
        {{e}}
    def __repr__(self):
        return '#' + {{f}}

_log = []
_real_print = print
def _capture(*args):
    _log.append(' '.join([str(a) for a in args]))

print = _capture
hey = Numbered('Hello, World!')
r1 = hey.send()
r2 = Numbered('Hi!').send()
print = _real_print`,
        tests: [
          { expr: "_log[0]", expected: "'#0 has been sent.'" },
          { expr: "repr(r1)", expected: "'HELLO, WORLD!'" },
          { expr: "_log[1]", expected: "'#1 has been sent.'" },
          { expr: "repr(hey)", expected: "'#0'" }
        ]
      }
    }
  ]
},

// ------------------------------------------------------------------ Q3
{
  num: 3, title: "Prefixes", points: 9,
  intro: ["<p><b>Definition.</b> A <i>prefix sum</i> of a sequence of numbers is the sum of the first <code>n</code> elements for some positive length <code>n</code>.</p>"],
  sections: [
    {
      label: "(a)", points: 4,
      intro: ["<p>Implement <code>prefix</code>, which takes a list of numbers <code>s</code> and returns a list of the prefix sums of <code>s</code> in increasing order of the length of the prefix.</p>"],
      code: `def prefix(s):
    """Return a list of all prefix sums of list s.

    >>> prefix([1, 2, 3, 0, 4, 5])
    [1, 3, 6, 6, 10, 15]
    >>> prefix([2, 2, 2, 0, -5, 5])
    [2, 4, 6, 6, 1, 6]
    """
    return [_______ for k in _______]
              (a)              (b)`,
      parts: [
        {
          key: "a", label: "i.", points: 2, prompt: "Fill in blank (a).",
          type: "text", oneLine: true, check: false,
          answer: "sum(s[:k+1])",
          accept: ["sum(s[:k + 1])"],
          explain: `<p>The <code>k</code>th entry of the result is the sum of the first <code>k + 1</code> elements — the <code>+ 1</code> because the shortest prefix has length 1, not 0.</p>`
        },
        {
          key: "b", label: "ii.", points: 1, prompt: "Fill in blank (b).",
          type: "choice", options: ["s", "[s]", "s[1:]", "range(s)", "range(len(s))"],
          answer: "range(len(s))",
          explain: `<p><code>k</code> is used as an index, so it has to run over positions — and there is exactly one prefix sum per element.</p>`
        },
        {
          key: "c", label: "iii.", points: 1,
          prompt: "What is the order of growth of the time to run this alternate implementation in terms of the length of <code>s</code>? Assume that the <code>append</code> method of a list takes just 1 step (constant time).",
          code: `def prefix(s):
    """Return a list of all prefix sums of list s."""
    t = 0
    result = []
    for x in s:
        t = t + x
        result.append(t)
    return result`,
          type: "choice", plainOptions: true,
          options: ["Constant", "Logarithmic", "Linear", "Quadratic", "Exponential"],
          answer: "Linear",
          explain: `<p>This version keeps a running total, so each element costs one addition and one append — a single pass, linear in the length of <code>s</code>.</p>
<p>Worth contrasting with the comprehension above: that one re-sums a slice of length <code>k</code> for each <code>k</code>, which makes it quadratic.</p>`
        }
      ],
      runner: {
        code: `def prefix(s):
    return [{{a}} for k in {{b}}]`,
        tests: [
          { expr: "prefix([1, 2, 3, 0, 4, 5])", expected: "[1, 3, 6, 6, 10, 15]" },
          { expr: "prefix([2, 2, 2, 0, -5, 5])", expected: "[2, 4, 6, 6, 1, 6]" },
          { expr: "prefix([])", expected: "[]" },
          { expr: "prefix([7])", expected: "[7]" }
        ]
      }
    },
    {
      label: "(b)", points: 5,
      intro: ["<p>Implement <code>tens</code>, which takes a non-empty linked list of numbers <code>s</code> represented as a <code>Link</code> instance. It prints all of the prefix sums of <code>s</code> that are multiples of 10 in increasing order of the length of the prefix.</p>"],
      code: `def tens(s):
    """Print all prefix sums of Link s that are multiples of ten.

    >>> tens(Link(3, Link(9, Link(8, Link(10, Link(0, Link(14, Link(6))))))))
    20
    30
    30
    50
    """
    def f(suffix, total):
        if total % 10 == 0:
            print(total)
        if _______:
             (d)
            _______
              (e)
    _______
      (f)`,
      parts: [
        {
          key: "d", label: "i.", points: 1, prompt: "Fill in blank (d).",
          type: "choice",
          options: ["s is not Link.empty", "s.rest is not Link.empty", "s.rest.rest is not Link.empty",
                    "suffix is not Link.empty", "suffix.rest is not Link.empty", "suffix.rest.rest is not Link.empty"],
          answer: "suffix is not Link.empty",
          explain: `<p><code>suffix</code> is the part of the list still to be added; stop recursing once it is empty. Testing <code>s</code> would never change (it is the whole list) and would loop forever.</p>`
        },
        {
          key: "e", label: "ii.", points: 2, prompt: "Fill in blank (e).",
          type: "text", oneLine: true, check: false,
          answer: "f(suffix.rest, total + suffix.first)",
          explain: `<p>Take one step down the list and fold that element into the running total. The next call then checks <i>that</i> longer prefix sum against the multiple-of-ten test.</p>`
        },
        {
          key: "f", label: "iii.", points: 2, prompt: "Fill in blank (f).",
          type: "text", oneLine: true, check: false,
          answer: "f(s.rest, s.first)",
          explain: `<p>Start the recursion with the shortest prefix: the total is just the first element, and what remains to process is <code>s.rest</code>. Starting with <code>f(s, 0)</code> would print a spurious <code>0</code>, since 0 is a multiple of ten.</p>`
        }
      ],
      runner: {
        code: `def tens(s):
    def f(suffix, total):
        if total % 10 == 0:
            print(total)
        if {{d}}:
            {{e}}
    {{f}}

_log = []
_real_print = print
def _capture(*args):
    _log.append(' '.join([str(a) for a in args]))

print = _capture
tens(Link(3, Link(9, Link(8, Link(10, Link(0, Link(14, Link(6))))))))
first = list(_log)
_log = []
tens(Link(5, Link(5)))
second = list(_log)
print = _real_print`,
        tests: [
          { expr: "first", expected: "['20', '30', '30', '50']" },
          { expr: "second", expected: "['10']" }
        ]
      }
    }
  ]
},

// ------------------------------------------------------------------ Q4
{
  num: 4, title: "Tree Trimming", points: 10,
  sections: [
    {
      label: "(a)", points: 7,
      intro: ["<p>Implement <code>exclude</code>, which takes a <code>Tree</code> instance <code>t</code> and a value <code>x</code>. It returns a <code>Tree</code> containing the root node of <code>t</code> as well as each non-root node of <code>t</code> with a label not equal to <code>x</code>. The parent of a node in the result is its nearest ancestor node that is not excluded. The input <code>t</code> must not be modified.</p>"],
      code: `def exclude(t, x):
    """Return a Tree with the non-root nodes of t whose labels are not equal to x.

    >>> t = Tree(1, [Tree(2, [Tree(2), Tree(3)]), Tree(4, [Tree(1)])])
    >>> exclude(t, 2)
    Tree(1, [Tree(3), Tree(4, [Tree(1)])])
    >>> t                  # t is not changed
    Tree(1, [Tree(2, [Tree(2), Tree(3)]), Tree(4, [Tree(1)])])
    >>> exclude(t, 1)      # The root node cannot be excluded
    Tree(1, [Tree(2, [Tree(2), Tree(3)]), Tree(4)])
    """
    filtered_branches = map(lambda y: _______, t.branches)
                                         (a)
    bs = []
    for b in filtered_branches:
        if _______:
              (b)
            bs._______(_______)
                 (c)      (d)
        else:
            bs.append(b)
    return Tree(t.label, bs)`,
      parts: [
        {
          key: "a", label: "i.", points: 2, prompt: "Fill in blank (a).",
          type: "text", oneLine: true, check: false,
          answer: "exclude(y, x)",
          explain: `<p>Clean each branch first, recursively, so that by the time the loop inspects <code>b</code> everything beneath it has already been filtered. Building new <code>Tree</code> objects all the way down is also what leaves the input unmodified.</p>`
        },
        {
          key: "b", label: "ii.", points: 2, prompt: "Fill in blank (b).",
          type: "text", oneLine: true, check: false,
          answer: "b.label == x",
          explain: `<p>A branch whose own label is the excluded value must disappear — but its children should survive, re-attached to this node. That is the case handled by the <code>if</code> branch; everything else is simply kept.</p>`
        },
        {
          key: "c", label: "iii.", points: 1, prompt: "Fill in blank (c).",
          type: "choice", options: ["remove", "pop", "append", "extend"],
          answer: "extend",
          explain: `<p>The excluded node's children are a <i>list</i> of trees that all need to be added individually. <code>append</code> would nest that list inside <code>bs</code> as a single element.</p>`
        },
        {
          key: "d", label: "iv.", points: 2, prompt: "Fill in blank (d).",
          type: "choice",
          options: ["b", "b.branches", "exclude(b, x)", "Tree(b.label, [exclude(y, x) for y in b.branches])"],
          answer: "b.branches",
          explain: `<p>Promote the excluded node's children to take its place. They are already filtered — <code>b</code> came out of <code>filtered_branches</code> — so no further recursion is needed here (and calling <code>exclude(b, x)</code> again would keep the node we are trying to drop).</p>`
        }
      ],
      runner: {
        code: `def exclude(t, x):
    filtered_branches = map(lambda y: {{a}}, t.branches)
    bs = []
    for b in filtered_branches:
        if {{b}}:
            bs.{{c}}({{d}})
        else:
            bs.append(b)
    return Tree(t.label, bs)

t = Tree(1, [Tree(2, [Tree(2), Tree(3)]), Tree(4, [Tree(1)])])
r1 = exclude(t, 2)
r2 = exclude(t, 1)`,
        tests: [
          { expr: "r1", expected: "Tree(1, [Tree(3), Tree(4, [Tree(1)])])" },
          { expr: "t", expected: "Tree(1, [Tree(2, [Tree(2), Tree(3)]), Tree(4, [Tree(1)])])" },
          { expr: "r2", expected: "Tree(1, [Tree(2, [Tree(2), Tree(3)]), Tree(4)])" }
        ]
      }
    },
    {
      label: "(b)", points: 3,
      intro: ["<p>Implement <code>remove</code>, which takes a <code>Tree</code> instance <code>t</code> and a value <code>x</code>. It removes all non-root nodes from <code>t</code> that have a label equal to <code>x</code>, then returns <code>t</code>. The parent of a node in <code>t</code> is its nearest ancestor that is not removed. Assume that <code>exclude</code> is implemented correctly.</p>"],
      code: `def remove(t, x):
    """Remove all non-root nodes labeled x from t and return t.

    >>> t = Tree(1, [Tree(2, [Tree(2), Tree(3)]), Tree(4)])
    >>> remove(t, 2)
    Tree(1, [Tree(3), Tree(4)])
    >>> remove(t, 3)   # t was changed, so both 2 and 3 are now removed.
    Tree(1, [Tree(4)])
    """
    _______
      (e)
    return t`,
      parts: [{
        key: "e", label: "i.", points: 3, prompt: "Fill in blank (e).",
        type: "text", oneLine: true, check: false,
        answer: "t.branches = exclude(t, x).branches",
        explain: `<p><code>exclude</code> already computes the right shape, but it builds a <i>new</i> tree — and this function has to change <code>t</code> itself, since the second doctest relies on the first call having mutated it.</p>
<p>Taking the result's <code>branches</code> and assigning them onto <code>t</code> transplants the cleaned structure into the original object. Assigning <code>t = exclude(t, x)</code> instead would only rebind a local name and leave the caller's tree untouched.</p>`
      }],
      runner: {
        label: "Fill in the blank, then run the doctests. (A correct <code>exclude</code> is supplied.)",
        prelude: `def exclude(t, x):
    filtered_branches = map(lambda y: exclude(y, x), t.branches)
    bs = []
    for b in filtered_branches:
        if b.label == x:
            bs.extend(b.branches)
        else:
            bs.append(b)
    return Tree(t.label, bs)`,
        // remove returns t itself, so each result is recorded as a string at
        // the time of the call — otherwise the later call's mutation would
        // show up in the earlier result.
        code: `def remove(t, x):
    {{e}}
    return t

t = Tree(1, [Tree(2, [Tree(2), Tree(3)]), Tree(4)])
r1 = repr(remove(t, 2))
r2 = repr(remove(t, 3))`,
        tests: [
          { expr: "r1", expected: "'Tree(1, [Tree(3), Tree(4)])'" },
          { expr: "r2", expected: "'Tree(1, [Tree(4)])'" },
          { expr: "t", expected: "Tree(1, [Tree(4)])" }
        ]
      }
    }
  ]
},

// ------------------------------------------------------------------ Q5
{
  num: 5, title: "Parking", points: 10,
  intro: [
    "<p><b>Definition.</b> When parking vehicles in a row, a <i>motorcycle</i> takes up 1 parking spot and a <i>car</i> takes up 2 adjacent parking spots. A string of length <code>n</code> can represent <code>n</code> adjacent parking spots using <code>%</code> for a motorcycle, <code>&lt;&gt;</code> for a car, and <code>.</code> for an empty spot. For example <code>'.%%.&lt;&gt;&lt;&gt;'</code> represents an empty spot, then two spots containing motorcycles, then another empty spot, then four spots containing two cars.</p>",
    "<p><i>Thanks to the Berkeley Math Circle for introducing this question.</i></p>"
  ],
  sections: [
    {
      label: "(a)", points: 4,
      intro: ["<p>Implement <code>count_park</code>, which returns the number of ways that vehicles can be parked in <code>n</code> adjacent parking spots for positive integer <code>n</code>. Some or all spots can be empty.</p>"],
      code: `def count_park(n):
    """Count the ways to park cars and motorcycles in n adjacent spots.

    >>> count_park(1)   # '.' or '%'
    2
    >>> count_park(2)   # '..', '.%', '%.', '%%', or '<>'
    5
    >>> count_park(4)   # some examples: '<><>', '.%%.', '%<>%', '%.<>'
    29
    """
    if n < 0:
        return 0
    if n == 0:
        return _______
                 (a)
    return _______
             (b)`,
      parts: [
        {
          key: "a", label: "i.", points: 1, prompt: "Fill in blank (a).",
          type: "text", oneLine: true, check: false,
          answer: "1",
          explain: `<p>There is exactly one way to park nothing in zero spots: the empty arrangement. Returning 0 here would make every larger count collapse to nothing.</p>`
        },
        {
          key: "b", label: "ii.", points: 3, prompt: "Fill in blank (b).",
          type: "text", oneLine: true, check: false,
          answer: "2 * count_park(n - 1) + count_park(n - 2)",
          accept: ["count_park(n - 1) + count_park(n - 1) + count_park(n - 2)"],
          explain: `<p>Decide what occupies the first spot. It is either empty or a motorcycle — two choices, each leaving <code>n - 1</code> spots free — or it is the left half of a car, which uses two spots and leaves <code>n - 2</code>.</p>
<p>The <code>n &lt; 0</code> guard above is what makes the car term safe when only one spot remains.</p>`
        }
      ],
      runner: {
        code: `def count_park(n):
    if n < 0:
        return 0
    if n == 0:
        return {{a}}
    return {{b}}`,
        tests: [
          { expr: "count_park(1)", expected: "2" },
          { expr: "count_park(2)", expected: "5" },
          { expr: "count_park(4)", expected: "29" },
          { expr: "count_park(3)", expected: "12" },
          { expr: "count_park(5)", expected: "70" }
        ]
      }
    },
    {
      label: "(b)", points: 6,
      intro: ["<p>Implement <code>park</code>, a generator function that takes a non-negative integer <code>n</code>. It yields (in any order) all possible strings representing <code>n</code> adjacent parking spots.</p>"],
      code: `def park(n):
    """Yield the ways to park cars and motorcycles in n adjacent spots.

    >>> sorted(park(1))
    ['%', '.']
    >>> sorted(park(2))
    ['%%', '%.', '.%', '..', '<>']
    >>> sorted(park(3))
    ['%%%', '%%.', '%.%', '%..', '%<>', '.%%', '.%.', '..%', '...', '.<>', '<>%', '<>.']
    >>> len(list(park(4)))
    29
    """
    if n == 0:
        yield ''
    elif n > 0:
        for s in park(n-1):
            _______
              (c)
            _______
              (d)
        for s in _______:
                   (e)
            _______
              (f)`,
      parts: [
        {
          key: "cd", label: "i.", points: 3,
          prompt: "Fill in blanks (c) and (d) with two lines of code. You may not use <code>yield from</code>.",
          type: "text", rows: 2, check: false,
          answer: "yield '.' + s\nyield '%' + s",
          explain: `<p>Each arrangement of <code>n - 1</code> spots extends to two arrangements of <code>n</code> spots: put an empty spot in front, or put a motorcycle in front. Both are yielded for every <code>s</code>.</p>
<p>The order of the two lines does not matter — the doctests sort the results.</p>`
        },
        {
          key: "e", label: "ii.", points: 1, prompt: "Fill in blank (e).",
          type: "choice", plainOptions: false,
          options: ["park(n)", "park(n-1)", "park(n-2)", "park(n+1)", "range(n)"],
          answer: "park(n-2)",
          explain: `<p>The remaining possibility is a car in front, and a car occupies two spots — so what follows it is any arrangement of <code>n - 2</code> spots.</p>
<p>When <code>n</code> is 1 this calls <code>park(-1)</code>, which yields nothing (neither branch runs), so no invalid one-spot car is produced.</p>`
        },
        {
          key: "f", label: "iii.", points: 2, prompt: "Fill in blank (f).",
          type: "text", oneLine: true, check: false,
          answer: "yield '<>' + s",
          explain: `<p>Prefix the car — written as the two characters <code>&lt;&gt;</code> — onto each shorter arrangement.</p>`
        }
      ],
      runner: {
        code: `def park(n):
    if n == 0:
        yield ''
    elif n > 0:
        for s in park(n-1):
            {{cd}}
        for s in {{e}}:
            {{f}}`,
        tests: [
          { expr: "sorted(park(1))", expected: "['%', '.']" },
          { expr: "sorted(park(2))", expected: "['%%', '%.', '.%', '..', '<>']" },
          { expr: "sorted(park(3))", expected: "['%%%', '%%.', '%.%', '%..', '%<>', '.%%', '.%.', '..%', '...', '.<>', '<>%', '<>.']" },
          { expr: "len(list(park(4)))", expected: "29" },
          { expr: "list(park(0))", expected: "['']" }
        ]
      }
    },
    {
      label: "(c)", points: 0,
      intro: ["<p>Implement <code>pack</code>, a generator function that takes a non-negative integer <code>n</code>. It yields (in any order) all possible strings representing <code>n</code> adjacent parking spots in which an equal number of cars and motorcycles are parked, no motorcycle is adjacent to a car, and no empty spot is adjacent to another empty spot.</p>"],
      code: `def pack(n):
    """Yield the ways to park an equal number of cars and motorcycles
    in n adjacent spots with no motorcycle adjacent to a car and no
    empty spot adjacent to another empty spot.

    >>> sorted(pack(4))
    ['%.<>', '<>.%']
    >>> sorted(pack(7))
    ['%%.<><>', '<><>.%%']
    >>> sorted(pack(8))
    ['%%.<>.<>', '%%.<><>.', '%.%.<><>', '%.<><>.%', '.%%.<><>',
     '.<><>.%%', '<>.%%.<>', '<>.<>.%%', '<><>.%%.', '<><>.%.%']
    """
    def f(n, k):
        if n == 0 and k == 0:
            yield ''
        elif n > 0:
            yield from g(n-1, k-1, '<', '%' )
            yield from g(n-1, k,   '.', '.' )
            yield from g(n-2, k+1, '%', '<>')

    def g(n, k, no, yes):
        yield from _______

    yield from f(n, 0)`,
      parts: [{
        key: "aplus", label: "i.", points: 0, aplus: true,
        prompt: "Fill in the blank.",
        type: "text", rows: 3, check: false,
        answer: "(yes + s for s in f(n, k) if not s.startswith(no))",
        accept: ["[yes + s for s in f(n, k) if not s.startswith(no)]"],
        explain: `<p>Read the three calls to <code>g</code> as "place <code>yes</code> at the front, and refuse whatever may not sit next to it (<code>no</code>)".</p>
<ul>
<li><code>g(n-1, k-1, '&lt;', '%')</code> — place a motorcycle; the rest must not begin with <code>&lt;</code>, i.e. a car.</li>
<li><code>g(n-1, k, '.', '.')</code> — place an empty spot; the rest must not begin with another empty spot.</li>
<li><code>g(n-2, k+1, '%', '&lt;&gt;')</code> — place a car (two spots); the rest must not begin with a motorcycle.</li>
</ul>
<p>So <code>g</code> generates the arrangements of what is left, drops any that start with the forbidden character, and prefixes <code>yes</code> to the survivors. The <code>k</code> parameter tracks the running balance of cars versus motorcycles, and the base case demands it return to 0 — that is the "equal numbers" condition.</p>`
      }],
      runner: {
        label: "Fill in the blank, then run the doctests. (The in-browser Python mis-handles deeply recursive <code>yield from</code>, so the surrounding code uses equivalent explicit loops — and it loses the closure over <code>no</code>/<code>yes</code> in a lazy generator expression, so write the bracketed list-comprehension form here if you want this to run.)",
        code: `def pack(n):
    def f(n, k):
        if n == 0 and k == 0:
            yield ''
        elif n > 0:
            for __a in g(n-1, k-1, '<', '%' ):
                yield __a
            for __b in g(n-1, k,   '.', '.' ):
                yield __b
            for __c in g(n-2, k+1, '%', '<>'):
                yield __c

    def g(n, k, no, yes):
        for __y in {{aplus}}:
            yield __y

    for __z in f(n, 0):
        yield __z`,
        tests: [
          { expr: "sorted(pack(4))", expected: "['%.<>', '<>.%']" },
          { expr: "sorted(pack(7))", expected: "['%%.<><>', '<><>.%%']" },
          { expr: "sorted(pack(8))", expected: "['%%.<>.<>', '%%.<><>.', '%.%.<><>', '%.<><>.%', '.%%.<><>', '.<><>.%%', '<>.%%.<>', '<>.<>.%%', '<><>.%%.', '<><>.%.%']" }
        ]
      }
    }
  ]
}

]});
