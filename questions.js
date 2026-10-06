// CS61A Midterm 2 Practice — question bank.
// Each problem is converted from an original fill-in-the-blank / multi-choice
// exam question into a full coding-implementation problem. See README.md for
// how to add more exams to this file.
//
// Problem shape:
//   id, topic, level (1-4 stars), title, source, prompt (array of html strings),
//   examples (doctest text), provided (optional extra helper code shown + run
//   alongside the global prelude), starter, hints (array, progressive),
//   solution, tests (array of {setup, expr, expected} — expected is literal
//   Python source, compared via repr), idea, mistakes (array).

var QUESTION_BANK = {

prelude: `class Link:
    empty = ()
    def __init__(self, first, rest=()):
        self.first = first
        self.rest = rest
    def __repr__(self):
        s = '(' + repr(self.first)
        r = self.rest
        while r != Link.empty:
            s += ' ' + repr(r.first)
            r = r.rest
        return s + ')'

def ll(*vals):
    """Build a linked list: ll(3, 4, 5) is (3 4 5)."""
    result = Link.empty
    for i in range(len(vals) - 1, -1, -1):
        result = Link(vals[i], result)
    return result
`,

problems: [

// ======================================================================
// RECURSION
// ======================================================================
{
  id: "rec-semiperfect",
  topic: "Recursion",
  level: 3,
  title: "Semiperfect Numbers",
  source: "Practice Exam Generator — Q4: Almost a Perfect Question",
  prompt: [
    `A <b>proper divisor</b> of a positive integer <code>n</code> is an integer <code>d</code> less than <code>n</code> that evenly divides <code>n</code>.`,
    `A positive integer is <b>semiperfect</b> if it equals the sum of some (or all) of its proper divisors, each used at most once. For example, <code>24 = 2 + 4 + 6 + 12</code>, so 24 is semiperfect.`,
    `Write <code>semiperfect(n)</code>, which returns whether <code>n</code> is semiperfect. Do not use any built-in functions that solve subset-sum for you &mdash; write the recursion yourself.`
  ],
  examples: `>>> [k for k in range(1, 40) if semiperfect(k)]\n[6, 12, 18, 20, 24, 28, 30, 36]\n>>> semiperfect(7)   # 7 is prime; only proper divisor is 1\nFalse`,
  starter: `def semiperfect(n):
    """Return whether positive integer n is a sum of some
    or all of its proper divisors.

    >>> [k for k in range(1, 40) if semiperfect(k)]
    [6, 12, 18, 20, 24, 28, 30, 36]
    """
    # YOUR CODE HERE
`,
  hints: [
    `Think of it as a use-or-skip decision over candidate divisors <code>d = 1, 2, ..., n - 1</code>: for each <code>d</code>, either <code>d</code> divides <code>n</code> and you include it in the sum, or you move on to the next candidate.`,
    `Track the remaining target sum <code>s</code> (how much more you still need to reach) and the next candidate divisor <code>d</code> to consider. A helper function with two arguments works well here.`,
    `Base cases: if the remaining target <code>s</code> hits 0, you've found a valid sum. If the candidate <code>d</code> reaches <code>n</code> with <code>s</code> still positive, there's nothing left to try.`
  ],
  solution: `def semiperfect(n):
    def f(s, d):
        if s == 0:
            return True
        if d >= n:
            return False
        if n % d == 0 and f(s - d, d + 1):
            return True
        return f(s, d + 1)
    return f(n, 1)
`,
  tests: [
    { setup: ``, expr: `semiperfect(6)`, expected: `True` },
    { setup: ``, expr: `semiperfect(28)`, expected: `True` },
    { setup: ``, expr: `semiperfect(1)`, expected: `False` },
    { setup: ``, expr: `semiperfect(2)`, expected: `False` },
    { setup: ``, expr: `semiperfect(7)`, expected: `False` },
    { setup: ``, expr: `semiperfect(96)`, expected: `True` },
    { setup: ``, expr: `semiperfect(100)`, expected: `True` }
  ],
  idea: `Walk candidate divisors d = 1, 2, 3, ... in order. At each one, either it evenly divides n and you spend it (subtracting d from the remaining target and moving to d + 1), or you skip it (moving to d + 1 without spending it). You've succeeded once the remaining target hits 0, and failed once d reaches n with target still unmet (since no divisor can be n or larger).`,
  mistakes: [
    `Forgetting to check <code>n % d == 0</code> before "using" d &mdash; only actual divisors may be spent.`,
    `Using <code>d &gt; n</code> instead of <code>d &gt;= n</code> as the failure cutoff, which lets d = n sneak in even though a divisor must be strictly less than n.`,
    `Writing the base case as <code>d == n</code> instead of <code>d &gt;= n</code> &mdash; harmless for this problem but fragile if the search ever starts past n.`,
    `Checking <code>s == 0</code> only at the very end instead of as the first check in the helper, which misses valid sums that complete early.`
  ]
},

{
  id: "rec-close",
  topic: "Recursion",
  level: 3,
  title: "Closest Plus-Times Value",
  source: "Practice Exam Generator — Q5(c): Just Add and Multiply",
  prompt: [
    `A <b>plus-times-expression</b> for a list of numbers inserts either <code>+</code> or <code>*</code> between each adjacent pair of numbers. For example, <code>2*3+4+5</code> is one possible plus-times-expression for <code>[2, 3, 4, 5]</code>.`,
    `Write <code>close(s, x)</code>, which takes a list of numbers <code>s</code> and a number <code>x</code>. It returns the value of the plus-times-expression for <code>s</code> that is closest (in absolute value) to <code>x</code>.`,
    `<code>product(s)</code> is provided: it returns the result of multiplying together all the numbers in a non-empty list.`,
    `Hint: a slice that starts past the end of a list is empty &mdash; <code>[2, 3, 4][3:]</code> evaluates to <code>[]</code>.`
  ],
  examples: `>>> close([1, 2, 3, 4], 10)   # 1 + 2 + 3 + 4 = 10\n10\n>>> close([1, 2, 3, 4], 20)   # 1 * 2 * 3 * 4 = 24 (4 away from 20)\n24\n>>> close([1, 2, 3, 4], 30)   # 1 + 2 * 3 * 4 = 25 (5 away from 30)\n25\n>>> close([3, 7, 5, 4, 2, 6], 66)   # 3 * 7 + 5 * 4 * 2 + 6 = 67 (1 away from 66)\n67`,
  provided: `def product(s):
    """Return the result of multiplying together the elements of a non-empty list of numbers s."""
    if len(s) == 1:
        return s[0]
    return s[0] * product(s[1:])
`,
  starter: `def close(s, x):
    """Return the value of a plus-times-expression for s that is closest to x.

    >>> close([1, 2, 3, 4], 10)
    10
    >>> close([1, 2, 3, 4], 20)
    24
    """
    # YOUR CODE HERE
`,
  hints: [
    `Every plus-times-expression is a sequence of "multiplicative groups" joined by <code>+</code>. Pick how long the <i>first</i> group is (it could be the whole list), then recursively handle the rest the same way.`,
    `If the first group is <code>s[:i]</code>, its value is <code>product(s[:i])</code>. Whatever the best value for the remaining expression on <code>s[i:]</code> is, add it on.`,
    `For the recursive sub-problem on <code>s[i:]</code>, the target to aim for is no longer <code>x</code> &mdash; it's <code>x</code> minus however much the first group already contributed.`,
    `Base case: an empty list has no plus-times-expression to build, so its value contributes 0. Among all choices of group length <code>i</code> from 1 to <code>len(s)</code>, use <code>min</code> with a <code>key</code> to pick the one closest to <code>x</code>.`
  ],
  solution: `def close(s, x):
    if not s:
        return 0
    choices = [product(s[:i]) + close(s[i:], x - product(s[:i]))
               for i in range(1, len(s) + 1)]
    return min(choices, key=lambda v: abs(v - x))
`,
  tests: [
    { setup: ``, expr: `close([1, 2, 3, 4], 10)`, expected: `10` },
    { setup: ``, expr: `close([1, 2, 3, 4], 20)`, expected: `24` },
    { setup: ``, expr: `close([1, 2, 3, 4], 30)`, expected: `25` },
    { setup: ``, expr: `close([3, 7, 5, 4, 2, 6], 66)`, expected: `67` },
    { setup: ``, expr: `close([5], 100)`, expected: `5` },
    { setup: ``, expr: `close([1, 1], 3)`, expected: `2` },
    { setup: ``, expr: `close([2, 3], 100)`, expected: `6` }
  ],
  idea: `For each possible length i of the first multiplicative group, the expression's value is product(s[:i]) plus whatever the rest of the expression (built from s[i:]) contributes. Recursively find the best value for s[i:] aiming at the adjusted target x - product(s[:i]), try every i, and keep whichever total is closest to x.`,
  mistakes: [
    `Forgetting the base case for an empty list, causing <code>product([])</code> to be called (which is undefined for this <code>product</code>).`,
    `Passing <code>x</code> unchanged into the recursive call instead of subtracting off <code>product(s[:i])</code>, so the sub-problem aims at the wrong target.`,
    `Using <code>min(choices)</code> instead of <code>min(choices, key=lambda v: abs(v - x))</code>, which picks the smallest value instead of the closest one.`,
    `Only trying <code>i = 1</code> (single-element groups), which misses expressions where a run of numbers is multiplied together before the next <code>+</code>.`
  ]
},

{
  id: "rec-subsettarget",
  topic: "Recursion",
  level: 3,
  title: "Target Sum (Index Recursion)",
  source: "Practice Exam Generator — Q5: Aim for 100",
  prompt: [
    `Write <code>count_subsets(s, target)</code>, which takes a list of positive integers <code>s</code> and an integer <code>target</code>. It returns the number of ways to choose a subset of <b>positions</b> in <code>s</code> (in order) whose values sum to <code>target</code>.`,
    `<b>Important:</b> implement this using a helper that tracks a running sum and a current index into <code>s</code> &mdash; do not use list slicing like <code>s[1:]</code>. Tracking an index instead of slicing avoids rebuilding a shorter list on every call, which matters once <code>s</code> gets long.`
  ],
  examples: `>>> count_subsets([25, 50, 75, 100, 125, 150], 100)   # [25, 75], [100]\n2\n>>> count_subsets([25, 50, 25, 75], 100)   # [25, 75] (first 25), [25, 75] (second 25), [25, 50, 25]\n3`,
  starter: `def count_subsets(s, target):
    """Return the number of subsets of s (by position) that sum to target.

    >>> count_subsets([25, 50, 75, 100, 125, 150], 100)
    2
    >>> count_subsets([25, 50, 25, 75], 100)
    3
    """
    # YOUR CODE HERE
`,
  hints: [
    `Write a nested <code>helper(sum_so_far, index)</code> that decides, for each position starting at <code>index</code>, whether to include <code>s[index]</code> in the running sum or skip it.`,
    `Base case: once <code>index == len(s)</code>, you've made a decision for every element. Check whether <code>sum_so_far</code> landed exactly on <code>target</code>.`,
    `At each index before the end, the total count is the count from including <code>s[index]</code> (advance index, add its value to the sum) plus the count from skipping it (advance index, sum unchanged).`
  ],
  solution: `def count_subsets(s, target):
    def helper(sum_so_far, index):
        if index == len(s):
            return 1 if sum_so_far == target else 0
        return helper(sum_so_far + s[index], index + 1) + helper(sum_so_far, index + 1)
    return helper(0, 0)
`,
  tests: [
    { setup: ``, expr: `count_subsets([25, 50, 75, 100, 125, 150], 100)`, expected: `2` },
    { setup: ``, expr: `count_subsets([25, 50, 25, 75], 100)`, expected: `3` },
    { setup: ``, expr: `count_subsets([], 0)`, expected: `1` },
    { setup: ``, expr: `count_subsets([5], 5)`, expected: `1` },
    { setup: ``, expr: `count_subsets([5], 3)`, expected: `0` },
    { setup: ``, expr: `count_subsets([1, 2, 3], 0)`, expected: `1` },
    { setup: ``, expr: `count_subsets([4, 4, 4], 8)`, expected: `3` }
  ],
  idea: `Process s one index at a time. At each index, branch into two recursive calls: one that includes s[index] in the running sum, one that doesn't, both moving to index + 1. Once index reaches len(s), every element has been decided, so check whether the accumulated sum matches target.`,
  mistakes: [
    `Checking <code>sum_so_far == target</code> as soon as it happens, instead of waiting until <code>index == len(s)</code> &mdash; this stops early and misses subsets that need a few more (even zero-valued) decisions to finish.`,
    `Comparing <code>index == len(s)</code> and <code>sum_so_far == target</code> in the wrong order, or forgetting one of the two recursive branches (include/skip), which undercounts.`,
    `Using <code>s[1:]</code> slicing instead of an index &mdash; this still produces a correct answer but defeats the point of the exercise (and is slower on long lists).`
  ]
},

// ======================================================================
// TREE RECURSION
// ======================================================================
{
  id: "tr-countpark",
  topic: "Tree Recursion",
  level: 2,
  title: "Parking Spots",
  source: "Practice Exam Generator — Q5: Parking",
  prompt: [
    `When parking vehicles in a row, a <b>motorcycle</b> takes up 1 parking spot and a <b>car</b> takes up 2 adjacent parking spots. A row of <code>n</code> spots can be represented as a string of length <code>n</code> using <code>%</code> for a motorcycle, <code>&lt;&gt;</code> for a car, and <code>.</code> for an empty spot. For example <code>'.%%.&lt;&gt;&lt;&gt;'</code> is one empty spot, two motorcycles, another empty spot, then two cars.`,
    `Write <code>count_park(n)</code>, which returns the number of ways to park vehicles in <code>n</code> adjacent spots (some or all spots may be empty).`
  ],
  examples: `>>> count_park(1)   # '.' or '%'\n2\n>>> count_park(2)   # '..', '.%', '%.', '%%', or '<>'\n5\n>>> count_park(4)\n29`,
  starter: `def count_park(n):
    """Count the ways to park cars and motorcycles in n adjacent spots.

    >>> count_park(1)
    2
    >>> count_park(2)
    5
    >>> count_park(4)
    29
    """
    # YOUR CODE HERE
`,
  hints: [
    `Think about what occupies the <i>first</i> spot: it's empty, it's a motorcycle, or it's the front of a car (which also uses the second spot).`,
    `If the first spot is empty or a motorcycle, the rest of the row (n - 1 spots) can be filled any way at all. If it's the front of a car, the rest of the row (n - 2 spots) can be filled any way at all.`,
    `You need a base case for n == 0 (one way: nothing to park) and for negative n (no way to fit a car that overshoots the row).`
  ],
  solution: `def count_park(n):
    if n < 0:
        return 0
    if n == 0:
        return 1
    return 2 * count_park(n - 1) + count_park(n - 2)
`,
  tests: [
    { setup: ``, expr: `count_park(0)`, expected: `1` },
    { setup: ``, expr: `count_park(1)`, expected: `2` },
    { setup: ``, expr: `count_park(2)`, expected: `5` },
    { setup: ``, expr: `count_park(3)`, expected: `12` },
    { setup: ``, expr: `count_park(4)`, expected: `29` },
    { setup: ``, expr: `count_park(5)`, expected: `70` }
  ],
  idea: `The first spot is either empty, a motorcycle, or the start of a car. The first two cases each leave count_park(n - 1) ways to fill the rest; the car case leaves count_park(n - 2) ways. Add them up: 2 * count_park(n - 1) + count_park(n - 2), with count_park(0) = 1 and negative n contributing 0.`,
  mistakes: [
    `Forgetting the <code>n &lt; 0</code> base case, which makes <code>count_park(n - 2)</code> recurse forever for small n.`,
    `Writing <code>count_park(n - 1) + count_park(n - 2)</code> without the factor of 2, which undercounts since empty and motorcycle are two different options for the first spot.`,
    `Using <code>count_park(0) = 0</code> instead of 1 &mdash; there is exactly one way to park vehicles in zero spots (do nothing).`
  ]
},

{
  id: "tr-fit",
  topic: "Tree Recursion",
  level: 3,
  title: "Sum of Perfect Squares",
  source: "Practice Exam Generator — Q4: A Perfect Question",
  prompt: [
    `A <b>perfect square</b> is <code>k * k</code> for some integer <code>k</code>.`,
    `Write <code>fit(total, n)</code>, which takes positive integers <code>total</code> and <code>n</code>. It returns whether there are <code>n</code> positive perfect squares (not necessarily distinct &mdash; the same square may be reused) that sum to <code>total</code>.`
  ],
  examples: `>>> [fit(4, 1), fit(4, 2), fit(4, 3), fit(4, 4)]   # 1*(2*2); impossible; impossible; 4*(1*1)\n[True, False, False, True]\n>>> [fit(12, n) for n in range(3, 8)]\n[True, True, False, True, False]\n>>> [fit(32, 2), fit(32, 3), fit(32, 4), fit(32, 5)]\n[True, False, False, True]`,
  starter: `def fit(total, n):
    """Return whether there are n positive perfect squares that sum to total.

    >>> [fit(4, 1), fit(4, 2), fit(4, 3), fit(4, 4)]
    [True, False, False, True]
    """
    # YOUR CODE HERE
`,
  hints: [
    `Use a helper that also tracks the smallest base <code>k</code> still allowed, so you never reconsider a smaller square once you've moved past it &mdash; this lets squares repeat without double-counting the same combination.`,
    `At each step, either use the square <code>k * k</code> again (subtract it from the remaining total, use up one of the n squares, keep <code>k</code> the same) or move on to try <code>k + 1</code> instead (total and count unchanged).`,
    `You need two failure conditions: running out of squares to place (<code>n == 0</code>) while total isn't 0 yet, and the smallest allowed square already exceeding what's left (<code>k * k &gt; total</code>), which would make the search run forever otherwise.`
  ],
  solution: `def fit(total, n):
    def f(total, n, k):
        if total == 0 and n == 0:
            return True
        elif n == 0 or k * k > total:
            return False
        else:
            return f(total - k * k, n - 1, k) or f(total, n, k + 1)
    return f(total, n, 1)
`,
  tests: [
    { setup: ``, expr: `fit(4, 1)`, expected: `True` },
    { setup: ``, expr: `fit(4, 2)`, expected: `False` },
    { setup: ``, expr: `fit(4, 3)`, expected: `False` },
    { setup: ``, expr: `fit(4, 4)`, expected: `True` },
    { setup: ``, expr: `fit(1, 1)`, expected: `True` },
    { setup: ``, expr: `fit(2, 1)`, expected: `False` },
    { setup: ``, expr: `fit(9, 1)`, expected: `True` },
    { setup: ``, expr: `fit(50, 2)`, expected: `True` }
  ],
  idea: `Search over squares k*k in increasing order of k, allowing each to be reused. At each k, branch: use k again (total -= k*k, n -= 1, k stays) or move past it (k += 1). Succeed when total and n both hit 0 together; fail if you run out of squares to place or the smallest remaining square is already too big.`,
  mistakes: [
    `Missing the <code>k * k &gt; total</code> cutoff, which causes <code>k</code> to climb forever once the remaining total can't fit even the smallest allowed square.`,
    `Checking <code>n == 0</code> without also checking <code>total == 0</code> in the success case, which would accept using zero squares to "reach" a nonzero total.`,
    `Always moving to <code>k + 1</code> after using a square instead of keeping k the same, which prevents reusing the same square twice (e.g. 1*1 + 1*1 + 1*1 + 1*1 for total=4, n=4).`,
    `Forgetting that squares may repeat, and instead treating this like a search over distinct squares only.`
  ]
},

{
  id: "tr-ways",
  topic: "Tree Recursion",
  level: 4,
  title: "Plus-Times Expressions With a Cap",
  source: "Practice Exam Generator — Q5(b): Just Add and Multiply",
  prompt: [
    `Recall: a <b>plus-times-expression</b> for a list of <code>n</code> numbers inserts either <code>+</code> or <code>*</code> between each adjacent pair.`,
    `Write <code>ways(k, n)</code>, which takes positive integers <code>k</code> and <code>n</code>. It returns the number of possible plus-times-expressions for a list of length <code>n</code> that have <b>at most <code>k</code> <code>*</code>-symbols in a row</b>.`,
    `For example, with a list of 16 numbers, the expression <code>2+3*4*5*6+7*8*9+10+11*12*13*14+15*16</code> has a run of 3 in a row (<code>3*4*5*6</code>), then 2 in a row (<code>7*8*9</code>), then 3 in a row (<code>11*12*13*14</code>), then 1 in a row (<code>15*16</code>).`
  ],
  examples: `>>> ways(1, 4)   # For [a,b,c,d]: a+b+c+d, a+b+c*d, a+b*c+d, a*b+c+d, a*b*c+d is NOT allowed (2 in a row)\n5\n>>> ways(2, 4)   # Also allows a+b*c*d and a*b*c+d\n7\n>>> ways(2, 5)\n13`,
  starter: `def ways(k, n):
    """Return the number of plus-times-expressions with at most k consecutive *'s for n numbers.

    >>> ways(1, 4)
    5
    >>> ways(2, 4)
    7
    >>> ways(2, 5)
    13
    """
    # YOUR CODE HERE
`,
  hints: [
    `Use a helper that tracks how many more <code>*</code>-symbols you're still allowed to place <i>in a row right now</i> (a "budget" that starts at <code>k</code>).`,
    `Decide the operator right before the next number, one number at a time. Placing <code>+</code> is always legal and resets the budget back to <code>k</code>. Placing <code>*</code> is only legal if the budget is still positive, and it uses up one unit of budget.`,
    `Base case: with only 1 number left to place, there's no operator left to decide (exactly 1 way), regardless of the current budget.`
  ],
  solution: `def ways(k, n):
    def f(left, n):
        if n == 1:
            return 1
        result = f(k, n - 1)
        if left:
            result += f(left - 1, n - 1)
        return result
    return f(k, n)
`,
  tests: [
    { setup: ``, expr: `ways(1, 4)`, expected: `5` },
    { setup: ``, expr: `ways(2, 4)`, expected: `7` },
    { setup: ``, expr: `ways(2, 5)`, expected: `13` },
    { setup: ``, expr: `ways(3, 1)`, expected: `1` },
    { setup: ``, expr: `ways(1, 1)`, expected: `1` },
    { setup: ``, expr: `ways(3, 4)`, expected: `8` },
    { setup: ``, expr: `ways(1, 5)`, expected: `8` }
  ],
  idea: `Think of building the expression number by number. A budget tracks how many more *'s in a row are still allowed. Placing + is always fine and resets the budget to k; placing * is only fine while the budget is positive, and spends one unit. With 1 number left there's nothing left to decide, so that's the base case.`,
  mistakes: [
    `Resetting the budget to some fixed amount other than <code>k</code> after a <code>+</code> (e.g. always to 0), which would wrongly forbid any <code>*</code> right after a <code>+</code>.`,
    `Letting the <code>*</code> branch run even when the budget is 0, which allows runs longer than k.`,
    `Using <code>n == 0</code> as the base case instead of <code>n == 1</code> &mdash; there's one fewer operator than numbers, so the recursion should stop with exactly one number left, not zero.`,
    `Forgetting to add the <code>*</code> branch's count to the <code>+</code> branch's count (overwriting instead of accumulating), which undercounts.`
  ]
},

// ======================================================================
// LISTS & DICTS
// ======================================================================
{
  id: "ld-exclude",
  topic: "Lists & Dicts",
  level: 1,
  title: "Exclude a Value",
  source: "Practice Exam Generator — Q4(a): Exclusive",
  prompt: [
    `Write <code>exclude(s, x)</code>, which takes a list of numbers <code>s</code> and a number <code>x</code>. It returns a new list with all the elements of <code>s</code> that are not equal to <code>x</code>. The input list must not be modified. <code>s</code> could be empty.`,
    `Write the body as a single <code>return</code> statement using a list comprehension.`
  ],
  examples: `>>> a = [3, 4, 5, 3.0, 6, 5, 3]\n>>> exclude(a, 3)\n[4, 5, 6, 5]\n>>> a   # no change to a\n[3, 4, 5, 3.0, 6, 5, 3]`,
  starter: `def exclude(s, x):
    """Return a list with all of the elements of s except those equal to x.

    >>> a = [3, 4, 5, 3.0, 6, 5, 3]
    >>> exclude(a, 3)
    [4, 5, 6, 5]
    >>> a
    [3, 4, 5, 3.0, 6, 5, 3]
    """
    # YOUR CODE HERE
`,
  hints: [
    `A list comprehension with an <code>if</code> clause filters elements: <code>[y for y in s if ...]</code>.`,
    `Keep <code>y</code> only when it is not equal to <code>x</code>.`
  ],
  solution: `def exclude(s, x):
    return [y for y in s if y != x]
`,
  tests: [
    { setup: ``, expr: `exclude([3, 4, 5, 3.0, 6, 5, 3], 3)`, expected: `[4, 5, 6, 5]` },
    { setup: ``, expr: `exclude([], 5)`, expected: `[]` },
    { setup: ``, expr: `exclude([1, 2, 3], 5)`, expected: `[1, 2, 3]` },
    { setup: ``, expr: `exclude([2, 2, 2], 2)`, expected: `[]` },
    { setup: `a = [3, 4, 5, 3.0, 6, 5, 3]\nexclude(a, 3)`, expr: `a`, expected: `[3, 4, 5, 3.0, 6, 5, 3]` }
  ],
  idea: `A list comprehension naturally builds a new list without touching the original, so filtering with [y for y in s if y != x] both solves the problem and keeps s unmodified for free.`,
  mistakes: [
    `Using <code>s.remove(x)</code> or similar in-place methods, which mutates the input list (and only removes one occurrence).`,
    `Comparing with <code>is not</code> instead of <code>!=</code>, which can behave unexpectedly for equal-but-distinct numbers like <code>3</code> and <code>3.0</code>.`,
    `Writing a multi-line loop with <code>append</code> instead of the requested one-line comprehension (works, but doesn't satisfy the problem as asked).`
  ]
},

{
  id: "ld-prefix",
  topic: "Lists & Dicts",
  level: 1,
  title: "Prefix Sums",
  source: "Practice Exam Generator — Q3(a): Prefixes",
  prompt: [
    `A <b>prefix sum</b> of a sequence of numbers is the sum of its first <code>n</code> elements, for some positive length <code>n</code>.`,
    `Write <code>prefix(s)</code>, which takes a list of numbers <code>s</code> and returns a list of all the prefix sums of <code>s</code>, in increasing order of prefix length.`
  ],
  examples: `>>> prefix([1, 2, 3, 0, 4, 5])\n[1, 3, 6, 6, 10, 15]\n>>> prefix([2, 2, 2, 0, -5, 5])\n[2, 4, 6, 6, 1, 6]`,
  starter: `def prefix(s):
    """Return a list of all prefix sums of list s.

    >>> prefix([1, 2, 3, 0, 4, 5])
    [1, 3, 6, 6, 10, 15]
    """
    # YOUR CODE HERE
`,
  hints: [
    `<code>s[:i]</code> is the first <code>i</code> elements of <code>s</code>.`,
    `Build the result with a comprehension over <code>i in range(1, len(s) + 1)</code>, summing <code>s[:i]</code> at each step.`
  ],
  solution: `def prefix(s):
    return [sum(s[:i]) for i in range(1, len(s) + 1)]
`,
  tests: [
    { setup: ``, expr: `prefix([1, 2, 3, 0, 4, 5])`, expected: `[1, 3, 6, 6, 10, 15]` },
    { setup: ``, expr: `prefix([2, 2, 2, 0, -5, 5])`, expected: `[2, 4, 6, 6, 1, 6]` },
    { setup: ``, expr: `prefix([])`, expected: `[]` },
    { setup: ``, expr: `prefix([7])`, expected: `[7]` },
    { setup: ``, expr: `prefix([1, -1, 1, -1])`, expected: `[1, 0, 1, 0]` }
  ],
  idea: `The i-th prefix sum (1-indexed) is sum(s[:i]). Looping i over range(1, len(s) + 1) and summing s[:i] each time directly builds the whole list, and range(1, 1) is already empty for s = [], so no special case is needed.`,
  mistakes: [
    `Slicing <code>s[:i]</code> starting the range at 0 (<code>range(len(s))</code>), which leaves out the last element and/or miscounts the first prefix.`,
    `Computing the running total with a loop but forgetting to reset or correctly carry it across iterations.`,
    `Adding a special-case check for an empty list, which is unnecessary since the comprehension already produces <code>[]</code> on its own.`
  ]
},

{
  id: "ld-isstrip",
  topic: "Lists & Dicts",
  level: 1,
  title: "Is It a Strip?",
  source: "Practice Exam Generator — Q4(a): Who's Counting?",
  prompt: [
    `A <b>strip</b> is a list of integers in which each integer is exactly one more than the last. For example, <code>[3, 4, 5, 6]</code> is a strip. The empty list and any one-element list are strips.`,
    `Write <code>is_strip(s)</code>, which takes a list of integers <code>s</code> and returns whether it is a strip.`
  ],
  examples: `>>> is_strip([3, 4, 5, 6])\nTrue\n>>> is_strip([3, 3, 3])      # 3 after 3\nFalse\n>>> is_strip([3, 4, 5, 4, 6])  # 4 after 5\nFalse\n>>> is_strip([5])\nTrue\n>>> is_strip([])\nTrue`,
  starter: `def is_strip(s):
    """Return whether list s is a strip.

    >>> is_strip([3, 4, 5, 6])
    True
    >>> is_strip([3, 3, 3])
    False
    >>> is_strip([5])
    True
    >>> is_strip([])
    True
    """
    # YOUR CODE HERE
`,
  hints: [
    `Handle the empty and one-element cases first &mdash; both are automatically strips, regardless of what's in them.`,
    `For a longer list, compare it against the one obvious strip that starts at the same place: <code>list(range(s[0], s[0] + len(s)))</code>.`
  ],
  solution: `def is_strip(s):
    return len(s) <= 1 or s == list(range(s[0], s[0] + len(s)))
`,
  tests: [
    { setup: ``, expr: `is_strip([3, 4, 5, 6])`, expected: `True` },
    { setup: ``, expr: `is_strip([3, 3, 3])`, expected: `False` },
    { setup: ``, expr: `is_strip([3, 4, 5, 4, 6])`, expected: `False` },
    { setup: ``, expr: `is_strip([3, 4, 5, 5, 6])`, expected: `False` },
    { setup: ``, expr: `is_strip([3, 4, 5, 6, 8])`, expected: `False` },
    { setup: ``, expr: `is_strip([5])`, expected: `True` },
    { setup: ``, expr: `is_strip([])`, expected: `True` },
    { setup: ``, expr: `is_strip([-2, -1, 0])`, expected: `True` }
  ],
  idea: `A list of length >= 2 starting at s[0] is a strip exactly when it equals the list of len(s) consecutive integers starting at s[0] &mdash; i.e. list(range(s[0], s[0] + len(s))). Lists of length 0 or 1 are strips automatically.`,
  mistakes: [
    `Reading <code>s[0]</code> before checking that <code>s</code> is non-empty, which raises an <code>IndexError</code> on <code>[]</code>.`,
    `Comparing adjacent pairs with a loop but forgetting an edge case (e.g. only checking <code>len(s) - 1</code> pairs starting from the wrong index).`,
    `Forgetting that negative numbers are valid strip elements too (a strip doesn't have to start at a positive number).`
  ]
},

{
  id: "ld-symmetrical",
  topic: "Lists & Dicts",
  level: 2,
  title: "Symmetrical Dictionary",
  source: "Practice Exam Generator — Q6(a): Two Topping Pizzas",
  prompt: [
    `Write <code>symmetrical(d)</code>, which takes a dictionary <code>d</code> and returns <code>True</code> if for every pair <code>(k, v)</code> for which <code>d[k] == v</code>, it's also true that <code>d[v] == k</code>, and <code>False</code> otherwise. Assume <code>None</code> is never a key or value in <code>d</code>.`,
    `The <code>get</code> method of a <code>dict</code> takes a key and returns the value for that key if it's present, and <code>None</code> otherwise &mdash; useful here since <code>v</code> might not be a key in <code>d</code> at all.`
  ],
  examples: `>>> symmetrical({'M': 'P', 'P': 'M', 'G': 'G'})\nTrue\n>>> symmetrical({'M': 'P', 'P': 'M', 'G': 'M'})   # No M->G\nFalse\n>>> symmetrical({'M': 'P', 'P': 'M', 'G': 'T'})   # No T->G\nFalse`,
  starter: `def symmetrical(d):
    """Return whether every key-value pair in d is also a value-key pair.

    >>> symmetrical({'M': 'P', 'P': 'M', 'G': 'G'})
    True
    >>> symmetrical({'M': 'P', 'P': 'M', 'G': 'M'})
    False
    """
    # YOUR CODE HERE
`,
  hints: [
    `You need to check a condition for every <code>(k, v)</code> pair in <code>d</code>; <code>all(... for k, v in d.items())</code> or <code>all(... for k in d)</code> are both reasonable starting points.`,
    `For a given pair, the condition to check is whether looking up <code>v</code> in <code>d</code> gives back <code>k</code>. Use <code>d.get(v)</code> rather than <code>d[v]</code>, since <code>v</code> might not be a key at all.`
  ],
  solution: `def symmetrical(d):
    return all(d.get(v) == k for k, v in d.items())
`,
  tests: [
    { setup: ``, expr: `symmetrical({'M': 'P', 'P': 'M', 'G': 'G'})`, expected: `True` },
    { setup: ``, expr: `symmetrical({'M': 'P', 'P': 'M', 'G': 'M'})`, expected: `False` },
    { setup: ``, expr: `symmetrical({'M': 'P', 'P': 'M', 'G': 'T'})`, expected: `False` },
    { setup: ``, expr: `symmetrical({})`, expected: `True` },
    { setup: ``, expr: `symmetrical({'a': 'a'})`, expected: `True` },
    { setup: ``, expr: `symmetrical({'a': 'b'})`, expected: `False` },
    { setup: ``, expr: `symmetrical({'a': 'b', 'b': 'a', 'c': 'd', 'd': 'e'})`, expected: `False` }
  ],
  idea: `For every (k, v) pair in d, d.get(v) must equal k. Using .get instead of indexing with [] avoids a KeyError when v happens not to be a key in d at all (which should simply fail the check, not crash).`,
  mistakes: [
    `Using <code>d[v]</code> instead of <code>d.get(v)</code>, which raises a <code>KeyError</code> whenever <code>v</code> isn't itself a key.`,
    `Checking <code>d[k].get(v)</code> or some other confused combination instead of comparing <code>d.get(v)</code> directly to <code>k</code>.`,
    `Iterating only over <code>d.keys()</code> and checking something about keys alone, without actually looking at where each key's value points back to.`
  ]
},

{
  id: "ld-acceptable",
  topic: "Lists & Dicts",
  level: 3,
  title: "Acceptable Pizza",
  source: "Practice Exam Generator — Q6(b): Two Topping Pizzas",
  prompt: [
    `Kay and John want to share a pizza. Kay likes mushroom and John likes pineapple, but they won't eat a pizza that has a mushroom slice next to a pineapple slice. A pizza with <code>n</code> slices is a length-<code>n</code> string using <code>M</code> for mushroom, <code>P</code> for pineapple, and <code>_</code> for no topping. Slices are <b>next to</b> each other if they're adjacent in the string <b>or</b> are the first and last slice (the pizza is circular).`,
    `Write <code>acceptable(pizza, disallow)</code>, which takes a non-empty string <code>pizza</code> and a symmetrical dictionary of strings <code>disallow</code> (see the <code>symmetrical</code> problem in this bank). It returns whether no two adjacent slices of <code>pizza</code> form a key-value pair in <code>disallow</code>. You may assume <code>disallow</code> is symmetrical and that no key equals its own value.`
  ],
  examples: `>>> acceptable("MM_PPP__M")\nTrue\n>>> acceptable("MM__PPP")   # first slice M and last slice P are adjacent\nFalse\n>>> acceptable("MM__PPP_")\nTrue\n>>> acceptable("MM__MPPP_")\nFalse`,
  provided: `def symmetrical(d):
    """Return whether every key-value pair in d is also a value-key pair."""
    return all(d.get(v) == k for k, v in d.items())
`,
  starter: `def acceptable(pizza, disallow={'M': 'P', 'P': 'M'}):
    """Return whether no slice of pizza is next to a disallowed topping pair.

    >>> acceptable("MM_PPP__M")
    True
    >>> acceptable("MM__PPP")
    False
    >>> acceptable("MM__PPP_")
    True
    """
    # YOUR CODE HERE
`,
  hints: [
    `Walk through <code>pizza</code> once, keeping track of the previous slice you looked at. Compare each new slice against the previous one.`,
    `To handle the circular wraparound (first and last slice are adjacent) without writing special-case code for it, start your "previous slice" variable at <code>pizza[-1]</code> before the loop begins, then loop over every slice in <code>pizza</code> in order.`,
    `A pair <code>(previous, slice)</code> is disallowed exactly when <code>disallow.get(previous) == slice</code>.`
  ],
  solution: `def acceptable(pizza, disallow={'M': 'P', 'P': 'M'}):
    assert symmetrical(disallow)
    previous = pizza[-1]
    for slic in pizza:
        if disallow.get(previous) == slic:
            return False
        previous = slic
    return True
`,
  tests: [
    { setup: ``, expr: `acceptable("MM_PPP__M")`, expected: `True` },
    { setup: ``, expr: `acceptable("MM__PPP")`, expected: `False` },
    { setup: ``, expr: `acceptable("MM__PPP_")`, expected: `True` },
    { setup: ``, expr: `acceptable("MM__MPPP_")`, expected: `False` },
    { setup: ``, expr: `acceptable("_")`, expected: `True` },
    { setup: ``, expr: `acceptable("MM")`, expected: `True` },
    { setup: ``, expr: `acceptable("MP")`, expected: `False` },
    { setup: `d = {'x': 'y', 'y': 'x'}`, expr: `acceptable('x_y', d)`, expected: `False` }
  ],
  idea: `Starting "previous" at pizza[-1] before looping over pizza from the front makes the very first comparison check the wraparound pair (last slice, first slice) for free, and every subsequent iteration checks one more adjacent pair — covering exactly the n adjacent pairs in a circular arrangement of n slices, once each.`,
  mistakes: [
    `Only checking adjacent pairs within the string (<code>pizza[i]</code> vs <code>pizza[i+1]</code>) and forgetting the wraparound pair between the last and first slice.`,
    `Checking <code>disallow.get(previous) == slic</code> but not also implicitly checking the reverse order &mdash; this is actually fine as long as <code>disallow</code> is symmetrical (given), since the pair will be caught from the other direction on a later/earlier iteration.`,
    `Starting <code>previous</code> at <code>pizza[0]</code> instead of <code>pizza[-1]</code>, which misses the wraparound check entirely.`
  ]
},

{
  id: "ld-drip",
  topic: "Lists & Dicts",
  level: 4,
  title: "Merging Two Strips",
  source: "Practice Exam Generator — Q4(b): Who's Counting?",
  prompt: [
    `Recall a <b>strip</b> is a list of consecutive integers, e.g. <code>[3, 4, 5, 6]</code> (see the <code>is_strip</code> problem in this bank &mdash; it's provided below).`,
    `Write <code>drip(s, t)</code>, which takes two non-empty lists of integers <code>s</code> and <code>t</code>. It returns <code>True</code> if there is a strip containing all and only the elements of <code>s</code> and <code>t</code>, <b>starting with <code>s[0]</code></b>, in which the elements of <code>s</code> appear in order and the elements of <code>t</code> appear in order. It returns <code>False</code> otherwise.`
  ],
  examples: `>>> drip([1, 3, 5], [2, 4, 6])   # 1 2 3 4 5 6\nTrue\n>>> drip([1, 4, 5], [2, 3, 6])   # 1 2 3 4 5 6\nTrue\n>>> drip([2, 4, 5], [1, 3, 6])   # no strip starting with 2 can contain 1\nFalse\n>>> drip([1, 4, 5], [2, 3, 7])   # no strip can contain 5 and 7 but no 6\nFalse\n>>> drip([2], [3, 4, 5])         # 2 3 4 5\nTrue`,
  provided: `def is_strip(s):
    """Return whether list s is a strip (consecutive integers)."""
    return len(s) <= 1 or s == list(range(s[0], s[0] + len(s)))
`,
  starter: `def drip(s, t):
    """Return whether there is a strip made out of interleaving s and t.

    >>> drip([1, 3, 5], [2, 4, 6])
    True
    >>> drip([2, 4, 5], [1, 3, 6])
    False
    """
    # YOUR CODE HERE
`,
  hints: [
    `Process <code>s</code> and <code>t</code> from the front, deciding at each step whether the next number of the merged strip comes from <code>s</code> or from <code>t</code>. A <code>while s and t:</code> loop that pops from the front of one of them each iteration works well.`,
    `At each step, there are really only three possibilities: the next value is <code>t[0]</code> (when <code>s[0] + 1 == t[0]</code>), the next value is the next element of <code>s</code> itself (when <code>s</code> has at least 2 elements and <code>s[1] == s[0] + 1</code>), or neither holds and merging is impossible.`,
    `When the next value comes from <code>t</code>, think of <code>t</code>'s old front as the new reference point to keep comparing against, and drop <code>s</code>'s old front (it's been placed). When the next value continues within <code>s</code>, just drop <code>s</code>'s old front.`,
    `Once the loop ends (one list is empty), you still need to make sure whatever's left over in the other list is internally consecutive &mdash; that's exactly what <code>is_strip</code> checks.`
  ],
  solution: `def drip(s, t):
    while s and t:
        if s[0] + 1 == t[0]:
            s, t = t, s[1:]
        elif len(s) > 1 and s[1] == s[0] + 1:
            s = s[1:]
        else:
            return False
    return is_strip(s) and is_strip(t)
`,
  tests: [
    { setup: ``, expr: `drip([1, 3, 5], [2, 4, 6])`, expected: `True` },
    { setup: ``, expr: `drip([1, 4, 5], [2, 3, 6])`, expected: `True` },
    { setup: ``, expr: `drip([1, 2, 3], [4, 5, 6])`, expected: `True` },
    { setup: ``, expr: `drip([2, 4, 5], [1, 3, 6])`, expected: `False` },
    { setup: ``, expr: `drip([1, 2, 4, 5], [1, 3, 6])`, expected: `False` },
    { setup: ``, expr: `drip([1, 4, 5], [2, 3, 7])`, expected: `False` },
    { setup: ``, expr: `drip([1, 5, 4], [2, 3, 6])`, expected: `False` },
    { setup: ``, expr: `drip([2], [3, 4, 5])`, expected: `True` },
    { setup: ``, expr: `drip([1], [2, 3, 5])`, expected: `False` }
  ],
  idea: `At each step, s[0] is always the most recently confirmed value of the merged strip. Check whether the strip's next value (s[0] + 1) is t's front (switch references to t, drop s's used front) or s's own next element (just drop s's used front). If neither, the merge is broken. When the loop runs out of one list, whatever remains in the other must itself still be a strip, since its first element was already confirmed correct but the rest was never checked.`,
  mistakes: [
    `Forgetting the final <code>is_strip</code> check and just returning <code>True</code> once the loop ends &mdash; the leftover tail of the longer list was never verified to be internally consecutive.`,
    `Checking <code>s[1] == s[0] + 1</code> without first checking <code>len(s) &gt; 1</code>, which raises an <code>IndexError</code> when <code>s</code> has only one element left.`,
    `Swapping <code>s</code> and <code>t</code> incorrectly in the first branch (e.g. <code>s, t = t, s</code> without popping <code>s</code>'s used-up front), which loses track of which elements have already been placed.`,
    `Not realizing the loop must stop as soon as neither condition holds, instead of blindly advancing one of the lists anyway.`
  ]
},

// ======================================================================
// LINKED LISTS
// ======================================================================
{
  id: "ll-muladd",
  topic: "Linked Lists",
  level: 2,
  title: "Multiply, Add, Multiply, Add",
  source: "Practice Exam Generator — Q5(a): Just Add and Multiply",
  prompt: [
    `Recall a linked list is either <code>Link.empty</code> or a <code>Link</code> with a <code>first</code> element and a <code>rest</code> that is a linked list.`,
    `Write <code>muladd(s)</code>, which takes a non-empty linked list of numbers <code>s</code>. It returns the value of the plus-times-expression for <code>s</code> that starts with <code>*</code> and then alternates between <code>+</code> and <code>*</code>. If <code>s</code> has only one element, <code>muladd</code> returns that element.`
  ],
  examples: `>>> example = Link(9, Link(4, Link(7, Link(2, Link(0)))))   # <9 4 7 2 0>\n>>> muladd(example)   # 9 * 4 + 7 * 2 + 0, not 9 * (4 + 7 * (2 + 0))\n50\n>>> muladd(Link(2, example))   # 2 * 9 + 4 * 7 + 2 * 0\n46\n>>> muladd(Link(2))\n2`,
  starter: `def muladd(s):
    """Combine the numbers in linked list s by alternately multiplying and adding.

    >>> example = Link(9, Link(4, Link(7, Link(2, Link(0)))))
    >>> muladd(example)
    50
    >>> muladd(Link(2))
    2
    """
    # YOUR CODE HERE
`,
  hints: [
    `Two base cases: a linked list with just one element returns that element. What should an empty linked list contribute, if you ever recurse down to one?`,
    `The first pair of elements is always combined with <code>*</code>: that's <code>s.first * s.rest.first</code>. Everything after that pair starts over with the same alternating pattern (<code>* + * + ...</code>), just one pair later &mdash; and gets added on.`
  ],
  solution: `def muladd(s):
    if s is Link.empty:
        return 0
    elif s.rest is Link.empty:
        return s.first
    else:
        return s.first * s.rest.first + muladd(s.rest.rest)
`,
  tests: [
    { setup: `example = ll(9, 4, 7, 2, 0)`, expr: `muladd(example)`, expected: `50` },
    { setup: `example = ll(9, 4, 7, 2, 0)`, expr: `muladd(Link(2, example))`, expected: `46` },
    { setup: ``, expr: `muladd(ll(2))`, expected: `2` },
    { setup: ``, expr: `muladd(ll(5))`, expected: `5` },
    { setup: ``, expr: `muladd(ll(3, 4))`, expected: `12` },
    { setup: ``, expr: `muladd(ll(2, 3, 4, 5))`, expected: `26` },
    { setup: ``, expr: `muladd(ll(1, 0, 5))`, expected: `5` }
  ],
  idea: `The expression always starts by multiplying the first two elements together. Everything after that is itself a muladd-style expression (starting fresh with *), which gets added to the first product. A one-element list has no pair to multiply, so it's its own answer, and an empty list (reached only via recursion past the last pair) contributes 0.`,
  mistakes: [
    `Missing the <code>s.rest is Link.empty</code> base case, causing <code>s.rest.first</code> to be accessed on an empty rest.`,
    `Always adding instead of alternating &mdash; forgetting that the recursive call restarts the <code>*</code>, <code>+</code>, <code>*</code>, ... pattern from scratch rather than continuing it from wherever it left off.`,
    `Using <code>s.rest</code> instead of <code>s.rest.rest</code> in the recursive call, which re-multiplies an element that was already used.`
  ]
},

{
  id: "ll-longer",
  topic: "Linked Lists",
  level: 2,
  title: "The Longer List",
  source: "Practice Exam Generator — Q5(a): How Long is this Exam?",
  prompt: [
    `Write <code>longer(s, t)</code>, which takes two linked lists of numbers <code>s</code> and <code>t</code>. It returns the longer of the two. If they have the same length, it returns <code>s</code>.`
  ],
  examples: `>>> longer(Link(2, Link(3)), Link.empty)\nLink(2, Link(3))\n>>> longer(Link(2, Link(3)), Link(4, Link(5)))   # same length\nLink(2, Link(3))\n>>> longer(Link(2, Link(3)), Link(4, Link(5, Link(6, Link(7)))))\nLink(4, Link(5, Link(6, Link(7))))\n>>> longer(Link.empty, Link.empty) is Link.empty\nTrue`,
  starter: `def longer(s, t):
    """Return the longer linked list, s or t. (Same length? return s.)

    >>> longer(Link(2, Link(3)), Link.empty)
    Link(2, Link(3))
    """
    # YOUR CODE HERE
`,
  hints: [
    `Walk two pointers forward together, one through <code>s</code> and one through <code>t</code>, one step at a time.`,
    `Whichever pointer reaches <code>Link.empty</code> first belongs to the shorter list &mdash; so the <i>other</i> original list is the longer one.`,
    `If both pointers run out at the same time, the lists are the same length, and you should return <code>s</code>.`
  ],
  solution: `def longer(s, t):
    a, b = s, t
    while b is not Link.empty:
        if a is Link.empty:
            return t
        a, b = a.rest, b.rest
    return s
`,
  tests: [
    { setup: ``, expr: `longer(Link(2, Link(3)), Link.empty)`, expected: `ll(2, 3)` },
    { setup: ``, expr: `longer(Link(2, Link(3)), Link(4, Link(5)))`, expected: `ll(2, 3)` },
    { setup: ``, expr: `longer(Link(2, Link(3)), Link(4, Link(5, Link(6, Link(7)))))`, expected: `ll(4, 5, 6, 7)` },
    { setup: ``, expr: `longer(Link.empty, Link.empty) is Link.empty`, expected: `True` },
    { setup: ``, expr: `longer(ll(1), ll(1, 2))`, expected: `ll(1, 2)` },
    { setup: ``, expr: `longer(ll(1, 2), ll(9))`, expected: `ll(1, 2)` },
    { setup: ``, expr: `longer(Link.empty, ll(1))`, expected: `ll(1)` }
  ],
  idea: `Step two pointers forward in lockstep, one down s and one down t. The moment one pointer runs out while the other still has elements, you know which original list is longer. If both run out together, the lengths matched, so default to s.`,
  mistakes: [
    `Computing the length of each list separately (e.g. with a helper) and comparing numbers &mdash; works, but walks each list independently instead of in lockstep, and is easy to get the tie-breaking direction wrong.`,
    `Checking <code>a is Link.empty</code> and <code>b is Link.empty</code> in the wrong order, so the loop exits or returns on the wrong iteration.`,
    `Forgetting the tie case and defaulting to whichever pointer happened to still be non-empty, which can silently return the wrong one when lengths are equal.`
  ]
},

{
  id: "ll-excludelink",
  topic: "Linked Lists",
  level: 2,
  title: "Exclude From a Linked List",
  source: "Practice Exam Generator — Q4(b): Exclusive",
  prompt: [
    `Write <code>exclude_link(s, x)</code>, which takes a linked list of numbers <code>s</code> and a number <code>x</code>. It returns a linked list with all the elements of <code>s</code> that are not equal to <code>x</code>. The input linked list must not be modified. <code>s</code> could be <code>Link.empty</code>.`
  ],
  examples: `>>> a = Link(3, Link(4, Link(5, Link(3.0, Link(6, Link(5, Link(3)))))))\n>>> exclude_link(a, 3)\nLink(4, Link(5, Link(6, Link(5))))\n>>> a   # no change to a\nLink(3, Link(4, Link(5, Link(3.0, Link(6, Link(5, Link(3)))))))`,
  starter: `def exclude_link(s, x):
    """Return a linked list with all of the elements of linked list s except those equal to x.

    >>> a = Link(3, Link(4, Link(5, Link(3.0, Link(6, Link(5, Link(3)))))))
    >>> exclude_link(a, 3)
    Link(4, Link(5, Link(6, Link(5))))
    >>> a
    Link(3, Link(4, Link(5, Link(3.0, Link(6, Link(5, Link(3)))))))
    """
    # YOUR CODE HERE
`,
  hints: [
    `Base case: filtering <code>Link.empty</code> gives <code>Link.empty</code>.`,
    `Recurse on <code>s.rest</code> first to get the filtered remainder, then decide about <code>s.first</code>: if it equals <code>x</code>, the answer is just the filtered remainder; otherwise, attach <code>s.first</code> in front of it with a fresh <code>Link</code>.`
  ],
  solution: `def exclude_link(s, x):
    if s is Link.empty:
        return Link.empty
    rest = exclude_link(s.rest, x)
    if s.first == x:
        return rest
    return Link(s.first, rest)
`,
  tests: [
    { setup: `a = ll(3, 4, 5, 3.0, 6, 5, 3)`, expr: `exclude_link(a, 3)`, expected: `ll(4, 5, 6, 5)` },
    { setup: `a = ll(3, 4, 5, 3.0, 6, 5, 3)\nexclude_link(a, 3)`, expr: `a`, expected: `ll(3, 4, 5, 3.0, 6, 5, 3)` },
    { setup: ``, expr: `exclude_link(Link.empty, 5)`, expected: `Link.empty` },
    { setup: ``, expr: `exclude_link(ll(1, 2, 3), 5)`, expected: `ll(1, 2, 3)` },
    { setup: ``, expr: `exclude_link(ll(2, 2, 2), 2)`, expected: `Link.empty` }
  ],
  idea: `Building a brand-new Link for each kept element (rather than mutating s) automatically leaves the original list untouched. Recursing on s.rest first, then deciding whether to wrap s.first around the result, mirrors exactly how exclude works on plain lists.`,
  mistakes: [
    `Missing the <code>s is Link.empty</code> base case, causing <code>s.first</code> to be accessed on an empty linked list.`,
    `Mutating <code>s.rest</code> in place (e.g. via <code>s.rest = ...</code>) instead of constructing new <code>Link</code> nodes, which changes the original list.`,
    `Returning <code>Link(s.first, rest)</code> even when <code>s.first == x</code>, which keeps the value that was supposed to be removed.`,
    `Calling <code>exclude_link(s.rest, x)</code> but not using its return value in the final result.`
  ]
},

{
  id: "ll-after",
  topic: "Linked Lists",
  level: 3,
  title: "After Party",
  source: "Practice Exam Generator — Q6: After Party",
  prompt: [
    `Write <code>after(s, a, b)</code>, which takes a linked list <code>s</code> and two values <code>a</code> and <code>b</code>. It returns <code>True</code> if some occurrence of <code>b</code> comes later in the list than some occurrence of <code>a</code>, and <code>False</code> otherwise. If <code>a</code> and <code>b</code> are equal, the list must contain that value at least twice for the answer to be <code>True</code>.`
  ],
  examples: `>>> t = Link(3, Link(6, Link(5, Link(4))))\n>>> after(t, 6, 4)\nTrue\n>>> after(t, 4, 6)\nFalse\n>>> after(t, 6, 6)\nFalse`,
  starter: `def after(s, a, b):
    """Return whether there is a b somewhere after an a in linked list s.

    >>> t = Link(3, Link(6, Link(5, Link(4))))
    >>> after(t, 6, 4)
    True
    >>> after(t, 4, 6)
    False
    >>> after(t, 6, 6)
    False
    """
    # YOUR CODE HERE
`,
  hints: [
    `You can solve this with a single pass through the list (iteratively or recursively), remembering whether you've seen an <code>a</code> yet as you go.`,
    `At each element, check whether it's a <code>b</code> <i>and</i> you've already seen an <code>a</code> &mdash; in that order. Only after that check should you update whether you've now seen an <code>a</code> (so that <code>a == b</code> correctly requires two separate occurrences).`
  ],
  solution: `def after(s, a, b):
    seen_a = False
    while s is not Link.empty:
        if s.first == b and seen_a:
            return True
        if s.first == a:
            seen_a = True
        s = s.rest
    return False
`,
  tests: [
    { setup: `t = ll(3, 6, 5, 4)`, expr: `after(t, 6, 4)`, expected: `True` },
    { setup: `t = ll(3, 6, 5, 4)`, expr: `after(t, 4, 6)`, expected: `False` },
    { setup: `t = ll(3, 6, 5, 4)`, expr: `after(t, 6, 6)`, expected: `False` },
    { setup: `t = ll(1, 2, 1, 3)`, expr: `after(t, 1, 3)`, expected: `True` },
    { setup: `t = ll(1, 2, 1, 3)`, expr: `after(t, 3, 1)`, expected: `False` },
    { setup: `t = Link.empty`, expr: `after(t, 1, 2)`, expected: `False` },
    { setup: `t = ll(1, 1)`, expr: `after(t, 1, 1)`, expected: `True` }
  ],
  idea: `Walk the list once, remembering as a boolean whether an a has already been seen. The moment a b is found after seen_a has become True, the answer is True. Checking for b before updating seen_a (not the other way around) is what correctly forces two separate occurrences when a equals b.`,
  mistakes: [
    `Updating <code>seen_a</code> before checking for <code>b</code> on the same element, which lets a single occurrence satisfy <code>a == b</code> incorrectly.`,
    `Checking only whether <code>b</code> appears anywhere in the list, without requiring an <code>a</code> to come before it.`,
    `Forgetting to advance <code>s</code> inside the loop, causing it to run forever.`,
    `Returning <code>False</code> as soon as the current element isn't a match, instead of continuing to scan the rest of the list.`
  ]
},

{
  id: "ll-tens",
  topic: "Linked Lists",
  level: 3,
  title: "Prefix Sums Divisible by Ten",
  source: "Practice Exam Generator — Q3(b): Prefixes",
  prompt: [
    `Write <code>tens(s)</code>, which takes a non-empty linked list of numbers <code>s</code>. It returns a list of all the prefix sums of <code>s</code> that are multiples of ten, in increasing order of prefix length. (The original version of this problem asked you to <code>print</code> these values one per line; this version asks you to collect and return them instead, so the result can be checked automatically &mdash; same underlying computation either way.)`
  ],
  examples: `>>> tens(Link(3, Link(9, Link(8, Link(10, Link(0, Link(14, Link(6))))))))\n[20, 30, 30, 50]`,
  starter: `def tens(s):
    """Return a list of all prefix sums of linked list s that are multiples of ten.

    >>> tens(Link(3, Link(9, Link(8, Link(10, Link(0, Link(14, Link(6))))))))
    [20, 30, 30, 50]
    """
    # YOUR CODE HERE
`,
  hints: [
    `Write a helper that carries along the running prefix-sum total as it walks down the list, alongside the list of results collected so far.`,
    `At each node, first check whether the <i>current</i> running total is a multiple of ten (if so, record it), then move on to the next node by adding that node's value to the running total.`,
    `A natural way to start: the first prefix sum is just <code>s.first</code>, and the remaining nodes to walk are <code>s.rest</code>.`
  ],
  solution: `def tens(s):
    def f(suffix, total, result):
        if total % 10 == 0:
            result.append(total)
        if suffix is not Link.empty:
            f(suffix.rest, total + suffix.first, result)
        return result
    return f(s.rest, s.first, [])
`,
  tests: [
    { setup: `t = ll(3, 9, 8, 10, 0, 14, 6)`, expr: `tens(t)`, expected: `[20, 30, 30, 50]` },
    { setup: ``, expr: `tens(ll(10))`, expected: `[10]` },
    { setup: ``, expr: `tens(ll(5, 5))`, expected: `[10]` },
    { setup: ``, expr: `tens(ll(1, 2, 3))`, expected: `[]` },
    { setup: ``, expr: `tens(ll(10, 10, 10))`, expected: `[10, 20, 30]` }
  ],
  idea: `Walk the list while threading a running total forward. At each node, check the total accumulated so far (before adding the current node's value) against being a multiple of ten, then fold the current node's value into the total before moving to the next node.`,
  mistakes: [
    `Checking the running total <i>after</i> adding the next node's value instead of before, which shifts every reported prefix sum by one element.`,
    `Forgetting that <code>0</code> is a multiple of ten (<code>0 % 10 == 0</code>), and special-casing it out by accident.`,
    `Using <code>suffix is not Link.empty</code> incorrectly (e.g. checking <code>suffix.rest</code> instead), which skips the last element of the list.`,
    `Not threading the same <code>result</code> list through every recursive call, so appended values get lost between calls.`
  ]
},

// ======================================================================
// MUTATION
// ======================================================================
{
  id: "mut-change",
  topic: "Mutation",
  level: 4,
  title: "Doctor Change",
  source: "Practice Exam Generator — Q2: Doctor Change",
  prompt: [
    `Write <code>change(n, coins)</code>, a function that takes an integer <code>n</code> and a list of positive integers <code>coins</code>. It returns whether some subset of the values in <code>coins</code> sums to <code>n</code>.`,
    `Implement this using <b>mutation</b>: use <code>coins.pop()</code> to remove and consider one coin at a time, and use <code>coins.append(...)</code> to restore it afterward (backtracking) so that other recursive calls still see the coins they're supposed to see.`
  ],
  examples: `>>> change(10, [2, 7, 1, 8, 2])   # e.g., 2 + 8\nTrue\n>>> change(20, [2, 7, 1, 8, 2])   # e.g., 2 + 7 + 1 + 8 + 2\nTrue\n>>> change(6, [2, 7, 1, 8, 2])    # impossible; only two 2's in coins\nFalse`,
  starter: `def change(n, coins):
    """Return whether a subset of coins adds up to n.
    As a side effect, change may temporarily modify coins (but should
    leave it usable by the time it returns).

    >>> change(10, [2, 7, 1, 8, 2])
    True
    >>> change(6, [2, 7, 1, 8, 2])
    False
    """
    # YOUR CODE HERE
`,
  hints: [
    `Base cases: if <code>n == 0</code>, you're already done &mdash; the empty subset works. If <code>n != 0</code> but <code>coins</code> is empty, there's nothing left to try.`,
    `Otherwise, pop the last coin off with <code>coin = coins.pop()</code>. Try using it: recursively check <code>change(n - coin, coins)</code> on what remains.`,
    `Whatever that recursive call decides, you must put <code>coin</code> back with <code>coins.append(coin)</code> before your function returns, so that <code>coins</code> is in the right state for whichever branch you try next (or for the caller, once you return).`,
    `If using the coin didn't work, you still need to try <i>skipping</i> it: recursively check <code>change(n, coins)</code> &mdash; but only after the first recursive call has already cleaned up after itself, so that <code>coins</code> correctly reflects "everything except the coin we just set aside."`
  ],
  solution: `def change(n, coins):
    if n == 0:
        return True
    if not coins:
        return False
    coin = coins.pop()
    if change(n - coin, coins):
        coins.append(coin)
        return True
    result = change(n, coins)
    coins.append(coin)
    return result
`,
  tests: [
    { setup: ``, expr: `change(10, [2, 7, 1, 8, 2])`, expected: `True` },
    { setup: ``, expr: `change(20, [2, 7, 1, 8, 2])`, expected: `True` },
    { setup: ``, expr: `change(6, [2, 7, 1, 8, 2])`, expected: `False` },
    { setup: ``, expr: `change(0, [1, 2, 3])`, expected: `True` },
    { setup: ``, expr: `change(5, [])`, expected: `False` },
    { setup: ``, expr: `change(4, [4])`, expected: `True` },
    { setup: ``, expr: `change(4, [1, 1, 1, 1])`, expected: `True` },
    { setup: ``, expr: `change(100, [1, 2, 3])`, expected: `False` }
  ],
  idea: `Pop the last coin and try using it (subtract it from n, recurse on the shrunken list). Whether that succeeds or fails, append the coin back before moving on, so coins always reflects "everything not yet decided" for whichever branch runs next. Only after the used-coin branch has fully finished (and restored coins) do you try skipping the coin entirely.`,
  mistakes: [
    `Trying the "skip this coin" branch (<code>change(n, coins)</code>) <i>before</i> appending the coin back from the "use this coin" branch &mdash; this leaves <code>coins</code> in an inconsistent state and can cause infinite recursion or wrong answers.`,
    `Forgetting to append the coin back at all in one of the branches, which permanently loses a coin for every caller further up the recursion.`,
    `Writing <code>change(n - coin, coins) or change(n, coins)</code> as a single expression &mdash; tempting, but without restoring <code>coins</code> between the two calls, the second call doesn't see the coins it's supposed to.`,
    `Checking <code>not coins</code> before checking <code>n == 0</code>, which would incorrectly reject <code>change(0, [])</code>.`
  ]
},

// ======================================================================
// HIGHER-ORDER FUNCTIONS
// ======================================================================
{
  id: "hof-maxdiff",
  topic: "Higher-Order Functions",
  level: 2,
  title: "Max Difference",
  source: "Practice Exam Generator — Q(b)/(c): Max Diff",
  prompt: [
    `Write <code>max_diff(s, f)</code>, which takes a non-empty sequence <code>s</code> and a one-argument function <code>f</code>. It returns a pair of elements <code>(v, w)</code> from <code>s</code> for which <code>f(v) - f(w)</code> is largest. <code>v</code> and <code>w</code> may be the same or different elements of <code>s</code>.`,
    `Write an efficient solution: it should call <code>f</code> on each element of <code>s</code> only a small, bounded number of times (not once per pair).`
  ],
  examples: `>>> max_diff(range(-7, 4), lambda x: x * x)   # (-7*-7) - (0*0) = 49\n(-7, 0)\n>>> max_diff(['what', 'a', 'great', 'film'], len)   # len('great') - len('a')\n('great', 'a')`,
  starter: `def max_diff(s, f):
    """Return two elements (v, w) of s for which f(v) - f(w) is largest.

    >>> max_diff(range(-7, 4), lambda x: x * x)
    (-7, 0)
    >>> max_diff(['what', 'a', 'great', 'film'], len)
    ('great', 'a')
    """
    # YOUR CODE HERE
`,
  hints: [
    `<code>f(v) - f(w)</code> is largest exactly when <code>f(v)</code> is as large as possible <i>and</i> <code>f(w)</code> is as small as possible &mdash; these are two independent choices.`,
    `<code>max(s, key=f)</code> returns the element of <code>s</code> that maximizes <code>f</code>; there's a similar one-liner for minimizing.`
  ],
  solution: `def max_diff(s, f):
    assert s, 's cannot be empty'
    return max(s, key=f), min(s, key=f)
`,
  tests: [
    { setup: `s = range(-7, 4)`, expr: `max_diff(s, lambda x: x * x)`, expected: `(-7, 0)` },
    { setup: ``, expr: `max_diff(['what', 'a', 'great', 'film'], len)`, expected: `('great', 'a')` },
    { setup: ``, expr: `max_diff([5], lambda x: x)`, expected: `(5, 5)` },
    { setup: ``, expr: `max_diff([1, 2, 3, 4], lambda x: -x)`, expected: `(1, 4)` }
  ],
  idea: `Maximizing f(v) - f(w) splits cleanly into two separate questions: which element makes f biggest (that's v), and which makes f smallest (that's w). max(s, key=f) and min(s, key=f) answer each in one pass over s.`,
  mistakes: [
    `Writing a nested loop over all pairs <code>(x, y)</code> in <code>s</code>, which works but calls <code>f</code> far more often than necessary (quadratic instead of linear).`,
    `Computing <code>max([f(x) for x in s])</code> and similar, which returns the <i>value</i> of <code>f</code> rather than the element of <code>s</code> that produced it.`,
    `Forgetting the <code>key=</code> keyword and passing <code>f</code> positionally (or not at all), so <code>max</code>/<code>min</code> compare elements directly instead of by <code>f</code>.`
  ]
},

// ======================================================================
// ITERATORS & GENERATORS
// ======================================================================
{
  id: "gen-fibs",
  topic: "Iterators & Generators",
  level: 3,
  title: "Yield, Fibonacci!",
  source: "Practice Exam Generator — Q2: Yield, Fibonacci!",
  prompt: [
    `The Fibonacci numbers begin with 0 and then 1; each subsequent number is the sum of the previous two.`,
    `Write <code>fibs(f)</code>, a generator function that takes a one-argument pure function <code>f</code> and <code>yield</code>s all Fibonacci numbers <code>x</code>, in order, for which <code>f(x)</code> is a true value.`
  ],
  examples: `>>> odds = fibs(lambda x: x % 2 == 1)\n>>> [next(odds) for i in range(5)]\n[1, 1, 3, 5, 13]\n>>> bigs = fibs(lambda x: x > 20)\n>>> [next(bigs) for i in range(3)]\n[21, 34, 55]`,
  starter: `def fibs(f):
    """Yield all Fibonacci numbers x for which f(x) is a true value.

    >>> odds = fibs(lambda x: x % 2 == 1)
    >>> [next(odds) for i in range(5)]
    [1, 1, 3, 5, 13]
    """
    # YOUR CODE HERE
`,
  hints: [
    `You'll need an infinite loop (<code>while True:</code>) &mdash; the generator should be able to keep producing Fibonacci numbers forever, since the caller decides how many to pull via <code>next</code>.`,
    `Keep two variables for the current and next Fibonacci numbers, and update both together on each iteration (so neither update depends on an already-updated value).`,
    `Only <code>yield</code> the current number when <code>f</code> of it is true &mdash; otherwise just move on to the next Fibonacci number without yielding anything that round.`
  ],
  solution: `def fibs(f):
    n, m = 0, 1
    while True:
        if f(n):
            yield n
        n, m = m, n + m
`,
  tests: [
    { setup: `g = fibs(lambda x: x % 2 == 1)`, expr: `[next(g) for i in range(10)]`, expected: `[1, 1, 3, 5, 13, 21, 55, 89, 233, 377]` },
    { setup: `g = fibs(lambda x: x % 2 == 0)`, expr: `[next(g) for i in range(10)]`, expected: `[0, 2, 8, 34, 144, 610, 2584, 10946, 46368, 196418]` },
    { setup: `g = fibs(lambda x: x > 20)`, expr: `[next(g) for i in range(10)]`, expected: `[21, 34, 55, 89, 144, 233, 377, 610, 987, 1597]` },
    { setup: `g = fibs(lambda x: True)`, expr: `[next(g) for i in range(8)]`, expected: `[0, 1, 1, 2, 3, 5, 8, 13]` }
  ],
  idea: `A generator with an unconditional while True loop can produce values forever; the caller controls how many it actually consumes via next(). Updating both Fibonacci variables simultaneously (n, m = m, n + m) avoids one update corrupting the other, and yielding is simply conditional on f(n).`,
  mistakes: [
    `Using a fixed-size loop (like <code>for i in range(10)</code>) inside <code>fibs</code> instead of <code>while True</code>, which stops producing values after a hardcoded number regardless of how many the caller asks for.`,
    `Updating <code>n</code> and then using the new <code>n</code> to compute the new <code>m</code> (instead of updating both from their old values at once), which produces the wrong sequence.`,
    `Yielding unconditionally and filtering outside the generator, or forgetting <code>yield</code> entirely and using <code>return</code>.`,
    `Off-by-one errors in which number gets yielded vs. which becomes "current" next &mdash; double check against the given examples, especially that the sequence starts 0, 1, 1, 2, 3, ...`
  ]
}

]
};
