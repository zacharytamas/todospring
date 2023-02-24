import { parse } from "@babel/parser"

interface CommentNode {
  value: string
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
    return [...acc, { value: comment.value }]
  }, [] as CommentNode[])
}