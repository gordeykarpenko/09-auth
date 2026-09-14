"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createNote, type CreateNoteParams } from "../../lib/api/clientApi";
import { useNoteStore } from "../../lib/store/noteStore";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel?: () => void;
}
const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
      router.push("/notes/filter/all");
    },
    onError: () => toast.error("Could not create note"),
  });
  const formAction = async (formData: FormData) => {
    const values: CreateNoteParams = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      tag: String(formData.get("tag") ?? "Todo") as NoteTag,
    };
    if (values.title.length < 3 || values.title.length > 50) {
      toast.error("Title must contain 3–50 characters");
      return;
    }
    if (values.content.length > 500) {
      toast.error("Content must contain at most 500 characters");
      return;
    }
    await mutation.mutateAsync(values);
  };
  return (
    <form className={css.form} action={formAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          required
          minLength={3}
          maxLength={50}
          onChange={(e) => setDraft({ title: e.target.value })}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          maxLength={500}
          onChange={(e) => setDraft({ content: e.target.value })}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={onCancel ?? (() => router.back())}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
