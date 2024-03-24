"use client";
import { useCodeHighlighter } from "@/hooks";
import { PostData } from "@/lib/posts";

export default function Post(props: { post: PostData }) {
  const { post } = props;

  useCodeHighlighter();

  return (
    <article className="markdown-body">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
