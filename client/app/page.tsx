/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import BlockForm from "./components/BlockForm";
import BlockList from "./components/BlockList";

export default function HomePage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlocks = async () => {
    setLoading(true);
    const res = await fetch("/api/blocks");
    const data = await res.json();
    setBlocks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Quiet Hours Scheduler</h1>
      <BlockForm onSuccess={fetchBlocks} />
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <BlockList blocks={blocks} onDelete={fetchBlocks} />
      )}
    </main>
  );
}
