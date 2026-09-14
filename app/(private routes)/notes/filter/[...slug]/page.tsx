import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "../../../../../lib/api/serverApi";
import NotesClient from "./Notes.client";

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] || "all";
  const title =
    tag === "all" ? "All notes | NoteHub" : `${tag} notes | NoteHub`;
  const description =
    tag === "all" ? "All notes in NoteHub." : `Notes tagged ${tag} in NoteHub.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const tag = slug[0] || "all";
  const client = new QueryClient();
  await client.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag }),
  });
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
