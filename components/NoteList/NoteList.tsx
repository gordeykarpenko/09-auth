"use client";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteNote } from "../../lib/api/clientApi";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
interface NoteListProps {
  notes: Note[];
}
const NoteList = ({ notes }: NoteListProps) => {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
  });
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`}>View details</Link>
            <button
              className={css.button}
              onClick={() => mutation.mutate(note.id)}
              disabled={mutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
export default NoteList;
