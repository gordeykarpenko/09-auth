import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "../../../../lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = new QueryClient();
  await client.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const description =
      note.content.slice(0, 160) || `Details for ${note.title}.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://notehub.com/notes/${id}`,
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
  } catch {
    return {
      title: "Note details | NoteHub",
      description: "View note details.",
    };
  }
}
