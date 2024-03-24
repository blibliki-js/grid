import { getPostData } from "@/lib/posts";
import Post from "./Post";

export default async function PostPage({ params }) {
  const post = await getPostData(params.id as string);

  return <Post post={post} />;
}
