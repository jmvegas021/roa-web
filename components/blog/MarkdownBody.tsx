import ReactMarkdown from "react-markdown";
import { createMarkdownComponents } from "./markdown-components";

interface MarkdownBodyProps {
  content: string;
  slug: string;
}

export function MarkdownBody({ content, slug }: MarkdownBodyProps) {
  return (
    <div className="prose-luxury max-w-3xl">
      <ReactMarkdown components={createMarkdownComponents(slug)}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
