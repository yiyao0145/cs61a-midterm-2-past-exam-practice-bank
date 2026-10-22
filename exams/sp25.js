// CS 61A Spring 2025 Midterm 2
EXAM_BANK.exams.push({
id: "sp25",
term: "Spring 2025",
points: 50,
questions: [

// ------------------------------------------------------------------ Q1
{
  num: 1, title: "What Would Python Display?", points: 6,
  intro: ["<p>Assume the following code has been executed. The <code>pop</code> method of a list removes and returns its last element.</p>"],
  code: `s = [2, [5, 8], 11]
t = [1, 3, 5, 7, 9]

def add_t(x):
    if isinstance(x, list):
        return [add_t(y) for y in x]
    else:
        return x + t.pop()

m = map(add_t, s)`,
  after: ["<p>Write the value of each expression below or <i>Error</i> if an error occurs. Assume that each expression is evaluated in order and sequentially, so evaluating the first could affect the value of the second. Write <i>Map</i> for a map object and <i>Function</i> for a function.</p>"],
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 2, prompt: "[x[1] for x in s if isinstance(x, list)]", promptCode: true,
        type: "text", oneLine: true, answer: "[8]",
        explain: `<p>Only one element of <code>s</code> is a list — <code>[5, 8]</code> — and its element at index 1 is <code>8</code>. Nothing here touches <code>t</code> or the map.</p>`
      },
      {
        key: "b", label: "(b)", points: 1, prompt: "next(m)", promptCode: true,
        type: "choice", options: ["3", "5", "7", "9", "11"], answer: "11",
        explain: `<p><code>map</code> is lazy: nothing has been computed yet. The first <code>next</code> applies <code>add_t</code> to <code>s[0]</code>, which is <code>2</code>. That is not a list, so it evaluates <code>2 + t.pop()</code>, and <code>t.pop()</code> removes and returns the last element of <code>t</code>, <code>9</code>. So the value is <code>11</code> and <code>t</code> is now <code>[1, 3, 5, 7]</code>.</p>`
      },
      {
        key: "c", label: "(c)", points: 1, prompt: "t.pop()", promptCode: true,
        type: "choice", options: ["1", "3", "5", "7", "9"], answer: "7",
        explain: `<p>Part (b) already popped the <code>9</code>, so <code>t</code> is <code>[1, 3, 5, 7]</code> and the next pop returns <code>7</code>, leaving <code>[1, 3, 5]</code>.</p>`
      },
      {
        key: "d", label: "(d)", points: 2, prompt: "[next(m) for z in range(2)]", promptCode: true,
        type: "text", oneLine: true, answer: "[[10, 11], 12]",
        explain: `<p>The first <code>next</code> applies <code>add_t</code> to <code>[5, 8]</code>. Since that is a list, it recurses element by element, left to right: <code>5 + t.pop()</code> pops <code>5</code> giving <code>10</code>, then <code>8 + t.pop()</code> pops <code>3</code> giving <code>11</code> — so <code>[10, 11]</code>, and <code>t</code> is down to <code>[1]</code>.</p>
<p>The second <code>next</code> applies <code>add_t</code> to <code>11</code>, which is <code>11 + t.pop()</code> = <code>11 + 1</code> = <code>12</code>.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q2
{
  num: 2, title: "This or That", points: 7,
  intro: ["<p>Answer the questions about the code below. (The original exam also supplied a blank environment diagram; the diagram itself was not scored.)</p>"],
  code: ` 1: def f(this):
 2:     that = this[1]
 3:     def g(copy):
 4:         that[0] = 4
 5:         copy[0] = 5
 6:         copy[1].append(6)
 7:         print(copy)
 8:     g(list(this))
 9:     this.append(that)
10:     that.append(7)
11:
12: t = [1, [2], 3]
13: f(t)
14: print(t)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 3, prompt: "What is displayed by the call to <code>print</code> on line 7?",
        type: "text", oneLine: true, answer: "[5, [4, 6], 3]",
        explain: `<p><code>list(this)</code> makes a <i>shallow</i> copy, so <code>copy</code> is a new outer list but <code>copy[1]</code> is the very same inner list as <code>that</code>.</p>
<ul>
<li><code>that[0] = 4</code> changes the shared inner list from <code>[2]</code> to <code>[4]</code>.</li>
<li><code>copy[0] = 5</code> changes only the copy's first element.</li>
<li><code>copy[1].append(6)</code> appends to that same shared inner list, making it <code>[4, 6]</code>.</li>
</ul>
<p>So <code>copy</code> prints as <code>[5, [4, 6], 3]</code>.</p>`
      },
      {
        key: "b", label: "(b)", points: 3, prompt: "What is displayed by the call to <code>print</code> on line 14?",
        type: "text", oneLine: true, answer: "[1, [4, 6, 7], 3, [4, 6, 7]]",
        explain: `<p><code>t</code> itself was never reassigned, and <code>copy[0] = 5</code> only touched the copy — so <code>t[0]</code> is still <code>1</code>. The inner list is shared, so it carries the <code>4</code> and the <code>6</code> from part (a), and line 10 appends a <code>7</code> to it.</p>
<p>Line 9 appends <code>that</code> — the inner list object — onto the end of <code>t</code>. That is the same object as <code>t[1]</code>, so it appears twice, and the <code>7</code> appended afterwards shows up in both places.</p>`
      },
      {
        key: "c", label: "(c)", points: 1,
        prompt: "What is the order of growth of the time it takes to execute <code>result = nest(n)</code> in terms of positive integer <code>n</code>? Assume that <code>append</code> always takes one step (constant time).",
        code: `def nest(n):
    """Create a nested list.

    >>> nest(3)
    [[[[], []], [[], []]], [[[], []], [[], []]]]
    """
    s = []
    first = s
    for x in range(n):
        next_s = []
        s.append(next_s)
        s.append(next_s)
        s = next_s
    return first`,
        type: "choice", plainOptions: true,
        options: ["exponential", "quadratic", "linear", "logarithmic", "constant"],
        answer: "linear",
        explain: `<p>The loop runs exactly <code>n</code> times and each iteration does a fixed amount of work: make one list and append it twice. The <i>printed</i> result looks exponentially large, but that is because the same list object is appended twice each time — only <code>n</code> new lists are ever created.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q3
{
  num: 3, title: "Berkeley Time", points: 10,
  sections: [
    {
      label: "(a)", points: 5,
      intro: [
        "<p>An <code>Event</code> instance has <code>start</code> and <code>end</code> attributes that are positive integers representing the number of minutes after midnight that the <code>Event</code> begins and concludes.</p>",
        "<p>Implement the <code>Event</code> class. The <code>split</code> method takes an integer <code>k</code> that evenly divides the difference between the <code>end</code> and <code>start</code> times. It is a generator function that yields <code>k</code> sequential events of equal length that together span the same time interval as the original event. Calling <code>split</code> does not change the event.</p>"
      ],
      code: `class Event:
    """An Event has a start and end time and can be split into equal-length shorter events.

    >>> calapalooza = Event(980, 1180)
    >>> list(calapalooza.split(4))   # Split it into 4 smaller events from 980 to 1180.
    [Event(980, 1030), Event(1030, 1080), Event(1080, 1130), Event(1130, 1180)]
    """
    def __init__(self, start, end):
        self.start, self.end = start, end

    def __repr__(self):
        return f'Event({self.start}, {self.end})'

    def split(self, k):
        assert (self.end - self.start) % k == 0   # k evenly divides the duration
        length = (self.end - self.start) // k
        start = _______
                  (a)
        for i in range(k):
            yield _______
                    (b)
            _______
              (c)`,
      parts: [
        {
          key: "a", label: "i.", points: 1, prompt: "Fill in blank (a).",
          type: "choice", options: ["0", "None", "self", "start", "self.start"],
          answer: "self.start",
          explain: `<p>The first of the smaller events has to begin where the original event begins, so the running <code>start</code> marker is initialised from the instance attribute.</p>`
        },
        {
          key: "b", label: "ii.", points: 3, prompt: "Fill in blank (b).",
          type: "text", oneLine: true, check: false,
          answer: "Event(start, start + length)",
          explain: `<p>Each piece is a brand-new <code>Event</code> running from the current marker for <code>length</code> minutes. Building a new object (rather than mutating <code>self</code>) is what keeps the original event unchanged, as the problem requires.</p>`
        },
        {
          key: "c", label: "iii.", points: 1, prompt: "Fill in blank (c).",
          type: "choice",
          options: ["start = start + length", "start = self.start + length",
                    "self.start = start + length", "self.start = self.start + length"],
          answer: "start = start + length",
          explain: `<p>Advance only the local marker. Either option that assigns to <code>self.start</code> would mutate the original event, which <code>split</code> is explicitly not allowed to do; <code>start = self.start + length</code> would make every piece start in the same place.</p>`
        }
      ],
      runner: {
        code: `class Event:
    def __init__(self, start, end):
        self.start, self.end = start, end
    def __repr__(self):
        return 'Event(' + str(self.start) + ', ' + str(self.end) + ')'
    def split(self, k):
        assert (self.end - self.start) % k == 0
        length = (self.end - self.start) // k
        start = {{a}}
        for i in range(k):
            yield {{b}}
            {{c}}

calapalooza = Event(980, 1180)
pieces = list(calapalooza.split(4))`,
        tests: [
          { expr: "repr(pieces)", expected: "'[Event(980, 1030), Event(1030, 1080), Event(1080, 1130), Event(1130, 1180)]'" },
          { expr: "[calapalooza.start, calapalooza.end]", expected: "[980, 1180]" },
          { expr: "repr(list(Event(0, 60).split(3)))", expected: "'[Event(0, 20), Event(20, 40), Event(40, 60)]'" }
        ]
      }
    },
    {
      label: "(b)", points: 5,
      intro: ["<p>A <code>BerkeleyEvent</code> is an <code>Event</code> with a modified <code>split</code> method. The first <code>Event</code> yielded by <code>split</code> starts at the same time as the original event, but all events after the first one are 10 minutes shorter and start 10 minutes after the previous event ends. Again, assume <code>k</code> evenly divides the difference between the <code>end</code> and <code>start</code> attributes.</p>"],
      code: `class BerkeleyEvent(Event):
    """When a BerkeleyEvent is split, there is time between events.

    >>> list(BerkeleyEvent(840, 930).split(3))
    [Event(840, 870), Event(880, 900), Event(910, 930)]
    """
    time = 10     # How much time between events

    def split(self, k):
        first = True
        for e in _______:
                   (d)
            if first:
                first = False
            else:
                _______.start = _______ + _______
                  (e)             (f)       (g)
            yield e`,
      parts: [
        {
          key: "d", label: "i.", points: 2, prompt: "Fill in blank (d).",
          type: "text", oneLine: true, check: false,
          answer: "super().split(k)",
          accept: ["Event.split(self, k)", "super(BerkeleyEvent, self).split(k)"],
          explain: `<p>Reuse the parent's even split and then adjust the pieces. <code>super().split(k)</code> gives the evenly-divided events <code>Event(840, 870)</code>, <code>Event(870, 900)</code>, <code>Event(900, 930)</code>; the loop then pushes each one after the first forward by 10 minutes.</p>
<p><code>Event.split(self, k)</code> is an equally correct way to write it.</p>`
        },
        {
          key: "e", label: "ii.", points: 1, prompt: "Fill in blank (e).",
          type: "choice", options: ["e", "self", "self.e"],
          answer: "e",
          explain: `<p>It is the yielded piece whose start time moves, not the original event. Writing <code>self.start</code> here would corrupt the event being split.</p>`
        },
        {
          key: "f", label: "iii.", points: 1, prompt: "Fill in blank (f).",
          type: "choice", options: ["self", "self.start", "self.end", "e", "e.start", "e.end"],
          answer: "e.start",
          explain: `<p>Each later piece starts 10 minutes after it otherwise would, so the new start is this piece's own start plus the gap. Its end is left alone, which is exactly why the later events come out 10 minutes shorter.</p>`
        },
        {
          key: "g", label: "iv.", points: 1, prompt: "Fill in blank (g). <b>Select all that apply.</b>",
          type: "select",
          options: ["time", "self.time", "self.BerkeleyEvent.time", "BerkeleyEvent.time", "Event.time"],
          answer: ["self.time", "BerkeleyEvent.time"],
          explain: `<p>The gap is the class attribute <code>time = 10</code> defined on <code>BerkeleyEvent</code>.</p>
<ul>
<li><code>self.time</code> works — attribute lookup on the instance falls back to its class.</li>
<li><code>BerkeleyEvent.time</code> works — direct lookup on the class that defines it.</li>
<li>bare <code>time</code> raises a <code>NameError</code>: class attributes are not in scope as plain names inside methods.</li>
<li><code>self.BerkeleyEvent.time</code> is nonsense — instances have no <code>BerkeleyEvent</code> attribute.</li>
<li><code>Event.time</code> fails: <code>time</code> is defined on the subclass, and attribute lookup does not search <i>downwards</i> from a parent.</li>
</ul>`
        }
      ],
      runner: {
        label: "Fill in (d)–(g), then run the doctest. (A correct <code>Event</code> is supplied.) Note: the in-browser Python does not support zero-argument <code>super()</code> — write <code>Event.split(self, k)</code> in blank (d) if you want this to run.",
        prelude: `class Event:
    def __init__(self, start, end):
        self.start, self.end = start, end
    def __repr__(self):
        return 'Event(' + str(self.start) + ', ' + str(self.end) + ')'
    def split(self, k):
        assert (self.end - self.start) % k == 0
        length = (self.end - self.start) // k
        start = self.start
        for i in range(k):
            yield Event(start, start + length)
            start = start + length`,
        code: `class BerkeleyEvent(Event):
    time = 10
    def split(self, k):
        first = True
        for e in {{d}}:
            if first:
                first = False
            else:
                {{e}}.start = {{f}} + {{g}}
            yield e

out = list(BerkeleyEvent(840, 930).split(3))`,
        tests: [
          { expr: "repr(out)", expected: "'[Event(840, 870), Event(880, 900), Event(910, 930)]'" },
          { expr: "repr(list(BerkeleyEvent(0, 120).split(4)))", expected: "'[Event(0, 30), Event(40, 60), Event(70, 90), Event(100, 120)]'" }
        ]
      }
    }
  ]
},

