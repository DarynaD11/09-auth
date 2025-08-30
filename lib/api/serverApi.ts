import { cookies } from "next/headers";
import nextServer from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";
import { FetchNotesParams } from "./clientApi";
import api from "./api";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export const checkServerSession = async () => {
  const cookieHeader = await getCookiesHeader();
  const res = await api.get("/auth/session", {
    headers: { Cookie: cookieHeader },
  });
  return res;
};

export async function getCookiesHeader(): Promise<string> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`
    )
    .join("; ");

  return cookieStr;
}

export const getServerMe = async (): Promise<User> => {
  const cookieHeader = await getCookiesHeader();
  const { data } = await api.get("/users/me", {
    headers: { Cookie: cookieHeader },
  });
  return data;
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
