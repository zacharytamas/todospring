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
    return [
      ...acc,
      {
        value: comment.value,
        loc: { start: { ...comment.loc!.start }, end: { ...comment.loc!.end } },
      } as CommentNode,
    ]
  }, [] as CommentNode[])
}