// ------------------------------------------------------------------ Q4
{
  num: 4, title: "DeepSeek", points: 11,
  intro: ["<p><b>Definition.</b> The <i>depth</i> of the root node of a tree is 0. The depth of each other node is one plus the depth of its parent.</p>"],
  sections: [
    {
      label: "(a)", points: 5,
      intro: ["<p>Implement <code>deepest</code>, which takes a <code>Tree</code> instance <code>t</code> and a value <code>x</code>. It returns the largest depth of a node labeled <code>x</code> in <code>t</code>. If there are no nodes labeled <code>x</code> in <code>t</code>, then <code>deepest(t, x)</code> returns <code>None</code>.</p>"],
      code: `def deepest(t, x):
    """Return the maximum depth of a node labeled x in Tree t.
    Return None if x is not a label in t.

    >>> example = Tree(30, [Tree(20), Tree(20, [Tree(30, [Tree(20)])])])
    >>> deepest(example, 30)
    2
    >>> deepest(example, 20)
    3
    >>> print(deepest(example, 10))
    None
    """
    below = [deepest(b, x) for b in t.branches]
    depths = [ _______ ]
                 (a)
    if _______:
         (b)
        depths._______
                 (c)
    if depths:
        return max(depths)
    else:
        return None`,
      parts: [
        {
          key: "a", label: "i.", points: 3, prompt: "Fill in blank (a). Include <code>for</code> and <code>in</code> and <code>if</code> in your answer.",
          type: "text", oneLine: true, check: false,
          answer: "d + 1 for d in below if d is not None",
          accept: ["d + 1 for d in below if d != None"],
          explain: `<p><code>below</code> holds one answer per branch, each either a depth measured <i>within that branch</i> or <code>None</code> when the label does not appear there. Depths measured inside a branch are one level deeper when seen from <code>t</code>, hence <code>d + 1</code>. The <code>if</code> clause throws away the branches that found nothing, which is essential — <code>None + 1</code> would be a <code>TypeError</code>.</p>`
        },
        {
          key: "b", label: "ii.", points: 1, prompt: "Fill in blank (b).",
          type: "choice",
          options: ["x in depths", "depths", "not depths", "t == x", "t.label == x", "t.is_leaf()"],
          answer: "t.label == x",
          explain: `<p>The root of this subtree counts too: if its own label matches, there is a match at depth 0 relative to <code>t</code>.</p>`
        },
        {
          key: "c", label: "iii.", points: 1, prompt: "Fill in blank (c).",
          type: "text", oneLine: true, check: false,
          answer: "append(0)",
          explain: `<p>Record that match as depth <code>0</code>. The following <code>max(depths)</code> then picks the deepest of everything found, and the empty-list case falls through to <code>None</code>.</p>`
        }
      ],
      runner: {
        code: `def deepest(t, x):
    below = [deepest(b, x) for b in t.branches]
    depths = [ {{a}} ]
    if {{b}}:
        depths.{{c}}
    if depths:
        return max(depths)
    else:
        return None

example = Tree(30, [Tree(20), Tree(20, [Tree(30, [Tree(20)])])])`,
        tests: [
          { expr: "deepest(example, 30)", expected: "2" },
          { expr: "deepest(example, 20)", expected: "3" },
          { expr: "deepest(example, 10)", expected: "None" },
          { expr: "deepest(Tree(5), 5)", expected: "0" },
          { expr: "deepest(Tree(1, [Tree(2), Tree(3)]), 3)", expected: "1" }
        ]
      }
    },
    {
      label: "(b)", points: 6,
      intro: [
        "<p>Implement <code>deep</code>, which takes a <code>Tree</code> instance <code>t</code>. It returns a dictionary containing each unique node label of <code>t</code> as a key. The value for each key <code>k</code> is the largest depth of any node in <code>t</code> labeled <code>k</code>.</p>",
        "<p><b>IMPORTANT:</b> You may not call <code>deepest</code> in your implementation.</p>",
        "<p><i>Hint:</i> For a dictionary <code>d</code>, <code>d.get(1, 2)</code> returns the value for the key 1 if that key appears in <code>d</code> and 2 otherwise.</p>"
      ],
      code: `def deep(t):
    """Return a dictionary containing each unique label of t as a key
    and the maximum depth of a node labeled with that key as its value.

    >>> deep(Tree(30, [Tree(20), Tree(20, [Tree(30, [Tree(20)])])]))
    {30: 2, 20: 3}
    """
    result = {}
    def visit(node, depth):
        _______ = max(_______, result.get(_______, 0))
          (d)           (e)                  (f)
        for b in node.branches:
            _______
              (g)
    visit(t, 0)
    return result`,
      parts: [
        {
          key: "d", label: "i.", points: 2, prompt: "Fill in blank (d).",
          type: "text", oneLine: true, check: false,
          answer: "result[node.label]",
          explain: `<p>Each visit records a depth for the label of the node being visited, so the assignment target is that label's entry in the dictionary.</p>`
        },
        {
          key: "e", label: "ii.", points: 1, prompt: "Fill in blank (e).",
          type: "choice", options: ["0", "1", "depth", "t.label", "node.label"],
          answer: "depth",
          explain: `<p>One of the two candidates for the maximum is the depth of the node we are at right now.</p>`
        },
        {
          key: "f", label: "iii.", points: 1, prompt: "Fill in blank (f).",
          type: "choice", options: ["depth", "t", "t.label", "node", "node.label"],
          answer: "node.label",
          explain: `<p>The other candidate is whatever depth was already recorded for this same label, defaulting to <code>0</code> via <code>.get(..., 0)</code> when the label has not been seen before. Note <code>t</code> stays fixed at the original root while <code>node</code> moves, so <code>node.label</code> is the one that varies correctly.</p>`
        },
        {
          key: "g", label: "iv.", points: 2, prompt: "Fill in blank (g).",
          type: "text", oneLine: true, check: false,
          answer: "visit(b, depth + 1)",
          explain: `<p>Walk into each branch, one level deeper. There is no return value to collect — the work happens by mutating the shared <code>result</code> dictionary, which is why this single traversal replaces calling <code>deepest</code> once per label.</p>`
        }
      ],
      runner: {
        code: `def deep(t):
    result = {}
    def visit(node, depth):
        {{d}} = max({{e}}, result.get({{f}}, 0))
        for b in node.branches:
            {{g}}
    visit(t, 0)
    return result`,
        tests: [
          { expr: "deep(Tree(30, [Tree(20), Tree(20, [Tree(30, [Tree(20)])])]))", expected: "{30: 2, 20: 3}" },
          { expr: "deep(Tree(5))", expected: "{5: 0}" },
          { expr: "deep(Tree(1, [Tree(1, [Tree(1)])]))", expected: "{1: 2}" }
        ]
      }
    }
  ]
},

