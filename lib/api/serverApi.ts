import { cookies } from "next/headers";
import nextServer from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";
import { FetchNotesParams } from "./clientApi";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getServerMe = async (): Promise<User | null> => {
  try {
    const cookieStore = cookies();
    const res = await nextServer.get<User>("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user on server:", error);
    return null;
  }
};

export const fetchNotes = async ({
  tag,
  search,
  page = 1,
  perPage = 12,
}: FetchNotesParams): Promise<NotesHttpResponse> => {
  const cookieStore = cookies();
  const res = await nextServer.get<NotesHttpResponse>("/notes", {
    params: { tag, page, perPage, ...(search?.trim() ? { search } : {}) },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return {
    notes: res.data.notes,
    totalPages: res.data.totalPages,
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });

  return data;
};
