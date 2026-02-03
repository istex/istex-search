import type * as React from "react";

type Tag = "strong" | "br" | "pre" | "i";

interface RichTextProps {
  children: (
    tags: Record<Tag, (chunks: React.ReactNode) => React.ReactNode>,
  ) => React.ReactNode;
}

export default function RichText({ children }: RichTextProps) {
  return children({
    strong: (chunks) => <strong>{chunks}</strong>,
    br: () => <br />,
    pre: (chunks) => <pre>{chunks}</pre>,
    i: (chunks) => <i>{chunks}</i>,
  });
}
