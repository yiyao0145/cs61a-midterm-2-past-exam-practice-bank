// CS 61A Fall 2025 Midterm 2
EXAM_BANK.exams.push({
id: "fa25",
term: "Fall 2025",
points: 50,
questions: [

// ------------------------------------------------------------------ Q1
{
  num: 1, title: "What Would Python Display?", points: 5,
  intro: ["<p>Assume the following code has been executed.</p>"],
  code: `def weird(s):
    if s:
        if len(s) > 1:
            yield s[1]
        for x in weird(s[1:]):
            yield x
        yield s[0]

t = weird([5, [6, 7], 8])

def even(s):
    def weirder(t, i):
        if i < len(s):
            t.append(s[i-1])
            t.append(s[i])
            weirder(t, i * 2)
        return t
    return weirder([], 1)`,
  after: ["<p>Write the output displayed by each expression below or <i>Error</i> if an error occurs. If some output is displayed before the error, include it. Assume that each expression is evaluated in order and sequentially, so evaluating the first could affect the value of the second. Write <i>Generator</i> for a generator object and <i>Function</i> for a function.</p>"],
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 1, prompt: "print(next(t))", promptCode: true,
        type: "choice", options: ["5", "6", "7", "[6, 7]"],
        answer: "[6, 7]",
        explain: `<p><code>t</code> is <code>weird([5, [6, 7], 8])</code>. Nothing runs until the first <code>next</code>. Then <code>s</code> is truthy and <code>len(s) &gt; 1</code>, so the very first thing yielded is <code>s[1]</code> — the <i>element</i> at index 1, which is the list <code>[6, 7]</code>, not a number.</p>`
      },
      {
        key: "b", label: "(b)", points: 3, prompt: "print([x for x in t])", promptCode: true,
        type: "text", oneLine: true,
        answer: "[8, 8, [6, 7], 5]",
        explain: `<p>The full sequence <code>weird([5, [6, 7], 8])</code> yields is <code>[6, 7]</code>, <code>8</code>, <code>8</code>, <code>[6, 7]</code>, <code>5</code>. Part (a) already consumed the first one, so the comprehension collects the rest.</p>
<p>Why those middle values: after yielding <code>s[1]</code>, the generator loops over <code>weird([[6, 7], 8])</code>. That inner call yields its own <code>s[1]</code> (which is <code>8</code>), then loops over <code>weird([8])</code> — a one-element list, so it skips the first yield and just yields <code>s[0]</code>, another <code>8</code> — and finally yields its own <code>s[0]</code>, the list <code>[6, 7]</code>. Back at the top level, the last statement yields <code>s[0]</code>, which is <code>5</code>.</p>`
      },
      {
        key: "c", label: "(c)", points: 1,
        prompt: "What is the order of growth of the time it takes to execute <code>even(s)</code> for a list of numbers <code>s</code> in terms of the length of <code>s</code>? Assume that <code>len</code>, <code>list.append</code>, accessing a list item using square brackets, and all arithmetic operators (such as <code>-</code>, <code>&lt;</code>, and <code>*</code>) each takes a constant amount of time.",
        type: "choice", plainOptions: true,
        options: ["exponential", "quadratic", "linear", "logarithmic", "constant"],
        answer: "logarithmic",
        explain: `<p><code>weirder</code> starts at <code>i = 1</code> and each recursive call doubles it (<code>i * 2</code>), stopping once <code>i &gt;= len(s)</code>. Doubling from 1 up to <i>n</i> takes about log<sub>2</sub>(<i>n</i>) steps, and each call does a constant amount of work, so the total time is logarithmic.</p>`
      }
    ]
  }]
},

// ------------------------------------------------------------------ Q2
{
  num: 2, title: "That's a Wrap", points: 4,
  intro: ["<p>Answer the question below about this code. (The original exam also provided a blank environment diagram here; the diagram itself was not scored.)</p>"],
  code: `def wrap(s):
    return [s[0], s]

def peel(f, s):
    f(f(s)).append(2)
    t = s[1]
    t[0] = 3
    t = [4]
    return s

s = [5, [6, [7]]]
print(peel(lambda s: s[1],
           wrap(s)))`,
  sections: [{
    parts: [{
      key: "a", label: "(a)", points: 4,
      prompt: "What is displayed by running this code? If the code errors, write <i>Error</i>.",
      type: "text", oneLine: true,
      answer: "[5, [3, [6, [7], 2]]]",
      explain: `<p>Call the global list <code>S = [5, [6, [7]]]</code>. Then <code>wrap(S)</code> builds a new list <code>W = [5, S]</code>, and <code>peel</code> is called with <code>f = lambda s: s[1]</code> and <code>s = W</code>.</p>
<ul>
<li><code>f(W)</code> is <code>W[1]</code>, which is <code>S</code>. <code>f(S)</code> is <code>S[1]</code>, the inner <code>[6, [7]]</code>. Appending 2 to it makes it <code>[6, [7], 2]</code>, so now <code>S == [5, [6, [7], 2]]</code>.</li>
<li><code>t = s[1]</code> binds <code>t</code> to <code>S</code> itself, so <code>t[0] = 3</code> mutates <code>S</code> into <code>[3, [6, [7], 2]]</code>.</li>
<li><code>t = [4]</code> only rebinds the local name <code>t</code>; it changes nothing that is still reachable.</li>
<li><code>return s</code> returns <code>W</code>, which is <code>[5, S]</code> — and <code>S</code> has been mutated twice along the way.</li>
</ul>`
    }]
  }]
},

