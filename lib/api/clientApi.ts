import type { AxiosResponse } from "axios";
import { api } from "./api";
import type { Note, NoteTag } from "../../types/note";
import type { User } from "../../types/user";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}
interface Credentials {
  email: string;
  password: string;
}
interface UsernameUpdate {
  username: string;
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params,
  });
  return response.data;
}
export async function fetchNoteById(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return response.data;
}
export async function createNote(values: CreateNoteParams): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post("/notes", values);
  return response.data;
}
export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
}
export async function register(values: Credentials): Promise<User> {
  const response: AxiosResponse<User> = await api.post(
    "/auth/register",
    values,
  );
  return response.data;
}
export async function login(values: Credentials): Promise<User> {
  const response: AxiosResponse<User> = await api.post("/auth/login", values);
  return response.data;
}
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
export async function checkSession(): Promise<User | null> {
  const response: AxiosResponse<User | null> = await api.get("/auth/session");
  return response.data;
}
export async function getMe(): Promise<User> {
  const response: AxiosResponse<User> = await api.get("/users/me");
  return response.data;
}
export async function updateMe(values: UsernameUpdate): Promise<User> {
  const response: AxiosResponse<User> = await api.patch("/users/me", values);
  return response.data;
}
