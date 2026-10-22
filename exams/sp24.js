// CS 61A Spring 2024 Midterm 2
EXAM_BANK.exams.push({
id: "sp24",
term: "Spring 2024",
points: 50,
questions: [

// ------------------------------------------------------------------ Q1
{
  num: 1, title: "What Would Python Display?", points: 7,
  intro: ["<p>Assume the following code has been executed.</p>"],
  code: `def shake(it):
    if it is not Link.empty and it.rest is not Link.empty:
        if it.first + 1 < it.rest.first:
            it.rest = Link(it.rest.first-1, it.rest)
            shake(it)
        else:
            shake(it.rest)

it = Link(2, Link(5, Link(7)))
off = Link(1, it.rest)
shake(it)

def cruel(summer):
    while summer is not Link.empty:
        yield summer.first
        summer = summer.rest
        if summer is not Link.empty:
            summer = summer.rest

summer = Link(1, Link(2, Link(3, Link(4))))`,
  after: ["<p>Write the output printed for each expression below or <i>Error</i> if an error occurs.</p>"],
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 2, prompt: "print(it)", promptCode: true,
        type: "choice",
        options: ["<2 5 7>", "<2 4 5 7>", "<2 4 5 6 7>", "<2 3 4 5 7>", "<2 4 3 5 7>", "<2 3 4 5 6 7>", "<2 4 3 5 6 7>"],
        answer: "<2 3 4 5 6 7>",
        explain: `<p><code>shake</code> walks the list and, whenever two neighbours differ by more than 1, splices in a new node holding <code>rest.first - 1</code> — then re-examines the same position. Starting from <code>&lt;2 5 7&gt;</code>:</p>
<ul>
<li>2 and 5 differ by more than 1 → insert 4, giving <code>&lt;2 4 5 7&gt;</code>; re-check at 2.</li>
<li>2 and 4 still differ → insert 3, giving <code>&lt;2 3 4 5 7&gt;</code>; re-check at 2.</li>
<li>2 and 3 are consecutive, so move on; 3-4 and 4-5 are fine too.</li>
<li>5 and 7 differ → insert 6, giving <code>&lt;2 3 4 5 6 7&gt;</code>.</li>
</ul>
<p>The result is a fully consecutive run from 2 to 7. Note this is <code>print</code>, so the <code>&lt;…&gt;</code> form from <code>__str__</code> is displayed, not the <code>Link(...)</code> repr.</p>`
      },
      {
        key: "b", label: "(b)", points: 2, prompt: "print(off)", promptCode: true,
        type: "text", oneLine: true, answer: "<1 5 6 7>",
        explain: `<p><code>off</code> was built as <code>Link(1, it.rest)</code> <i>before</i> <code>shake</code> ran, so its tail is the very same node chain that started at 5. The insertions between 2 and 5 happened in nodes that <code>off</code> does not include, but the 6 inserted between 5 and 7 is inside that shared tail — so it shows up here.</p>`
      },
      {
        key: "c", label: "(c)", points: 2, prompt: "print([x*x for x in cruel(summer)])", promptCode: true,
        type: "text", oneLine: true, answer: "[1, 9]",
        explain: `<p><code>cruel</code> yields an element and then advances <i>twice</i>, so it emits every other element: 1 and 3 from <code>&lt;1 2 3 4&gt;</code>. Squaring gives <code>[1, 9]</code>.</p>`
      },
      {
        key: "d", label: "(d)", points: 1,
        prompt: "What is the order of growth of the time it takes to evaluate <code>shake(Link(1, Link(n)))</code> in terms of <code>n</code>?",
        type: "choice", plainOptions: true,
        options: ["exponential", "quadratic", "linear", "constant"],
        answer: "linear",
        explain: `<p>Each insertion fills in exactly one missing integer between 1 and <code>n</code>, so about <code>n</code> nodes get created, and after each insertion the walk resumes from the same place and immediately moves on. The total work grows in proportion to <code>n</code>.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q2
{
  num: 2, title: "Spin Cycle", points: 6,
  intro: ["<p>Answer the questions about the code below. (The original exam supplied a blank environment diagram; do not add frames for calls to built-in functions such as <code>print</code>.)</p>"],
  code: ` 1: def cycle(a):
 2:     def f(rest):
 3:         rest.append(a.pop())
 4:         return [rest.append(a)]
 5:     b = []
 6:     a = f(b)
 7:     b = b + [5]
 8:     print(a)
 9:     print(b)
10:
11: c = [2, 3, 4]
12: cycle(c)
13: print(c)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 2, prompt: "What would be printed by the expression <code>print(a)</code> on line 8?",
        type: "text", oneLine: true, answer: "[None]",
        explain: `<p>Line 6 rebinds the local <code>a</code> to whatever <code>f(b)</code> returns. Inside <code>f</code>, the returned value is <code>[rest.append(a)]</code> — and <code>list.append</code> returns <code>None</code>. So <code>a</code> becomes a one-element list holding <code>None</code>.</p>
<p>(The append still happens as a side effect: <code>b</code> gains a reference to the original list.)</p>`
      },
      {
        key: "b", label: "(b)", points: 2, prompt: "What would be printed by the expression <code>print(b)</code> on line 9?",
        type: "text", oneLine: true, answer: "[4, [2, 3], 5]",
        explain: `<p>Inside <code>f</code>: <code>rest.append(a.pop())</code> pops <code>4</code> off the original list and appends it, so <code>b</code> is <code>[4]</code> and <code>c</code> is down to <code>[2, 3]</code>. Then <code>rest.append(a)</code> appends the list object itself, so <code>b</code> is <code>[4, [2, 3]]</code>.</p>
<p>Line 7 then makes a <i>new</i> list <code>b + [5]</code> and rebinds <code>b</code> to it, giving <code>[4, [2, 3], 5]</code>.</p>`
      },
      {
        key: "c", label: "(c)", points: 2, prompt: "What would be printed by the expression <code>print(c)</code> on line 13?",
        type: "text", oneLine: true, answer: "[2, 3]",
        explain: `<p><code>c</code> is the list that was passed in. The only thing that happened to it was <code>a.pop()</code>, which removed the <code>4</code>. Rebinding the parameter <code>a</code> on line 6 does not affect the caller's <code>c</code>, and the embedded reference inside <code>b</code> does not change its contents.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q3
{
  num: 3, title: "Fearless", points: 8,
  intro: [
    "<p>If you sing lyrics into a mic, every connected speaker repeats them.</p>",
    "<p>A <code>Mic</code> instance has a dictionary <code>speakers</code> containing <code>Speaker</code> instances as values, each with its location (str) as its key. Its <code>sing</code> method takes a string <code>lyrics</code> and invokes the <code>repeat</code> method of each <code>Speaker</code> instance connected to it.</p>",
    "<p>A <code>Speaker</code> takes a <code>transform</code> function that takes and returns a string. To connect a <code>Speaker</code> instance to <code>m</code> (a <code>Mic</code>) in a <code>location</code> (str), add that instance to the <code>speakers</code> dictionary of <code>m</code> in that location. To repeat a signal <code>s</code> (str), return the result of calling the speaker's <code>transform</code> function on <code>s</code>.</p>",
    "<p>Every <code>Mic</code> starts connected to a <code>Speaker</code> in the <code>Front</code> location that repeats the exact same signal it receives. The <code>str.lower</code> and <code>str.upper</code> functions return lowercased and uppercased versions of a string, respectively.</p>"
  ],
  code: `class Mic:
    """A microphone connected to speakers.

    >>> m = Mic()      # Front is connected automatically
    >>> m.sing('Is this thing on?')
    Front - Is this thing on?
    >>> Speaker(str.lower).connect(m, 'Left Side')
    >>> Speaker(str.upper).connect(m, 'Right Side')
    >>> m.sing("You belong with me.")
    Front - You belong with me.
    Left Side - you belong with me.
    Right Side - YOU BELONG WITH ME.
    """
    def __init__(self):
        self.speakers = _______
                          (a)

    def sing(self, lyrics):
        for k in self.speakers.keys():    # iterate over the keys of a dictionary
            print(k, '-', _______.repeat(lyrics))
                            (b)

class Speaker:
    def __init__(self, transform):
        self.transform = transform

    def connect(self, m, location):
        _______
          (c)

    def repeat(self, s):
        return _______
                 (d)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 3, prompt: "Fill in blank (a).",
        type: "text", oneLine: true, check: false,
        answer: "{'Front': Speaker(lambda s: s)}",
        accept: ["{'Front': Speaker(lambda x: x)}"],
        explain: `<p>Every mic starts with one speaker already attached, at the key <code>'Front'</code>, and that speaker must repeat its input unchanged — so its <code>transform</code> is the identity function.</p>`
      },
      {
        key: "b", label: "(b)", points: 2, prompt: "Fill in blank (b).",
        type: "choice",
        options: ["self", "self.speaker", "self.speakers", "self.speakers[k]", "self.speakers[k].self",
                  "speaker", "speakers", "speakers[k]", "speakers[k].self"],
        answer: "self.speakers[k]",
        explain: `<p>The loop runs over the dictionary's keys, so <code>k</code> is a location string. Looking that key up gives the <code>Speaker</code> instance whose <code>repeat</code> method should be called.</p>`
      },
      {
        key: "c", label: "(c)", points: 2, prompt: "Fill in blank (c).",
        type: "text", oneLine: true, check: false,
        answer: "m.speakers[location] = self",
        explain: `<p>"To connect a <code>Speaker</code> instance to <code>m</code> in a <code>location</code>, add that instance to the <code>speakers</code> dictionary of <code>m</code> in that location." The instance being connected is <code>self</code>.</p>`
      },
      {
        key: "d", label: "(d)", points: 1, prompt: "Fill in blank (d).",
        type: "choice",
        options: ["s", "lyrics", "transform", "transform(s)", "transform(lyrics)",
                  "self.transform", "self.transform(s)", "self.transform(lyrics)"],
        answer: "self.transform(s)",
        explain: `<p><code>transform</code> is an instance attribute, so it needs <code>self.</code>, and <code>s</code> is this method's own parameter (<code>lyrics</code> belongs to <code>Mic.sing</code> and is not in scope here).</p>`
      }
    ],
    runner: {
      code: `class Mic:
    def __init__(self):
        self.speakers = {{a}}
    def sing(self, lyrics):
        for k in self.speakers.keys():
            print(k, '-', {{b}}.repeat(lyrics))

class Speaker:
    def __init__(self, transform):
        self.transform = transform
    def connect(self, m, location):
        {{c}}
    def repeat(self, s):
        return {{d}}

_log = []
_real_print = print
def _capture(*args):
    _log.append(' '.join([str(a) for a in args]))

print = _capture
m = Mic()
m.sing('Is this thing on?')
Speaker(str.lower).connect(m, 'Left Side')
Speaker(str.upper).connect(m, 'Right Side')
m.sing("You belong with me.")
print = _real_print
_out = _log`,
      tests: [
        { expr: "_out[0]", expected: "'Front - Is this thing on?'" },
        { expr: "_out[1]", expected: "'Front - You belong with me.'" },
        { expr: "sorted(_out[2:])", expected: "['Left Side - you belong with me.', 'Right Side - YOU BELONG WITH ME.']" },
        { expr: "len(_out)", expected: "4" }
      ]
    }
  }]
},