// ------------------------------------------------------------------ Q3
{
  num: 3, title: "Inclusive", points: 5,
  intro: [
    "<p><b>Definition.</b> A tree <code>whole</code> <i>includes</i> a tree <code>part</code> if it is possible to create a tree with the same repr string as <code>part</code> by removing some of the nodes of <code>whole</code> (but making no other changes). When a node is removed, all of its children are removed as well. The order of the nodes that remain must match, so that the repr string is the same.</p>",
    "<p>Implement <code>includes</code>, which takes a <code>Tree</code> instance <code>part</code> and a <code>Tree</code> instance <code>whole</code> and returns whether <code>whole</code> includes <code>part</code>.</p>"
  ],
  code: `def includes(part, whole):
    """Return whether the Tree part is included in the Tree whole.

    >>> p1 = Tree(2, [Tree(20), Tree(22)])
    >>> right = Tree(2, [Tree(19), Tree(20), Tree(21), Tree(22), Tree(23)])
    >>> wrong = Tree(2, [Tree(19), Tree(22), Tree(20), Tree(23)])
    >>> [includes(p1, right), includes(p1, wrong), includes(Tree(1, [right]), p1)]
    [True, False, False]
    >>> p2 = Tree(1, [Tree(6), p1])
    >>> includes(p2, Tree(1, [Tree(5), Tree(6, [Tree(7)]), wrong, right]))
    True
    >>> includes(p2, Tree(1, [Tree(5), Tree(6, [Tree(7)]), wrong, Tree(8, [right])]))
    False
    """
    if whole.label != part.label:
        return False
    p, w = 0, 0
    while _______:
             (a)
        if _______:
              (b)
            p += 1
        w += 1
    return _______
              (c)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 1, prompt: "Fill in blank (a).",
        type: "choice",
        options: [
          "p < len(part.branches)",
          "w < len(whole.branches)",
          "p < len(part.branches) or w < len(whole.branches)",
          "p < len(part.branches) and w < len(whole.branches)"
        ],
        answer: "p < len(part.branches) and w < len(whole.branches)",
        explain: `<p><code>w</code> scans through <code>whole</code>'s branches and <code>p</code> advances only when a match is found. The scan should stop as soon as either pointer runs out: there is nothing left to match against (<code>w</code> exhausted) or everything has already been matched (<code>p</code> exhausted). That is the <code>and</code> version. Using <code>or</code> would keep looping after one pointer went past its end and index out of range.</p>`
      },
      {
        key: "b", label: "(b)", points: 2, prompt: "Fill in blank (b).",
        type: "text", oneLine: true, check: false,
        answer: "includes(part.branches[p], whole.branches[w])",
        explain: `<p>At each step we ask whether the branch of <code>whole</code> we are looking at can account for the next branch of <code>part</code> — which is the same question one level down, so it is a recursive call. If it succeeds, that part branch is matched and <code>p</code> advances; either way <code>w</code> advances to the next candidate in <code>whole</code>.</p>`
      },
      {
        key: "c", label: "(c)", points: 2, prompt: "Fill in blank (c).",
        type: "text", oneLine: true, check: false,
        answer: "p == len(part.branches)",
        explain: `<p>The loop ends either because every branch of <code>part</code> found a match (success) or because <code>whole</code> ran out of branches first (failure). Those two cases are distinguished exactly by whether <code>p</code> reached the end of <code>part.branches</code>.</p>`
      }
    ],
    runner: {
      label: "Fill in (a), (b) and (c), then run the original doctests.",
      code: `def includes(part, whole):
    if whole.label != part.label:
        return False
    p, w = 0, 0
    while {{a}}:
        if {{b}}:
            p += 1
        w += 1
    return {{c}}

p1 = Tree(2, [Tree(20), Tree(22)])
right = Tree(2, [Tree(19), Tree(20), Tree(21), Tree(22), Tree(23)])
wrong = Tree(2, [Tree(19), Tree(22), Tree(20), Tree(23)])
p2 = Tree(1, [Tree(6), p1])`,
      tests: [
        { expr: "[includes(p1, right), includes(p1, wrong), includes(Tree(1, [right]), p1)]", expected: "[True, False, False]" },
        { expr: "includes(p2, Tree(1, [Tree(5), Tree(6, [Tree(7)]), wrong, right]))", expected: "True" },
        { expr: "includes(p2, Tree(1, [Tree(5), Tree(6, [Tree(7)]), wrong, Tree(8, [right])]))", expected: "False" }
      ]
    }
  }]
},

