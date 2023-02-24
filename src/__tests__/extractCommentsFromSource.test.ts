import { stripIndent } from "common-tags"
import { extractCommentsFromSource } from "../extractCommentsFromSource"

test("basic single line comments", async () => {
  const exampleCode = stripIndent`
    import foo from 'bar';

    function myFunction() {
      // TODO This needs some work
      return foo();
    }
  `

  expect(await extractCommentsFromSource(exampleCode)).toEqual([
    { value: " TODO This needs some work" },
  ])
})
