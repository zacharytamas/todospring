import { stripIndent } from "common-tags"
import { extractCommentsFromSource } from "../extractCommentsFromSource"

describe("CommentBlock", () => {
  // CommentBlock is pretty easy since Babel already takes care of multiple lines.
  test("basic comments", async () => {
    const exampleCode = stripIndent`
      import foo from 'bar';

      /**
       * A multi-line CommentBlock here.
       */
      function myFunction() {
        /* This is a single line one. */
        return foo();
      }
    `

    expect(await extractCommentsFromSource(exampleCode)).toEqual([
      {
        value: "*\n * A multi-line CommentBlock here.\n ",
        loc: { start: { column: 0, line: 3, index: 24 }, end: { column: 3, line: 5, index: 66 } },
      },
      {
        value: " This is a single line one. ",
        loc: { start: { column: 2, line: 7, index: 93 }, end: { column: 34, line: 7, index: 125 } },
      },
    ])
  })
})

describe("CommentLine", () => {
  test("basic single line comments", async () => {
    const exampleCode = stripIndent`
      import foo from 'bar';

      function myFunction() {
        // TODO This needs some work
        return foo();
      }
    `

    expect(await extractCommentsFromSource(exampleCode)).toEqual([
      {
        value: " TODO This needs some work",
        loc: { start: { column: 2, line: 4, index: 50 }, end: { column: 30, line: 4, index: 78 } },
      },
    ])
  })

  test("multi-line merging", async () => {
    const exampleCode = stripIndent`
      import foo from 'bar';

      function myFunction() {
        // TODO This should be
        // multiple lines
        // long

        // This is another comment but
        // not a part of the one above.
      }
    `

    expect(await extractCommentsFromSource(exampleCode)).toEqual([
      {
        value: " TODO This should be\n multiple lines\n long",
        loc: { start: { column: 2, line: 4, index: 50 }, end: { column: 9, line: 6, index: 102 } },
      },
      {
        value: " This is another comment but\n not a part of the one above.",
        loc: {
          start: { column: 2, line: 8, index: 106 },
          end: { column: 33, line: 9, index: 170 },
        },
      },
    ])
  })
})
