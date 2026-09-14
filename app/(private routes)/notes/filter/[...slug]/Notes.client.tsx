"use client";

import Link from "next/link";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../../../../lib/api/clientApi";
import NoteList from "../../../../../components/NoteList/NoteList";
import Pagination from "../../../../../components/Pagination/Pagination";
import SearchBox from "../../../../../components/SearchBox/SearchBox";
import css from "../../../../../components/NotesPage/NotesPage.module.css";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 400);
  const query = useQuery({
    queryKey: ["notes", search, page, tag],
    queryFn: () => fetchNotes({ search, page, perPage: 12, tag }),
    placeholderData: (previous) => previous,
  });
  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={input}
          onChange={(value) => {
            setInput(value);
            debounced(value);
          }}
        />
        {query.data && query.data.totalPages > 1 && (
          <Pagination
            totalPages={query.data.totalPages}
            page={page}
            onChange={setPage}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>
      {query.isLoading && <p>Loading, please wait...</p>}
      {query.isError && <p>Something went wrong.</p>}
      {query.data?.notes.length ? (
        <NoteList notes={query.data.notes} />
      ) : (
        !query.isLoading && <p>No notes found.</p>
      )}
    </main>
  );
}
