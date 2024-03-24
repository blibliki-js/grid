import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import Head from "next/head";

export default function Posts() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Head>
        <title>Blibliki Posts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="my-12">
        <h1 className="text-4xl font-bold text-center">Blibliki Posts</h1>
      </header>

      <main>
        <ul>
          {posts.map(({ id, title, date }) => (
            <li key={id} className="border-b border-gray-200 py-4">
              <Link
                href={`/posts/${id}`}
                className="text-xl text-blue-500 hover:text-blue-700"
              >
                {title}
              </Link>
              <div className="text-gray-600">{date}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
