"use client";

import dynamic from "next/dynamic";

const BookForm = dynamic(() => import("@/components/BookForm"), {
  ssr: false,
  loading: () => <div className="text-center py-5">Loading...</div>,
});

export default function MenteeBook() {
  return <BookForm />;
}