// Shared scaffolding for the past-exam pages.
// Each exams/<term>.js file pushes one exam onto EXAM_BANK.exams.
//
// Exam shape:
//   { id, term, points, questions: [ Question ] }
// Question:
//   { num, title, points, intro?: [html], code?: str, after?: [html], sections: [Section] }
// Section (a lettered sub-question, or one unlabelled section for simple questions):
//   { label?, points?, intro?: [html], code?: str, after?: [html], parts: [Part], runner?: Runner }
// Part:
//   { key, label, points, prompt?, promptCode?, code?, aplus?,
//     type: "choice" | "select" | "text",
//     options?: [str], plainOptions?: bool,     // prose options render in the UI font
//     oneLine?: bool, rows?: int,               // text input shape
//     check?: false,                            // opt out of automatic checking (code blanks)
//     accept?: [str],                           // extra acceptable spellings for text answers
//     answer, explain }
// Runner (runs the real doctests with the student's blanks substituted):
//   { label?, prelude?: str, code: str /* with {{key}} placeholders */,
//     tests: [ { setup?, expr, expected } ] }   // expected is literal Python source, compared via repr

var EXAM_BANK = {
  exams: [],

  // Shown in the collapsible reference at the top of each exam.
  studyGuide: `class Link:
    """A linked list."""
    empty = ()

    def __init__(self, first, rest=empty):
        assert rest is Link.empty or isinstance(rest, Link)
        self.first = first
        self.rest = rest

    def __repr__(self):
        if self.rest is not Link.empty:
            rest_repr = ', ' + repr(self.rest)
        else:
            rest_repr = ''
        return 'Link(' + repr(self.first) + rest_repr + ')'

    def __str__(self):
        string = '<'
        while self.rest is not Link.empty:
            string += str(self.first) + ' '
            self = self.rest
        return string + str(self.first) + '>'


class Tree:
    """A tree with a label and a list of branches."""

    def __init__(self, label, branches=[]):
        self.label = label
        for branch in branches:
            assert isinstance(branch, Tree)
        self.branches = list(branches)

    def __repr__(self):
        if self.branches:
            branch_str = ', ' + repr(self.branches)
        else:
            branch_str = ''
        return 'Tree({0}{1})'.format(repr(self.label), branch_str)

    def __str__(self):
        return '\\n'.join(self.indented())

    def indented(self):
        lines = []
        for b in self.branches:
            for line in b.indented():
                lines.append('  ' + line)
        return [str(self.label)] + lines

    def is_leaf(self):
        return not self.branches`,

  // Definitions available to every Run tests execution.
  runPrelude: `class Link:
    empty = ()
    def __init__(self, first, rest=()):
        assert rest is Link.empty or isinstance(rest, Link)
        self.first = first
        self.rest = rest
    def __repr__(self):
        if self.rest is not Link.empty:
            return 'Link(' + repr(self.first) + ', ' + repr(self.rest) + ')'
        return 'Link(' + repr(self.first) + ')'
    def __str__(self):
        string = '<'
        while self.rest is not Link.empty:
            string += str(self.first) + ' '
            self = self.rest
        return string + str(self.first) + '>'

class Tree:
    def __init__(self, label, branches=[]):
        self.label = label
        for branch in branches:
            assert isinstance(branch, Tree)
        self.branches = list(branches)
    def __repr__(self):
        if self.branches:
            return 'Tree({0}, {1})'.format(repr(self.label), repr(self.branches))
        return 'Tree({0})'.format(repr(self.label))
    def __str__(self):
        return '\\n'.join(self.indented())
    def indented(self):
        lines = []
        for b in self.branches:
            for line in b.indented():
                lines.append('  ' + line)
        return [str(self.label)] + lines
    def is_leaf(self):
        return not self.branches
`
};
