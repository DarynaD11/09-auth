"use client";

import css from "./page.module.css";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import { Note } from "@/types/note";
import Link from "next/link";

interface NotesClientProps {
  initialNotes: Note[];
  totalPages: number;
  currentTag: string;
}

export default function NotesClient({
  initialNotes,
  totalPages,
  currentTag,
}: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, searchInput, currentTag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 6,
        search: searchInput,
        ...(currentTag && currentTag !== "All" ? { tag: currentTag } : {}),
      }),
    initialData:
      page === 1 && !searchInput && currentTag === "All"
        ? { notes: initialNotes, totalPages }
        : undefined,
    placeholderData: keepPreviousData,
  });

  const updateSearchInput = useDebouncedCallback((newValue: string) => {
    setPage(1);
    setSearchInput(newValue);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onSearch={updateSearchInput} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <Link className={css.button} href={"/notes/action/create"}>
          Create note +
        </Link>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && !isLoading && data.notes.length === 0 && (
        <p className={css.emptyMessage}>Not found</p>
      )}
      {data && !isLoading && <NoteList notes={data.notes} />}
    </div>
  );
}
