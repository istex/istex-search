import * as React from "react";

type Tag = "strong" | "br";

interface RichTextProps {
  children: (
    tags: Record<Tag, (chunks: React.ReactNode) => React.ReactNode>,
  ) => React.ReactNode;
}

export default function RichText({ children }: RichTextProps) {
  return children({
    strong: (chunks) => <strong>{chunks}</strong>,
    br: () => <br />,
  });
}