// ------------------------------------------------------------------ Q5
{
  num: 5, title: "Just Add and Multiply", points: 16,
  intro: ["<p><b>Definition.</b> A <i>plus-times-expression</i> for a list (or linked list) of numbers inserts either <code>+</code> or <code>*</code> between each adjacent pair of numbers. For example, <code>2*3+4+5</code> is one possible plus-times-expression for <code>[2, 3, 4, 5]</code>.</p>"],
  sections: [
    {
      label: "(a)", points: 5,
      intro: ["<p>Implement <code>muladd</code>, which takes a linked list of numbers <code>s</code>. It returns the value of the plus-times-expression that starts with <code>*</code> and then alternates between <code>+</code> and <code>*</code>. If <code>s</code> has only one element, <code>muladd</code> returns that element.</p>"],
      code: `def muladd(s):
    """Combine the numbers in linked list s by alternately multiplying and adding.

    >>> example = Link(9, Link(4, Link(7, Link(2, Link(0)))))     # <9 4 7 2 0>
    >>> muladd(example)        # 9 * 4 + 7 * 2 + 0, not 9 * (4 + 7 * (2 + 0))
    50
    >>> muladd(Link(2, example))   # 2 * 9 + 4 * 7 + 2 * 0
    46
    >>> muladd(Link(2))
    2
    """
    if s is Link.empty:
        return 0
    elif s.rest is Link.empty:
        return _______
                 (a)
    else:
        return _______
                 (b)`,
      parts: [
        {
          key: "a", label: "i.", points: 1, prompt: "Fill in blank (a).",
          type: "choice", options: ["0", "1", "s.first", "s.rest", "s.rest.first"],
          answer: "s.first",
          explain: `<p>"If <code>s</code> has only one element, <code>muladd</code> returns that element" — and a one-element linked list is exactly one whose <code>rest</code> is empty.</p>`
        },
        {
          key: "b", label: "ii.", points: 4, prompt: "Fill in blank (b). If your answer is too long, you can continue on another line.",
          type: "text", rows: 2, check: false,
          answer: "s.first * s.rest.first + muladd(s.rest.rest)",
          explain: `<p>The pattern always begins with a multiplication, so the first two elements multiply together. What follows that pair is itself a fresh <code>*</code>, <code>+</code>, <code>*</code>, … expression, so recurse on <code>s.rest.rest</code> and add the result.</p>
<p>The <code>s is Link.empty</code> base case returning <code>0</code> is what makes this work when the list has an even number of elements and the recursion steps past the end.</p>`
        }
      ],
      runner: {
        code: `def muladd(s):
    if s is Link.empty:
        return 0
    elif s.rest is Link.empty:
        return {{a}}
    else:
        return {{b}}

example = Link(9, Link(4, Link(7, Link(2, Link(0)))))`,
        tests: [
          { expr: "muladd(example)", expected: "50" },
          { expr: "muladd(Link(2, example))", expected: "46" },
          { expr: "muladd(Link(2))", expected: "2" },
          { expr: "muladd(Link(3, Link(4)))", expected: "12" },
          { expr: "muladd(Link(2, Link(3, Link(4, Link(5)))))", expected: "26" }
        ]
      }
    },
    {
      label: "(b)", points: 5,
      intro: ["<p>Implement <code>ways</code>, which takes positive integers <code>k</code> and <code>n</code>. It returns the number of possible plus-times-expressions for a list of length <code>n</code> that have at most <code>k</code> <code>*</code>-symbols in a row. For example, <code>2+3*4*5*6+7*8*9+10+11*12*13*14+15*16</code> has 3 in a row <code>3*4*5*6</code>, then 2 in a row <code>7*8*9</code>, then 3 in a row <code>11*12*13*14</code>, then 1 in a row <code>15*16</code>.</p>"],
      code: `def ways(k, n):
    """Return the number of plus-times-expressions with at most k consecutive *'s for n numbers.

    >>> ways(1, 4)  # For [2, 3, 4, 5]: 2+3+4+5, 2+3+4*5, 2+3*4+5, 2*3+4+5, 2*3+4*5
    5
    >>> ways(2, 4)  # The 7 ways would also include 2+3*4*5 and 2*3*4+5
    7
    >>> ways(2, 5)  # Some examples: 2+3*4+5*6 & 2*3*4+5*6 (but not 2+3*4*5*6)
    13
    """
    def f(left, n):
        if _______:
             (c)
            return 1
        result = f( _______ , n - 1)
                      (d)
        if left:
            result += _______
                        (e)
        return result
    return f(k, n)`,
      parts: [
        {
          key: "c", label: "i.", points: 1, prompt: "Fill in blank (c).",
          type: "choice", options: ["left == 0", "left == 1", "n == 0", "n == 1"],
          answer: "n == 1",
          explain: `<p><code>n</code> counts how many numbers are left to place. With exactly one number left there is no operator still to choose, so there is exactly one way to finish — regardless of the remaining budget.</p>`
        },
        {
          key: "d", label: "ii.", points: 1, prompt: "Fill in blank (d).",
          type: "choice", options: ["left", "left - 1", "k", "k - 1"],
          answer: "k",
          explain: `<p>This unconditional call is the "place a <code>+</code>" branch. A plus is always legal and it breaks any run of stars, so the budget resets all the way back to <code>k</code>.</p>`
        },
        {
          key: "e", label: "iii.", points: 3, prompt: "Fill in blank (e).",
          type: "text", oneLine: true, check: false,
          answer: "f(left - 1, n - 1)",
          explain: `<p>This is the "place a <code>*</code>" branch, guarded by <code>if left:</code> so it only happens while budget remains. Placing a star consumes one unit of the run budget (<code>left - 1</code>) and uses up one number (<code>n - 1</code>). Its count is <i>added</i> to the plus branch since both are valid continuations.</p>`
        }
      ],
      runner: {
        code: `def ways(k, n):
    def f(left, n):
        if {{c}}:
            return 1
        result = f( {{d}} , n - 1)
        if left:
            result += {{e}}
        return result
    return f(k, n)`,
        tests: [
          { expr: "ways(1, 4)", expected: "5" },
          { expr: "ways(2, 4)", expected: "7" },
          { expr: "ways(2, 5)", expected: "13" },
          { expr: "ways(3, 1)", expected: "1" },
          { expr: "ways(3, 4)", expected: "8" },
          { expr: "ways(1, 5)", expected: "8" }
        ]
      }
    },
    {
      label: "(c)", points: 6,
      intro: [
        "<p>Implement <code>close</code>, which takes a list of numbers <code>s</code> and a number <code>x</code>. It returns the number closest (in absolute value) to <code>x</code> that is the value of some plus-times-expression for <code>s</code>.</p>",
        "<p><i>Hint:</i> A slice that starts past the end of a list is empty. For example, <code>[2, 3, 4][3:]</code> evaluates to <code>[]</code>.</p>",
        "<p>The <code>product</code> function used to implement <code>close</code> is defined below.</p>"
      ],
      code: `def close(s, x):
    """Return the value of a plus-times-expression for s that is closest to x.

    >>> print(close([1, 2, 3, 4], 10))   # 1 + 2 + 3 + 4 = 10
    10
    >>> print(close([1, 2, 3, 4], 20))   # 1 * 2 * 3 * 4 = 24 (4 away from 20)
    24
    >>> print(close([1, 2, 3, 4], 30))   # 1 + 2 * 3 * 4 = 25 (5 away from 30)
    25
    >>> print(close([3, 7, 5, 4, 2, 6], 66))  # 3 * 7 + 5 * 4 * 2 + 6 = 67
    67
    """
    if not s:
        return 0
    choices = [product(s[:i]) + _______ for i in range(1, len(s) + 1)]
                                  (f)
    return min(choices, key=_______)
                              (g)

def product(s):
    """Return the result of multiplying together the elements of a non-empty list of numbers s."""
    if len(s) == 1:
        return s[0]
    return s[0] * product(s[1:])`,
      parts: [
        {
          key: "f", label: "i.", points: 4, prompt: "Fill in blank (f).",
          type: "text", rows: 2, check: false,
          answer: "close(s[i:], x - product(s[:i]))",
          explain: `<p>Every plus-times-expression is a run of multiplications, then a <code>+</code>, then another such expression. The loop picks how long that first multiplied group is: <code>s[:i]</code>, worth <code>product(s[:i])</code>.</p>
<p>What follows must be the best expression on the remaining elements <code>s[i:]</code> — and since the first group already contributes a fixed amount, the sub-problem should aim at what is <i>left over</i> of the target, <code>x - product(s[:i])</code>. When <code>i</code> is <code>len(s)</code> the slice is empty and the base case returns <code>0</code>, which covers the all-multiplication expression.</p>`
        },
        {
          key: "g", label: "ii.", points: 2,
          prompt: "Fill in blank (g). <b>Select all that apply.</b> Assume <code>sub</code> has been imported from the <code>operator</code> module. The <code>sub</code> function takes two arguments and subtracts the second from the first.",
          type: "select",
          options: ["abs", "sub", "abs(sub)", "sub(abs)", "lambda y: abs(x - y)", "lambda x, y: abs(x - y)"],
          answer: ["lambda y: abs(x - y)"],
          explain: `<p>A <code>key</code> function receives one element at a time and returns the value to compare by. Here we want distance from the target, so <code>lambda y: abs(x - y)</code> — and <code>x</code> is available because the lambda closes over <code>close</code>'s parameter.</p>
<ul>
<li><code>abs</code> alone would pick the choice closest to <i>zero</i>, not to <code>x</code>.</li>
<li><code>sub</code> and <code>lambda x, y: ...</code> take two arguments, so <code>min</code> cannot call them.</li>
<li><code>abs(sub)</code> and <code>sub(abs)</code> try to call those functions on a function object right away, which is a <code>TypeError</code>.</li>
</ul>`
        }
      ],
      runner: {
        label: "Fill in (f) and (g), then run the doctests. (<code>product</code> is supplied.)",
        prelude: `def product(s):
    if len(s) == 1:
        return s[0]
    return s[0] * product(s[1:])`,
        code: `def close(s, x):
    if not s:
        return 0
    choices = [product(s[:i]) + {{f}} for i in range(1, len(s) + 1)]
    return min(choices, key={{g}})`,
        tests: [
          { expr: "close([1, 2, 3, 4], 10)", expected: "10" },
          { expr: "close([1, 2, 3, 4], 20)", expected: "24" },
          { expr: "close([1, 2, 3, 4], 30)", expected: "25" },
          { expr: "close([3, 7, 5, 4, 2, 6], 66)", expected: "67" },
          { expr: "close([5], 100)", expected: "5" },
          { expr: "close([2, 3], 100)", expected: "6" }
        ]
      }
    },
    {
      label: "(d)", points: 0,
      intro: ["<p>Fill in the blank of <code>close_exp</code>, which takes a list of numbers <code>s</code> and a number <code>x</code>. It returns a string containing a plus-times-expression for <code>s</code> that evaluates to a number that is as close (in absolute value) as possible to <code>x</code>. (If there is more than one such expression, return any of them.)</p>",
              "<p>The built-in <code>eval</code> function takes a string containing an expression and returns its value. For example, <code>eval('2+2')</code> evaluates to 4.</p>"],
      code: `def close_exp(s, x):
    """Return the plus-times-expression of s that has a value closest to x.

    >>> print(close_exp([1, 2, 3, 4], 10))
    1+2+3+4
    >>> print(close_exp([1, 2, 3, 4], 20))
    1*2*3*4
    >>> print(close_exp([1, 2, 3, 4], 30))
    1+2*3*4
    >>> print(close_exp([3, 7, 5, 4, 2, 6], 66))
    3*7+5*4*2+6
    """
    goal = close(s, x)
    term = ''
    for i in range(len(s)):
        if term:
            term += '*'
        term += str(s[i])
        candidate = term
        if i < len(s) - 1:
            candidate += _______
        if eval(candidate) == goal:
            return candidate`,
      parts: [{
        key: "aplus", label: "i.", points: 0, aplus: true,
        prompt: "Fill in the blank. If your answer is too long, you can continue on another line.",
        type: "text", rows: 2, check: false,
        answer: "'+' + close_exp(s[i+1:], goal - eval(term))",
        explain: `<p>The loop is growing <code>term</code> into longer and longer first groups (<code>1</code>, then <code>1*2</code>, then <code>1*2*3</code>, …). For each one it asks: can the rest of the list make up the difference?</p>
<p>So the candidate is this group, then a <code>+</code>, then the best expression for the remaining elements <code>s[i+1:]</code> aimed at the remainder of the goal, <code>goal - eval(term)</code>. Because <code>goal</code> came from <code>close</code>, some split is guaranteed to hit it exactly, so the <code>eval(candidate) == goal</code> check eventually succeeds.</p>
<p><i>(No Run tests button here: this question depends on <code>eval</code>, which the in-browser Python does not implement. I checked this answer against all four doctests in real CPython.)</i></p>`
      }]
    }
  ]
}

]});