// ------------------------------------------------------------------ Q4
{
  num: 4, title: "Exclusive", points: 6,
  sections: [
    {
      label: "(a)", points: 2,
      intro: ["<p>Implement <code>exclude</code>, which takes a list of numbers <code>s</code> and a number <code>x</code>. It returns a list with all the elements of <code>s</code> that are not equal to <code>x</code>. The input list should not be modified. It is possible that <code>s</code> could be an empty list.</p>"],
      code: `def exclude(s, x):
    """Return a list with all of the elements of s except those equal to x.

    >>> a = [3, 4, 5, 3.0, 6, 5, 3]
    >>> exclude(a, 3)
    [4, 5, 6, 5]
    >>> a                      # no change to a
    [3, 4, 5, 3.0, 6, 5, 3]
    """
    return _______`,
      parts: [{
        key: "a", label: "(a)", points: 2, prompt: "Implement <code>exclude</code>.",
        type: "text", oneLine: true, check: false,
        answer: "[y for y in s if y != x]",
        explain: `<p>A list comprehension builds a brand-new list, so the input is never touched. Note that <code>3.0 != 3</code> is <code>False</code> in Python, so the <code>3.0</code> is excluded too — matching the doctest.</p>`
      }],
      runner: {
        code: `def exclude(s, x):
    return {{a}}

a = [3, 4, 5, 3.0, 6, 5, 3]
r = exclude(a, 3)`,
        tests: [
          { expr: "r", expected: "[4, 5, 6, 5]" },
          { expr: "a", expected: "[3, 4, 5, 3.0, 6, 5, 3]" },
          { expr: "exclude([], 1)", expected: "[]" }
        ]
      }
    },
    {
      label: "(b)", points: 4,
      intro: ["<p>Implement <code>exclude_link</code>, which takes a linked list of numbers <code>s</code> and a number <code>x</code>. It returns a linked list with all the elements of <code>s</code> that are not equal to <code>x</code>. The input linked list should not be modified. It is possible that <code>s</code> could be an empty linked list.</p>"],
      code: `def exclude_link(s, x):
    """Return a linked list with all of the elements of linked list s except those equal to x.

    >>> a = Link(3, Link(4, Link(5, Link(3.0, Link(6, Link(5, Link(3)))))))
    >>> exclude_link(a, 3)
    Link(4, Link(5, Link(6, Link(5))))
    >>> a                      # no change to a
    Link(3, Link(4, Link(5, Link(3.0, Link(6, Link(5, Link(3)))))))
    """
    if _______:        (b)
        return _______ (c)
    elif _______:      (d)
        return _______ (e)
    else:
        return _______ (f)`,
      parts: [
        {
          key: "b", label: "(b)", points: 1, prompt: "Fill in the first blank (<code>if</code> condition).",
          type: "text", oneLine: true, check: false,
          answer: "s is Link.empty",
          accept: ["s == Link.empty"],
          explain: `<p>The base case of any linked-list recursion: there is nothing left to filter.</p>`
        },
        {
          key: "c", label: "(c)", points: 1, prompt: "Fill in the second blank (first <code>return</code>).",
          type: "text", oneLine: true, check: false,
          answer: "Link.empty",
          accept: ["s"],
          explain: `<p>Filtering an empty linked list gives an empty linked list. (<code>s</code> also works here, since <code>s</code> <i>is</i> <code>Link.empty</code> in this branch.)</p>`
        },
        {
          key: "d", label: "(d)", points: 1, prompt: "Fill in the third blank (<code>elif</code> condition).",
          type: "text", oneLine: true, check: false,
          answer: "s.first == x",
          explain: `<p>The middle case: this element is one we are supposed to drop.</p>`
        },
        {
          key: "e", label: "(e)", points: 1, prompt: "Fill in the fourth blank (<code>elif</code> return).",
          type: "text", oneLine: true, check: false,
          answer: "exclude_link(s.rest, x)",
          explain: `<p>Skip this element entirely by returning only the filtered rest — do not wrap it in a <code>Link</code>.</p>`
        },
        {
          key: "f", label: "(f)", points: 1, prompt: "Fill in the fifth blank (<code>else</code> return).",
          type: "text", oneLine: true, check: false,
          answer: "Link(s.first, exclude_link(s.rest, x))",
          explain: `<p>Keep this element by building a <i>new</i> <code>Link</code> around the filtered rest. Building new nodes rather than reassigning <code>s.rest</code> is what leaves the original list unmodified.</p>`
        }
      ],
      runner: {
        code: `def exclude_link(s, x):
    if {{b}}:
        return {{c}}
    elif {{d}}:
        return {{e}}
    else:
        return {{f}}

a = Link(3, Link(4, Link(5, Link(3.0, Link(6, Link(5, Link(3)))))))
r = exclude_link(a, 3)`,
        tests: [
          { expr: "r", expected: "Link(4, Link(5, Link(6, Link(5))))" },
          { expr: "a", expected: "Link(3, Link(4, Link(5, Link(3.0, Link(6, Link(5, Link(3)))))))" },
          { expr: "exclude_link(Link.empty, 3) is Link.empty", expected: "True" },
          { expr: "exclude_link(Link(3, Link(3)), 3) is Link.empty", expected: "True" }
        ]
      }
    }
  ]
},

