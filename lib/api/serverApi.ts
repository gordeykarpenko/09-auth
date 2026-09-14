import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "../../types/note";
import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";
import type { User } from "../../types/user";

async function cookieHeaders(): Promise<{ Cookie: string }> {
  return { Cookie: (await cookies()).toString() };
}
export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: await cookieHeaders(),
  });
  return data;
}
export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: await cookieHeaders(),
  });
  return data;
}
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me", {
    headers: await cookieHeaders(),
  });
  return data;
}
export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | null>("/auth/session", {
    headers: await cookieHeaders(),
  });
  return data;
}
