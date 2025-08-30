import { Metadata } from "next";
import NotesClient from "./Notes.client";
import { fetchNotes, getServerMe } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];
  return {
    title: `${tag} notes`,
    description: `Browse personal notes filtered by category: ${tag}.`,
    openGraph: {
      title: `NoteHub - ${tag} notes`,
      description: `Browse personal notes filtered by category: ${tag}.`,
      url: `https://09-auth-lac-zeta.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub - ${tag} notes`,
        },
      ],
      type: "article",
      siteName: "NoteHub",
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
const user = await getServerMe();

  if (!user) {
    redirect("/sign-in");
  }

  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];

  const data = await fetchNotes({
    page: 1,
    perPage: 6,
    ...(tag && tag !== "All" ? { tag } : {}),
  });

  return (
    <NotesClient
      initialNotes={data.notes}
      totalPages={data.totalPages}
      currentTag={tag ?? "All"}
    />
  );
}