// ------------------------------------------------------------------ Q4
{
  num: 4, title: "Who's counting?", points: 29,
  intro: ["<p><b>Definition.</b> A <i>strip</i> is a list of integers in which each integer is one more than the last. For example, <code>[3, 4, 5, 6]</code> is a strip. Empty and one-element lists are strips.</p>"],
  sections: [
    {
      label: "(a)", points: 4,
      intro: ["<p>Implement <code>is_strip</code>, which takes a list of integers <code>s</code> and returns whether it is a strip.</p>"],
      code: `def is_strip(s):
    """Return whether list s is a strip.

    >>> is_strip([3, 4, 5, 6])
    True
    >>> is_strip([3, 3, 3])        # 3 after 3
    False
    >>> is_strip([3, 4, 5, 4, 6])  # 4 after 5
    False
    >>> is_strip([3, 4, 5, 5, 6])  # 5 after 5
    False
    >>> is_strip([3, 4, 5, 6, 8])  # 8 after 6
    False
    >>> is_strip([5])
    True
    >>> is_strip([])
    True
    """
    assert type(s) == list
    return _______ or s == list ( range ( _______ , _______ ))
             (a)                            (b)       (c)`,
      parts: [
        {
          key: "a", label: "i.", points: 1, prompt: "Fill in blank (a).",
          type: "choice",
          options: ["len(s) == 0", "s[0] + 1 == s[1]", "s[0] + 1 in s", "s[0] + 1 in s[1:]"],
          answer: "len(s) == 0",
          explain: `<p>The empty list is a strip, and it has to be handled <i>first</i> — the right-hand side indexes <code>s[0]</code>, which would raise an <code>IndexError</code> on <code>[]</code>. Because <code>or</code> short-circuits, putting this test on the left protects the rest of the expression.</p>`
        },
        {
          key: "b", label: "ii.", points: 1, prompt: "Fill in blank (b).",
          type: "text", oneLine: true, check: false,
          answer: "s[0]",
          explain: `<p>If <code>s</code> is a strip, it is the consecutive run that <i>starts at its own first element</i>, so the range begins at <code>s[0]</code>.</p>`
        },
        {
          key: "c", label: "iii.", points: 2, prompt: "Fill in blank (c).",
          type: "choice",
          options: ["s", "s[0]", "s[1]", "s[0] + 1", "s[0] + len(s)", "s[len(s) - 1]", "s[1] - s[0]"],
          answer: "s[0] + len(s)",
          explain: `<p>The range must produce exactly as many numbers as <code>s</code> has, starting at <code>s[0]</code> — so it stops at <code>s[0] + len(s)</code> (exclusive).</p>
<p><code>s[len(s) - 1]</code> looks tempting but is the last <i>element</i>, which only equals the right endpoint when the list already is a strip — and it would be off by one even then, since <code>range</code>'s stop is exclusive.</p>`
        }
      ],
      runner: {
        code: `def is_strip(s):
    assert type(s) == list
    return {{a}} or s == list ( range ( {{b}} , {{c}} ))`,
        tests: [
          { expr: "is_strip([3, 4, 5, 6])", expected: "True" },
          { expr: "is_strip([3, 3, 3])", expected: "False" },
          { expr: "is_strip([3, 4, 5, 4, 6])", expected: "False" },
          { expr: "is_strip([3, 4, 5, 5, 6])", expected: "False" },
          { expr: "is_strip([3, 4, 5, 6, 8])", expected: "False" },
          { expr: "is_strip([5])", expected: "True" },
          { expr: "is_strip([])", expected: "True" },
          { expr: "is_strip([-2, -1, 0])", expected: "True" }
        ]
      }
    },
    {
      label: "(b)", points: 7,
      intro: ["<p>Implement <code>drip</code>, which takes two non-empty lists of integers <code>s</code> and <code>t</code>. It returns <code>True</code> if there is a strip containing all and only the elements of <code>s</code> and <code>t</code> <b>starting with <code>s[0]</code></b> in which the elements of <code>s</code> appear in order and the elements of <code>t</code> appear in order. It returns <code>False</code> otherwise.</p>"],
      code: `def drip(s, t):
    """Return whether there is a strip made out of interleaving s and t.

    >>> drip([1, 3, 5], [2, 4, 6])     # 1 2 3 4 5 6
    True
    >>> drip([1, 4, 5], [2, 3, 6])     # 1 2 3 4 5 6
    True
    >>> drip([1, 2, 3], [4, 5, 6])     # 1 2 3 4 5 6
    True
    >>> drip([2, 4, 5], [1, 3, 6])     # No strip starting with 2 can contain 1
    False
    >>> drip([1, 2, 4, 5], [1, 3, 6])  # No strip can contain 1 and 1
    False
    >>> drip([1, 4, 5], [2, 3, 7])     # No strip can contain 5 and 7 but no 6
    False
    >>> drip([1, 5, 4], [2, 3, 6])     # No strip can contain 5 before 4
    False
    >>> drip([2], [3, 4, 5])           # 2 3 4 5
    True
    >>> drip([1], [2, 3, 5])           # No strip can contain 3 and 5 but no 4
    False
    """
    while s and t:
        if s[0] + 1 == t[0]:
            s, t = _______      # The next element of the strip is in t
                     (a)
        elif _______:
               (b)
            s = s[1:]           # The next element of the strip is in s
        else:
            return _______
                     (c)
    return _______
             (d)`,
      parts: [
        {
          key: "a", label: "i.", points: 1, prompt: "Fill in blank (a).",
          type: "choice", options: ["t, s", "t, s[1:]", "t[1:], s"],
          answer: "t, s[1:]",
          explain: `<p>The invariant is that <code>s[0]</code> is the element of the strip most recently confirmed. When <code>t[0]</code> turns out to be the next number, <code>t</code> takes over that role (so it becomes the new <code>s</code>, <i>not</i> advanced past its front), while the old <code>s[0]</code> is now spent, so what remains of it is <code>s[1:]</code>.</p>`
        },
        {
          key: "b", label: "ii.", points: 3, prompt: "Fill in blank (b).",
          type: "text", oneLine: true, check: false,
          answer: "len(s) > 1 and s[1] == s[0] + 1",
          explain: `<p>The other way the strip can continue is from within <code>s</code> itself: its own next element is one larger. The <code>len(s) &gt; 1</code> guard is essential — without it, <code>s[1]</code> raises an <code>IndexError</code> when only one element is left.</p>`
        },
        {
          key: "c", label: "iii.", points: 1, prompt: "Fill in blank (c).",
          type: "choice",
          options: ["False", "s[0] != t[0]", "is_strip(s) or is_strip(t)", "not (is_strip(s) or is_strip(t))",
                    "is_strip(s) and is_strip(t)", "not (is_strip(s) and is_strip(t))"],
          answer: "False",
          explain: `<p>If neither continuation applies, the next number of the strip is nowhere to be found, so no interleaving can work — give up immediately.</p>`
        },
        {
          key: "d", label: "iv.", points: 2, prompt: "Fill in blank (d).",
          type: "choice",
          options: ["True", "is_strip(s)", "is_strip(t)", "is_strip(s) or is_strip(t)",
                    "not (is_strip(s) or is_strip(t))", "is_strip(s) and is_strip(t)",
                    "not (is_strip(s) and is_strip(t))"],
          answer: "is_strip(s) and is_strip(t)",
          explain: `<p>The loop stops as soon as one list is exhausted — but whatever remains in the <i>other</i> one was never checked, since the loop only ever compared across the two. Those leftovers now have to form a consecutive run on their own. One of the two is empty, and <code>is_strip([])</code> is <code>True</code>, so the <code>and</code> effectively tests just the non-empty remainder.</p>`
        }
      ],
      runner: {
        label: "Fill in (i)–(iv), then run the doctests. (A correct <code>is_strip</code> is supplied.)",
        prelude: `def is_strip(s):
    assert type(s) == list
    return len(s) == 0 or s == list(range(s[0], s[0] + len(s)))`,
        code: `def drip(s, t):
    while s and t:
        if s[0] + 1 == t[0]:
            s, t = {{a}}
        elif {{b}}:
            s = s[1:]
        else:
            return {{c}}
    return {{d}}`,
        tests: [
          { expr: "drip([1, 3, 5], [2, 4, 6])", expected: "True" },
          { expr: "drip([1, 4, 5], [2, 3, 6])", expected: "True" },
          { expr: "drip([1, 2, 3], [4, 5, 6])", expected: "True" },
          { expr: "drip([2, 4, 5], [1, 3, 6])", expected: "False" },
          { expr: "drip([1, 2, 4, 5], [1, 3, 6])", expected: "False" },
          { expr: "drip([1, 4, 5], [2, 3, 7])", expected: "False" },
          { expr: "drip([1, 5, 4], [2, 3, 6])", expected: "False" },
          { expr: "drip([2], [3, 4, 5])", expected: "True" },
          { expr: "drip([1], [2, 3, 5])", expected: "False" }
        ]
      }
    },
    {
      label: "(c)", points: 6,
      intro: ["<p>Implement <code>longest</code>, which takes a list of integers <code>s</code>. It returns the longest strip whose elements appear in <code>s</code> in order. If two such strips exist, return the one that starts earlier in <code>s</code>. <i>Hint:</i> <code>s[-1]</code> is the last element in list <code>s</code>.</p>"],
      code: `def longest(s):
    """Return the longest strip whose elements appear in s in order.

    >>> longest([4, 2, 3, 5, 6, 4, 6, 5])   # 2 3 4 5 is the longest strip in s
    [2, 3, 4, 5]
    >>> longest([4, 2, 3, 5, 6, 4])         # 4 5 6 is as long as 2 3 4 and is earlier
    [4, 5, 6]
    >>> longest([2, 4, 6])
    [2]
    """
    if len(s) == 0:
        return []
    return max([longest_with_s0(s), _______ ], key= _______ )
                                      (a)            (b)

def longest_with_s0(s):
    """Return the longest strip in s that starts with s[0]."""
    result = _______
               (c)
    for k in s[1:]:
        if _______:
             (d)
            result.append(k)
    return result`,
      parts: [
        {
          key: "a", label: "i.", points: 2, prompt: "Fill in blank (a).",
          type: "text", oneLine: true, check: false,
          answer: "longest(s[1:])",
          explain: `<p>Two candidates are compared: the best strip that starts at <code>s[0]</code>, and the best strip found anywhere later in the list — which is the same problem on <code>s[1:]</code>.</p>`
        },
        {
          key: "b", label: "ii.", points: 1, prompt: "Fill in blank (b).",
          type: "choice", options: ["len", "len(s)", "s[0]", "lambda i: s[i]"],
          answer: "len",
          explain: `<p>"Longest" means compare by number of elements. Passing the function <code>len</code> itself (not a call to it) is what <code>key</code> expects.</p>
<p>This also gets the tie-break right for free: <code>max</code> keeps the <i>first</i> maximum it sees, and the earlier-starting candidate is listed first.</p>`
        },
        {
          key: "c", label: "iii.", points: 1, prompt: "Fill in blank (c).",
          type: "choice", options: ["[]", "[s]", "s[0]", "s[:1]"],
          answer: "s[:1]",
          explain: `<p>The strip being built must start with <code>s[0]</code>, and it needs to be a <i>list</i> so that <code>append</code> works and <code>result[-1]</code> is meaningful on the first comparison. <code>s[:1]</code> gives exactly that one-element list.</p>`
        },
        {
          key: "d", label: "iv.", points: 2, prompt: "Fill in blank (d).",
          type: "text", oneLine: true, check: false,
          answer: "k == result[-1] + 1",
          explain: `<p>Scanning left to right, take an element only when it continues the run being built — i.e. it is one more than the last element kept so far. Comparing against <code>result[-1]</code> rather than the previous element of <code>s</code> is what lets the strip skip over irrelevant values.</p>`
        }
      ],
      runner: {
        code: `def longest(s):
    if len(s) == 0:
        return []
    return max([longest_with_s0(s), {{a}} ], key= {{b}} )

def longest_with_s0(s):
    result = {{c}}
    for k in s[1:]:
        if {{d}}:
            result.append(k)
    return result`,
        tests: [
          { expr: "longest([4, 2, 3, 5, 6, 4, 6, 5])", expected: "[2, 3, 4, 5]" },
          { expr: "longest([4, 2, 3, 5, 6, 4])", expected: "[4, 5, 6]" },
          { expr: "longest([2, 4, 6])", expected: "[2]" },
          { expr: "longest([])", expected: "[]" },
          { expr: "longest([7])", expected: "[7]" }
        ]
      }
    },
    {
      label: "(d)", points: 5,
      intro: ["<p>Implement <code>has_strip</code>, which takes a <code>Tree</code> of integers <code>t</code>. It returns whether there is a strip containing the labels along some path from the root to a leaf of <code>t</code>.</p>"],
      code: `def has_strip(t):
    """Return whether the elements of some root-to-leaf path form a strip.

    >>> has_strip(Tree(1, [Tree(3, [Tree(4)]), Tree(2, [Tree(2), Tree(3)])]))   # 1, 2, 3
    True
    >>> has_strip(Tree(1, [Tree(3, [Tree(4)]), Tree(2, [Tree(2, [Tree(3)])])]))
    False
    >>> has_strip(Tree(1, [Tree(3, [Tree(4)]), Tree(2, [Tree(2)])]))
    False
    >>> has_strip(Tree(1, [Tree(2, [Tree(4)]), Tree(3, [Tree(3)])]))
    False
    """
    if t.is_leaf():
        return _______
                 (a)
    for b in t.branches:
        if _______
             (b)
            return True
    return _______
             (c)`,
      parts: [
        {
          key: "a", label: "i.", points: 1, prompt: "Fill in blank (a).",
          type: "choice", options: ["True", "False", "t", "t.label", "t.label == t + 1", "t + 1 == t.label"],
          answer: "True",
          explain: `<p>A path that has reached a leaf is complete, and a single remaining node always continues whatever run brought us here (the caller already checked the step into this node). A one-element path is a strip by definition.</p>`
        },
        {
          key: "b", label: "ii.", points: 3, prompt: "Fill in blank (b). <i>(The colon is part of the blank.)</i>",
          type: "text", oneLine: true, check: false,
          answer: "b.label == t.label + 1 and has_strip(b):",
          accept: ["b.label == t.label + 1 and has_strip(b)"],
          explain: `<p>Two things must hold for a branch to lead to a strip: the step from <code>t</code> into <code>b</code> itself increases by exactly one, <i>and</i> the rest of the path below <code>b</code> keeps doing so. Checking only the label would accept <code>1 → 2</code> followed by a broken tail; checking only <code>has_strip(b)</code> would ignore the step we are standing on.</p>`
        },
        {
          key: "c", label: "iii.", points: 1, prompt: "Fill in blank (c).",
          type: "choice", options: ["True", "False", "t", "t.label", "t.label == t + 1", "t + 1 == t.label"],
          answer: "False",
          explain: `<p>Falling out of the loop means no branch worked, so this node leads nowhere. Note a non-leaf node cannot itself be the end of a path — every path must run all the way to a leaf.</p>`
        }
      ],
      runner: {
        code: `def has_strip(t):
    if t.is_leaf():
        return {{a}}
    for b in t.branches:
        if {{b}}
            return True
    return {{c}}`,
        tests: [
          { expr: "has_strip(Tree(1, [Tree(3, [Tree(4)]), Tree(2, [Tree(2), Tree(3)])]))", expected: "True" },
          { expr: "has_strip(Tree(1, [Tree(3, [Tree(4)]), Tree(2, [Tree(2, [Tree(3)])])]))", expected: "False" },
          { expr: "has_strip(Tree(1, [Tree(3, [Tree(4)]), Tree(2, [Tree(2)])]))", expected: "False" },
          { expr: "has_strip(Tree(1, [Tree(2, [Tree(4)]), Tree(3, [Tree(3)])]))", expected: "False" },
          { expr: "has_strip(Tree(5))", expected: "True" }
        ]
      }
    },
    {
      label: "(e)", points: 7,
      intro: ["<p>Implement <code>strips</code>, a generator function that takes a <code>Tree</code> of integers <code>t</code>. It yields all strips that contain the labels along a path from the root to a leaf of <code>t</code>.</p>"],
      code: `def strips(t):
    """Yield the paths from the root to a leaf of Tree t that form strips.

    >>> list(strips(Tree(1, [Tree(3, [Tree(4)]), Tree(2, [Tree(2), Tree(3)])])))
    [[1, 2, 3]]
    >>> list(strips(Tree(1, [Tree(2), Tree(2, [Tree(2), Tree(3, [Tree(4)]), Tree(3)])])))
    [[1, 2], [1, 2, 3, 4], [1, 2, 3]]
    """
    if t.is_leaf():
        yield _______
                (a)
    for b in t.branches:
        if _______:
             (b)
            for s in _______:
                       (c)
                yield _______
                        (d)`,
      parts: [
        {
          key: "a", label: "i.", points: 2, prompt: "Fill in blank (a).",
          type: "choice", options: ["None", "t", "t.label", "[t]", "[t.label]"],
          answer: "[t.label]",
          explain: `<p>The generator yields <i>paths</i>, which are lists of labels. At a leaf the path consists of just this node's label — and it must be a list so the callers above can prepend to it.</p>`
        },
        {
          key: "b", label: "ii.", points: 1, prompt: "Fill in blank (b).",
          type: "choice",
          options: ["t.label == b.label + 1", "b.label == t.label + 1",
                    "t.label == b.label + 1 and is_strip(b)", "b.label == t.label + 1 and is_strip(b)"],
          answer: "b.label == t.label + 1",
          explain: `<p>Only descend into branches that continue the run: the child's label must be one more than this node's. No extra <code>is_strip</code> check is needed (or even possible — <code>is_strip</code> takes a list, not a tree); the recursion below only yields paths that are already strips.</p>`
        },
        {
          key: "c", label: "iii.", points: 2, prompt: "Fill in blank (c).",
          type: "choice",
          options: ["strips(t)", "strips(b)", "t.branches", "b.branches",
                    "range(len(t.branches))", "range(len(b.branches))"],
          answer: "strips(b)",
          explain: `<p>Recurse into the branch to get every strip-path starting at <code>b</code>. <code>strips(t)</code> would loop forever.</p>`
        },
        {
          key: "d", label: "iv.", points: 2, prompt: "Fill in blank (d).",
          type: "choice",
          options: ["s", "t", "t + s", "t.label + s", "[t] + s", "[t.label] + s", "[t] + [s]", "[t.label] + [s]"],
          answer: "[t.label] + s",
          explain: `<p>Each path found below starts at <code>b</code>; prefixing this node's label extends it to start at <code>t</code>. It has to be <code>[t.label]</code> — a one-element list — so that <code>+</code> concatenates rather than failing on a number plus a list.</p>`
        },
      ],
      runner: {
        label: "Fill in (i)–(iv), then run the doctests.",
        code: `def strips(t):
    if t.is_leaf():
        yield {{a}}
    for b in t.branches:
        if {{b}}:
            for s in {{c}}:
                yield {{d}}`,
        tests: [
          { expr: "list(strips(Tree(1, [Tree(3, [Tree(4)]), Tree(2, [Tree(2), Tree(3)])])))", expected: "[[1, 2, 3]]" },
          { expr: "list(strips(Tree(1, [Tree(2), Tree(2, [Tree(2), Tree(3, [Tree(4)]), Tree(3)])])))", expected: "[[1, 2], [1, 2, 3, 4], [1, 2, 3]]" },
          { expr: "list(strips(Tree(5)))", expected: "[[5]]" }
        ]
      }
    },
    {
      parts: [
        {
          key: "aplus", label: "v.", points: 0, aplus: true,
          prompt: "Fill in the blank of <code>only_strips</code>, which takes a <code>Tree</code> of integers <code>t</code>. It removes all nodes that are not on a strip path. A strip path is a path from the root to a leaf whose labels form a strip. You may use functions implemented earlier in this question.",
          code: `def test_only_strips(t):
    """Call only_strips(t) and then return t. Assume has_strip(t) is True.

    >>> test_only_strips(Tree(1, [Tree(2), Tree(2, [Tree(2), Tree(3, [Tree(4)]), Tree(3)])]))
    Tree(1, [Tree(2), Tree(2, [Tree(3, [Tree(4)]), Tree(3)])])
    >>> test_only_strips(Tree(5, [Tree(6), Tree(6, [Tree(7, [Tree(9)])]), Tree(7)]))
    Tree(5, [Tree(6)])
    """
    only_strips(t)
    return t

def only_strips(t):
    """Remove all nodes of Tree t that are not on a path from the root to a leaf
    whose labels form a strip. Assume has_strip(t) is True.
    """
    t.branches = [b for b in t.branches if _______]`,
          type: "text", rows: 3, check: false,
          answer: "b.label == t.label + 1 and has_strip(b) and only_strips(b) is None",
          explain: `<p>A branch survives only if it both continues the run (<code>b.label == t.label + 1</code>) and still has a strip path below it (<code>has_strip(b)</code>).</p>
<p>The trick is that the surviving branches must also be <i>pruned themselves</i>. <code>only_strips</code> returns <code>None</code>, so <code>only_strips(b) is None</code> is always <code>True</code> — it performs the recursive pruning as a side effect while leaving the filter condition unchanged. Because <code>and</code> short-circuits, this recursion runs only for branches that already passed the first two tests, which is exactly what is wanted.</p>`
        }
      ],
      runner: {
        label: "Fill in the A+ blank, then run its doctests. (A correct <code>has_strip</code> is supplied.)",
        prelude: `def has_strip(t):
    if t.is_leaf():
        return True
    for b in t.branches:
        if b.label == t.label + 1 and has_strip(b):
            return True
    return False`,
        code: `def only_strips(t):
    t.branches = [b for b in t.branches if {{aplus}}]

def test_only_strips(t):
    only_strips(t)
    return t`,
        tests: [
          { expr: "test_only_strips(Tree(1, [Tree(2), Tree(2, [Tree(2), Tree(3, [Tree(4)]), Tree(3)])]))",
            expected: "Tree(1, [Tree(2), Tree(2, [Tree(3, [Tree(4)]), Tree(3)])])" },
          { expr: "test_only_strips(Tree(5, [Tree(6), Tree(6, [Tree(7, [Tree(9)])]), Tree(7)]))",
            expected: "Tree(5, [Tree(6)])" }
        ]
      }
    }
  ]
}

]});