// ------------------------------------------------------------------ Q5
{
  num: 5, title: "Pizza Parlor", points: 10,
  intro: ["<p>A Pizza <code>Parlor</code> has attributes for its <code>name</code> (str), the <code>price</code> (int) of each pizza it sells, the number of <code>pizzas</code> (int) it has available to cook, an <code>alt</code> (an alternative <code>Parlor</code>) to help with large orders, and its total <code>profit</code> (int). Its <code>order</code> method takes a positive integer <code>quantity</code> and optionally a <code>Parlor</code> instance <code>source</code> and processes an order as follows. A <code>Parlor</code> will cook at most its number of <code>pizzas</code>. If an order is larger than its number of <code>pizzas</code>, it will order the rest from its <code>alt</code>. Its <code>profit</code> increases by its <code>price</code> times the quantity of pizzas ordered, but decreases by its <code>alt</code>'s <code>price</code> times the quantity it orders from <code>alt</code>. A message is printed each time an order is completed or made with another <code>Parlor</code> as the source. A <code>MegaParlor</code> can cook any quantity of pizzas and has no <code>alt</code>.</p>"],
  code: `class Parlor:
    """A Pizza Parlor has an alt(ernative) Parlor that helps it handle big orders.

    >>> c = Parlor('Sliver', 3, 10, Parlor('Cheeseboard', 4, 10, MegaParlor(5)))
    >>> c.order(6)   # All $3*6 goes to Sliver; it has 4 pizzas left
    Sliver now has $18 profit
    >>> c.order(6)   # Another $3*6 goes to Sliver, which pays $4*2 to Cheeseboard
    Sliver forwarded an order of 2 to Cheeseboard
    Cheeseboard now has $8 profit
    Sliver now has $28 profit
    >>> c.order(10)  # Sliver gets $3*10 but pays Cheeseboard $4*10, which pays $5*2 to MEGA
    Sliver forwarded an order of 10 to Cheeseboard
    Cheeseboard forwarded an order of 2 to MEGA
    MEGA now has $10 profit
    Cheeseboard now has $38 profit
    Sliver now has $18 profit
    """
    def __init__(self, name, price, pizzas, alt):
        self.name, self.price, self.pizzas, self.alt = name, price, pizzas, alt
        self.profit = 0

    def cook(self, q):
        overload = _______      # The quantity that must be ordered from alt
                     (a)
        self.pizzas -= (q - overload)   # The quantity cooked by this Parlor
        return overload

    def order(self, quantity, source=None):
        if isinstance(source, Parlor):
            print(source.name, 'forwarded an order of', quantity, 'to', self.name)
        self.profit += _______  (b)
        rest = _______          (c)
        if rest:
            self.profit -= _______  (d)
            _______             (e)
        print(f'{self.name} now has \${self.profit} profit')

class MegaParlor(Parlor):
    def __init__(self, price):
        self.name, self.price, self.profit = "MEGA", price, 0

    def cook(self, q):
        return _______          (f)`,
  sections: [{
    parts: [
      {
        key: "a", label: "(a)", points: 1, prompt: "Fill in blank (a).",
        type: "choice",
        options: ["q - self.pizzas", "abs(q - self.pizzas)", "max(0, q - self.pizzas)", "min(0, q - self.pizzas)"],
        answer: "max(0, q - self.pizzas)",
        explain: `<p>The overload is how much the order exceeds what this parlor can cook — but never negative. If the parlor has plenty of pizzas, <code>q - self.pizzas</code> is negative and the overload should be 0, which is exactly what <code>max(0, ...)</code> gives. <code>abs</code> would turn spare capacity into a phantom forwarded order.</p>`
      },
      {
        key: "b", label: "(b)", points: 1, prompt: "Fill in blank (b).",
        type: "choice",
        options: ["price * quantity", "price * self.quantity", "price * pizzas", "price * self.pizzas",
                  "self.price * quantity", "self.price * self.quantity", "self.price * pizzas", "self.price * self.pizzas"],
        answer: "self.price * quantity",
        explain: `<p>"Its profit increases by its <code>price</code> times the quantity of pizzas ordered." <code>price</code> is an attribute, so it needs <code>self.</code>; <code>quantity</code> is a parameter of this method, so it does not.</p>`
      },
      {
        key: "c", label: "(c)", points: 2, prompt: "Fill in blank (c). <b>IMPORTANT:</b> You may not call <code>type</code> or <code>isinstance</code>.",
        type: "text", oneLine: true, check: false,
        answer: "self.cook(quantity)",
        explain: `<p><code>cook</code> both updates the pizza count and reports what is left over. Because <code>MegaParlor</code> overrides <code>cook</code>, calling it through <code>self</code> automatically does the right thing for both classes — that is why no <code>isinstance</code> check is needed.</p>`
      },
      {
        key: "d", label: "(d)", points: 2, prompt: "Fill in blank (d).",
        type: "text", oneLine: true, check: false,
        answer: "self.alt.price * rest",
        explain: `<p>"... decreases by its <code>alt</code>'s <code>price</code> times the quantity it orders from <code>alt</code>." The quantity forwarded is <code>rest</code>.</p>`
      },
      {
        key: "e", label: "(e)", points: 3, prompt: "Fill in blank (e). <b>IMPORTANT:</b> You may not write <code>=</code>.",
        type: "text", oneLine: true, check: false,
        answer: "self.alt.order(rest, self)",
        explain: `<p>Forward the leftover to the alternative parlor, passing <code>self</code> as the <code>source</code> so that the alt prints the "forwarded an order of …" line. The ban on <code>=</code> rules out keyword-argument syntax like <code>source=self</code>, so pass it positionally.</p>`
      },
      {
        key: "f", label: "(f)", points: 1, prompt: "Fill in blank (f).",
        type: "text", oneLine: true, check: false,
        answer: "0",
        explain: `<p>A <code>MegaParlor</code> can cook any quantity, so nothing is ever left over to forward — and returning 0 keeps the <code>if rest:</code> branch in <code>order</code> from running, which matters because a <code>MegaParlor</code> has no <code>alt</code>.</p>`
      }
    ],
    runner: {
      label: "Fill in (a)–(f), then run the class doctest.",
      code: `class Parlor:
    def __init__(self, name, price, pizzas, alt):
        self.name, self.price, self.pizzas, self.alt = name, price, pizzas, alt
        self.profit = 0
    def cook(self, q):
        overload = {{a}}
        self.pizzas -= (q - overload)
        return overload
    def order(self, quantity, source=None):
        if isinstance(source, Parlor):
            print(source.name, 'forwarded an order of', quantity, 'to', self.name)
        self.profit += {{b}}
        rest = {{c}}
        if rest:
            self.profit -= {{d}}
            {{e}}
        print(self.name + ' now has $' + str(self.profit) + ' profit')

class MegaParlor(Parlor):
    def __init__(self, price):
        self.name, self.price, self.profit = "MEGA", price, 0
    def cook(self, q):
        return {{f}}

_log = []
_real_print = print
def _capture(*args):
    _log.append(' '.join([str(a) for a in args]))

print = _capture
c = Parlor('Sliver', 3, 10, Parlor('Cheeseboard', 4, 10, MegaParlor(5)))
c.order(6)
c.order(6)
c.order(10)
print = _real_print
_out = _log`,
      tests: [
        { expr: "_out[0]", expected: "'Sliver now has $18 profit'" },
        { expr: "_out[1]", expected: "'Sliver forwarded an order of 2 to Cheeseboard'" },
        { expr: "_out[2]", expected: "'Cheeseboard now has $8 profit'" },
        { expr: "_out[3]", expected: "'Sliver now has $28 profit'" },
        { expr: "_out[4]", expected: "'Sliver forwarded an order of 10 to Cheeseboard'" },
        { expr: "_out[5]", expected: "'Cheeseboard forwarded an order of 2 to MEGA'" },
        { expr: "_out[6]", expected: "'MEGA now has $10 profit'" },
        { expr: "_out[7]", expected: "'Cheeseboard now has $38 profit'" },
        { expr: "_out[8]", expected: "'Sliver now has $18 profit'" }
      ]
    }
  }]
},

