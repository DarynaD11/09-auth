import api from "./api";
import type { Note, NewNoteData } from "@/types/note";
import type { User } from "@/types/user";
import nextServer from "./api";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

type CheckSessionRequest = {
  success: boolean;
};

export type UserRequest = { email: string; password: string };

export const register = async (data: UserRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};
export const login = async (data: UserRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const updateUser = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  const res = await api.patch<User>("/users/me", { username, email });
  return res.data;
};

export const logoutUser = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 6,
  search = "",
  tag,
}: FetchNotesParams): Promise<NotesHttpResponse> => {
  const res = await api.get<NotesHttpResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search && { search }),
      ...(tag ? { tag } : {}),
    },
  });
  return res.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${noteId}`);
  return res.data;
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const res = await nextServer.post<Note>("/notes", noteData);
  return res.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await nextServer.delete<Note>(`/notes/${noteId}`);
  return res.data;
};