import { parse } from "@babel/parser"

interface CommentNode {
  value: string
  loc?: { start: Location; end: Location }
}

interface Location {
  line: number
  column: number
  index: number
}

export const extractCommentsFromSource = async (sourceText: string): Promise<CommentNode[]> => {
  const ast = parse(sourceText, {
    sourceType: "module",
    plugins: ["typescript", "jsx", "classProperties", "objectRestSpread"],
  })

  if (!ast.comments) {
    return []
  }

  return ast.comments.reduce((acc, comment) => {
    // If the comment is a CommentBlock, we don't need to anything special for it.
    if (comment.type === "CommentBlock") {
      return [
        ...acc,
        {
          value: comment.value,
          loc: { start: { ...comment.loc!.start }, end: { ...comment.loc!.end } },
        } as CommentNode,
      ]
    }

    // If the comment is a CommentLine, we need to merge it with the previous comment
    // if it ended on the line before this one.
    const previous: CommentNode | undefined = acc[acc.length - 1]

    if (previous && previous.loc!.end.line === comment.loc!.start.line - 1) {
      return [
        ...acc.slice(0, -1),
        {
          value: `${previous.value}\n${comment.value}`,
          loc: { start: { ...previous.loc!.start }, end: { ...comment.loc!.end } },
        } as CommentNode,
      ]
    }

    return [
      ...acc,
      {
        value: comment.value,
        loc: { start: { ...comment.loc!.start }, end: { ...comment.loc!.end } },
      } as CommentNode,
    ]
  }, [] as CommentNode[])
}