// ------------------------------------------------------------------ Q6
{
  num: 6, title: "Two Topping Pizzas", points: 20,
  intro: ["<p>Kay and John want to share a pizza. Kay likes mushroom and John likes pineapple, but they won't eat a pizza that has a mushroom slice next to a pineapple slice (eek!). A pizza with <code>n</code> slices is represented as a length-<code>n</code> string containing <code>M</code> for a mushroom slice, <code>P</code> for a pineapple slice, and <code>_</code> for a slice with no topping. Slices are <i>next to</i> each other if they are adjacent in the string <b>or</b> are the first and last element of the string. Kay and John won't eat <code>MMMMPPPP</code> (because <code>MP</code>) or <code>MM__PP</code> (because the first <code>M</code> is next to the last <code>P</code>), but will eat these: <code>'MM__M_PP_M'</code>, <code>'_P_M_P_M'</code>, and <code>'_PP_MM_P_M_'</code>.</p>"],
  sections: [
    {
      label: "(a)", points: 2,
      intro: [
        "<p>Implement <code>symmetrical</code>, which takes a dictionary <code>d</code> and returns <code>True</code> if for every pair <code>(k, v)</code> for which <code>d[k] == v</code>, it's also true that <code>d[v] == k</code>, and returns <code>False</code> otherwise. Assume <code>None</code> is not a key or value in <code>d</code>.</p>",
        "<p>The <code>get</code> method of a dict takes a key and returns the value for that key if the key is in the dictionary and otherwise returns <code>None</code>.</p>"
      ],
      code: `def symmetrical(d):
    """Return whether every key-value pair in d is also a value-key pair.

    >>> symmetrical({'M': 'P', 'P': 'M', 'G': 'G'})
    True
    >>> symmetrical({'M': 'P', 'P': 'M', 'G': 'M'})   # No M->G
    False
    >>> symmetrical({'M': 'P', 'P': 'M', 'G': 'T'})   # No T->G
    False
    """
    return all([ _______ for k in d.keys()])
                   (a)`,
      parts: [{
        key: "a", label: "i.", points: 2, prompt: "Fill in blank (a).",
        type: "choice",
        options: ["k in d and d[k] in d", "k in d.keys() and d[k] in d.values()", "k in d.keys() and v in d.values()",
                  "d[k] == d.get(k)", "d[k] == d.get(v)", "d[k] == v and d.get(v) == k", "d[k] != v or d.get(v) == k",
                  "d[k].get(v) == v", "d[k].get(v) == k", "d[k].get(k) == v", "d[k].get(k) == k",
                  "d.get(d[k]) == v", "d.get(d[k]) == k", "d.get(d[k]) == d.get(v)", "d.get(d[k]) == d.get(k)"],
        answer: "d.get(d[k]) == k",
        explain: `<p>The comprehension only binds <code>k</code> — there is no <code>v</code> in scope, so every option mentioning <code>v</code> would raise a <code>NameError</code>. Writing the condition in terms of <code>k</code> alone: the value for <code>k</code> is <code>d[k]</code>, and looking <i>that</i> up must give <code>k</code> back, i.e. <code>d.get(d[k]) == k</code>. Using <code>.get</code> rather than <code>[]</code> matters because <code>d[k]</code> need not itself be a key, in which case the answer should be <code>False</code> instead of a <code>KeyError</code>.</p>`
      }],
      runner: {
        code: `def symmetrical(d):
    return all([ {{a}} for k in d.keys()])`,
        tests: [
          { expr: "symmetrical({'M': 'P', 'P': 'M', 'G': 'G'})", expected: "True" },
          { expr: "symmetrical({'M': 'P', 'P': 'M', 'G': 'M'})", expected: "False" },
          { expr: "symmetrical({'M': 'P', 'P': 'M', 'G': 'T'})", expected: "False" },
          { expr: "symmetrical({})", expected: "True" }
        ]
      }
    },
    {
      label: "(b)", points: 4,
      intro: ["<p>Implement <code>acceptable</code>, which takes a non-empty string <code>pizza</code> and a symmetrical dictionary of strings <code>disallow</code>. It returns whether <code>pizza</code> represents a pizza in which no slice that is next to another slice appears as a key-value pair in <code>disallow</code>. Assume that every key in <code>disallow</code> is not equal to its value.</p>"],
      code: `def acceptable(pizza, disallow={'M': 'P', 'P': 'M'}):
    """Return whether there are no slices next to each other with a disallowed topping pair.

    >>> acceptable("MM_PPP__M")
    True
    >>> acceptable("MM__PPP")    # The first slice M and last slice P are next to each other.
    False
    >>> acceptable("MM__PPP_")
    True
    >>> acceptable("MM__MPPP_")
    False
    """
    assert symmetrical(disallow)
    previous = ''
    for slice in pizza:
        if previous _______:
                      (b)
            return False
        _______
          (c)
    return _______
             (d)`,
      parts: [
        {
          key: "b", label: "i.", points: 1, prompt: "Fill in blank (b).",
          type: "choice",
          options: ["or disallow.get(previous) == slice", "and disallow.get(previous) == slice",
                    "or disallow.get(previous) == disallow.get(slice)", "and disallow.get(previous) == disallow.get(slice)"],
          answer: "and disallow.get(previous) == slice",
          explain: `<p>The condition reads <code>if previous &lt;blank&gt;:</code>, so the blank continues an expression that starts with <code>previous</code>. On the very first iteration <code>previous</code> is <code>''</code> (falsy), and <code>and</code> short-circuits so no comparison happens — exactly right, since the first slice has no predecessor yet. Comparing <code>disallow.get(previous)</code> to <code>slice</code> asks "is this pair forbidden?". The <code>or</code> versions would fire on the first slice; comparing two <code>.get</code> results compares the wrong things.</p>`
        },
        {
          key: "c", label: "ii.", points: 1, prompt: "Fill in blank (c).",
          type: "choice",
          options: ["previous = slice", "previous = pizza[slice]", "previous = previous + 1",
                    "slice = previous", "slice = pizza[slice]", "slice = disallow.get(previous)"],
          answer: "previous = slice",
          explain: `<p>Advance the "slice I just looked at" marker so the next iteration compares the right pair. Assigning to <code>slice</code> would be pointless — the <code>for</code> loop rebinds it immediately.</p>`
        },
        {
          key: "d", label: "iii.", points: 2, prompt: "Fill in blank (d). <b>IMPORTANT:</b> You may not call <code>acceptable</code>.",
          type: "text", oneLine: true, check: false,
          answer: "disallow.get(pizza[0]) != pizza[-1]",
          accept: ["disallow.get(pizza[-1]) != pizza[0]"],
          explain: `<p>The loop checked every adjacent pair <i>inside</i> the string but never the wraparound pair. What is left is to confirm the last slice and the first slice are not a forbidden pair — and if they are fine, the pizza is acceptable, so this expression is the return value itself.</p>`
        }
      ],
      runner: {
        label: "Fill in (b), (c) and (d), then run the doctests. (A correct <code>symmetrical</code> is supplied.)",
        prelude: `def symmetrical(d):
    return all([d.get(d[k]) == k for k in d.keys()])`,
        code: `def acceptable(pizza, disallow={'M': 'P', 'P': 'M'}):
    assert symmetrical(disallow)
    previous = ''
    for slice in pizza:
        if previous {{b}}:
            return False
        {{c}}
    return {{d}}`,
        tests: [
          { expr: "acceptable('MM_PPP__M')", expected: "True" },
          { expr: "acceptable('MM__PPP')", expected: "False" },
          { expr: "acceptable('MM__PPP_')", expected: "True" },
          { expr: "acceptable('MM__MPPP_')", expected: "False" },
          { expr: "acceptable('MM__M_PP_M')", expected: "True" },
          { expr: "acceptable('_P_M_P_M')", expected: "True" },
          { expr: "acceptable('MP')", expected: "False" },
          { expr: "acceptable('_')", expected: "True" }
        ]
      }
    },
    {
      label: "(c)", points: 6,
      intro: ["<p>Implement <code>count_pizzas</code>, which takes a positive integer <code>num_slices</code> and returns the number of different pizzas that have mushroom (<code>M</code>), pineapple (<code>P</code>) or no topping (<code>_</code>) slices without <code>M</code> next to <code>P</code>. You may not call <code>acceptable</code>.</p>"],
      code: `def count_pizzas(num_slices):
    """Return the number of ways to top a pizza with num_slices.

    >>> count_pizzas(1)   # One slice can have mushroom, or pineapple, or no topping.
    3
    >>> count_pizzas(2)   # MM  M_  _M  __  PP  P_  _P
    7
    """
    def f(n, first, previous):
        if _______:
             (e)
            if first == previous or _______:
                                      (f)
                return 1
            return 0
        allowed_next = _______
                         (g)
        if previous == 'P':
            allowed_next.remove('M')
        if previous == 'M':
            allowed_next.remove('P')
        return sum([_______ for x in allowed_next])
                      (h)
    slice_types = ['_', 'M', 'P']
    return sum([f(1, x, x) for x in slice_types])`,
      parts: [
        {
          key: "e", label: "i.", points: 1, prompt: "Fill in blank (e).",
          type: "text", oneLine: true, check: false,
          answer: "n == num_slices",
          explain: `<p><code>f</code> is called with <code>n = 1</code> for the first slice and counts up, so the pizza is complete once <code>n</code> reaches <code>num_slices</code>. At that point the only thing left to verify is the wraparound pair.</p>`
        },
        {
          key: "f", label: "ii.", points: 1, prompt: "Fill in blank (f).",
          type: "choice",
          options: ["'_' in [first, previous]", "first in ['M', 'P']",
                    "first in ['M', 'P'] or previous in ['M', 'P']", "first != previous"],
          answer: "'_' in [first, previous]",
          explain: `<p>Here <code>first</code> is the first slice and <code>previous</code> is the last one, so this check is the wraparound. The pair is fine when the two are equal (already handled by <code>first == previous</code>) or when at least one of them is untopped — a plain slice can sit next to anything.</p>`
        },
        {
          key: "g", label: "iii.", points: 1, prompt: "Fill in blank (g).",
          type: "choice",
          options: ["slice_types", "list(slice_types)", "[first, previous]", "[first, previous, '_']"],
          answer: "list(slice_types)",
          explain: `<p>The next two lines call <code>allowed_next.remove(...)</code>, which mutates the list in place. Binding <code>allowed_next</code> straight to <code>slice_types</code> would destroy the shared master list after the first removal; <code>list(...)</code> makes a fresh copy each call.</p>`
        },
        {
          key: "h", label: "iv.", points: 3, prompt: "Fill in blank (h).",
          type: "text", oneLine: true, check: false,
          answer: "f(n + 1, first, x)",
          explain: `<p>Add one slice: the count advances to <code>n + 1</code>, <code>first</code> never changes (it is needed at the end for the wraparound check), and the slice just placed, <code>x</code>, becomes the new <code>previous</code>.</p>`
        }
      ],
      runner: {
        code: `def count_pizzas(num_slices):
    def f(n, first, previous):
        if {{e}}:
            if first == previous or {{f}}:
                return 1
            return 0
        allowed_next = {{g}}
        if previous == 'P':
            allowed_next.remove('M')
        if previous == 'M':
            allowed_next.remove('P')
        return sum([{{h}} for x in allowed_next])
    slice_types = ['_', 'M', 'P']
    return sum([f(1, x, x) for x in slice_types])`,
        tests: [
          { expr: "count_pizzas(1)", expected: "3" },
          { expr: "count_pizzas(2)", expected: "7" },
          { expr: "count_pizzas(3)", expected: "15" },
          { expr: "count_pizzas(4)", expected: "35" },
          { expr: "count_pizzas(5)", expected: "83" }
        ]
      }
    },
    {
      label: "(d)", points: 8,
      intro: ["<p>Implement <code>pizzas</code>, which takes a positive integer <code>n</code> and returns a list of all different pizzas that have mushroom (<code>M</code>), pineapple (<code>P</code>) or no topping (<code>_</code>) slices and do not have <code>M</code> next to <code>P</code>. The <code>check_ends</code> argument indicates whether to check that the first and last slice are allowed to be next to each other. You may not call <code>acceptable</code>.</p>"],
      code: `def pizzas(n, check_ends=True):
    """Ways to distribute M and P toppings on a pizza with n slices.

    >>> pizzas(1)
    ['_', 'M', 'P']
    >>> pizzas(2)
    ['__', '_M', '_P', 'M_', 'MM', 'P_', 'PP']
    >>> pizzas(3)
    ['___', '__M', '__P', '_M_', '_MM', '_P_', '_PP',
     'M__', 'M_M', 'MM_', 'MMM', 'P__', 'P_P', 'PP_', 'PPP']
    >>> '_M_P' in pizzas(4)
    True
    >>> [pizzas(8)[i*90] for i in range(1, 7)]   # A few examples from pizzas(8)
    ['___PP_M_', '__P__MMM', '_M__P__P', '_MM_M_P_', '_P_M___M', '_PP_P_MM']
    """
    if n == 0:
        return _______
                 (i)
    recurse = pizzas(n-1, False)
    ways = _______
             (j)
    for y, z in [['M', 'P'], ['P', 'M']]:
        _______([y + x for x in recurse if not x or _______])
          (k)                                         (l)
    ok = lambda x: True
    if check_ends:
        ok = lambda x: x[0] + x[-1] not in ['MP', 'PM']
    return _______      # Must be a call expression
             (m)`,
      parts: [
        {
          key: "i", label: "i.", points: 1, prompt: "Fill in blank (i).",
          type: "text", oneLine: true, check: false,
          answer: "['']",
          explain: `<p>A pizza with zero slices is one single thing — the empty string — so the base case returns a list containing it. Returning <code>[]</code> instead would make every longer case build nothing at all.</p>`
        },
        {
          key: "j", label: "ii.", points: 2, prompt: "Fill in blank (j). <b>IMPORTANT:</b> You may not call <code>pizzas</code> in this blank.",
          type: "text", oneLine: true, check: false,
          answer: "['_' + x for x in recurse]",
          explain: `<p>Start the result with every shorter pizza prefixed by an untopped slice. <code>_</code> never conflicts with whatever follows, so no filtering is needed here — and the ordering this produces (<code>_</code> first, then <code>M</code>, then <code>P</code>) is exactly what the doctests expect.</p>`
        },
        {
          key: "k", label: "iii.", points: 1, prompt: "Fill in blank (k).",
          type: "choice",
          options: ["yield", "yield from", "return", "ways =", "ways.append", "ways.extend"],
          answer: "ways.extend",
          explain: `<p>The blank is applied to a whole <i>list</i> of new pizzas and the result must be accumulated into <code>ways</code>. <code>extend</code> adds each element individually; <code>append</code> would nest a list inside the list, and <code>return</code>/<code>yield</code> would abandon the loop.</p>`
        },
        {
          key: "l", label: "iv.", points: 2, prompt: "Fill in blank (l).",
          type: "text", oneLine: true, check: false,
          answer: "x[0] != z",
          explain: `<p>When prefixing with <code>y</code> (say <code>M</code>), the shorter pizza must not begin with the forbidden partner <code>z</code> (<code>P</code>) — otherwise the new pizza would contain <code>MP</code>. The <code>not x or</code> in front already handles the empty-string case, so indexing <code>x[0]</code> here is safe.</p>`
        },
        {
          key: "m", label: "v.", points: 2, prompt: "Fill in blank (m). <b>IMPORTANT:</b> You may only write names, parentheses, and commas. No <code>[ ]</code>.",
          type: "text", oneLine: true, check: false,
          answer: "list(filter(ok, ways))",
          explain: `<p><code>ok</code> is the wraparound test (or the always-true function when <code>check_ends</code> is false), so the answer is simply every accumulated way that passes it. <code>filter</code> gives an iterator, and the function must return a list, so wrap it in <code>list</code>. Note that the natural construction order is already the order the doctests show — sorting would break them, since <code>'_'</code> sorts <i>after</i> letters in ASCII.</p>`
        },
        {
          key: "aplus", label: "vi.", points: 0, aplus: true,
          prompt: `Fill in the blank of this alternate implementation of <code>pizzas</code>. You may call <code>acceptable</code> and <code>count_pizzas</code>. Here are two examples of calling <code>sum</code> on a list of lists with an optional <code>start</code> argument: <code>sum([[1, 2], [3]], start=[])</code> is <code>[1, 2, 3]</code>, and <code>sum([], start=[])</code> is <code>[]</code>.`,
          code: `def pizzas(n):
    """Ways to distribute M and P toppings on a pizza with n slices."""
    def g(pizzas):
        yield from pizzas
        yield from g(sum([[p + s for s in slices] for p in pizzas], start=[]))
    slices = ['_', 'M', 'P']
    t, u = _______
    return [next(t) for _ in u]`,
          type: "text", rows: 3, check: false,
          answer: "filter(lambda p: len(p) == n and acceptable(p), g([''])), range(count_pizzas(n))",
          explain: `<p><code>g([''])</code> is an infinite generator that yields every string over <code>slices</code> in order of increasing length: first <code>''</code>, then all length-1 strings, then all length-2, and so on.</p>
<p><code>t</code> should therefore be that stream narrowed to the ones we want — length exactly <code>n</code> and acceptable. Checking the length first matters: it short-circuits so <code>acceptable</code> is never called on <code>''</code>, which would crash on <code>pizza[0]</code>.</p>
<p><code>u</code> only has to have the right <i>length</i>, since the final line pulls one item per element of <code>u</code>. <code>count_pizzas(n)</code> is exactly how many valid pizzas there are, so <code>range(count_pizzas(n))</code> stops the lazy filter at the right point instead of running forever.</p>`
        }
      ],
      runner: {
        label: "Fill in (i)–(v) — the A+ blank is not included — then run the doctests.",
        code: `def pizzas(n, check_ends=True):
    if n == 0:
        return {{i}}
    recurse = pizzas(n-1, False)
    ways = {{j}}
    for y, z in [['M', 'P'], ['P', 'M']]:
        {{k}}([y + x for x in recurse if not x or {{l}}])
    ok = lambda x: True
    if check_ends:
        ok = lambda x: x[0] + x[-1] not in ['MP', 'PM']
    return {{m}}`,
        tests: [
          { expr: "pizzas(1)", expected: "['_', 'M', 'P']" },
          { expr: "pizzas(2)", expected: "['__', '_M', '_P', 'M_', 'MM', 'P_', 'PP']" },
          { expr: "pizzas(3)", expected: "['___', '__M', '__P', '_M_', '_MM', '_P_', '_PP', 'M__', 'M_M', 'MM_', 'MMM', 'P__', 'P_P', 'PP_', 'PPP']" },
          { expr: "'_M_P' in pizzas(4)", expected: "True" },
          { expr: "[pizzas(8)[i*90] for i in range(1, 7)]", expected: "['___PP_M_', '__P__MMM', '_M__P__P', '_MM_M_P_', '_P_M___M', '_PP_P_MM']" }
        ]
      }
    }
  ]
}

]});
