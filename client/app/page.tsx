/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import BlockForm from "./components/BlockForm";
import BlockList from "./components/BlockList";
export type Block = {
  _id: string;
  user_id?: string;
  email: string;
  start_time: string;
  end_time: string;
  reminder_sent?: boolean;
  created_at?: string;
};
export default function HomePage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/blocks");
      if(!res.ok) throw new Error("Failed to fetch blocks");
      const data:Block[] = await res.json();
      setBlocks(data);
      setLoading(false);
    } catch (error:any) {
      setError(error.message||"something went wrong")
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Quiet Hours Scheduler</h1>
      <BlockForm onSuccess={fetchBlocks} />
     <section className="mt-6">
       {loading && 
        <p className="text-gray-500">Loading blocks...</p>
      }{error &&(
        <p className="text-red-500">⚠️ Error loading blocks:{error}</p>
      )}
      {!loading && !error && blocks.length===0 &&(
        <p className="text-gray-400">No quiet hours scheduled yet.</p>
      )}
       {!loading && !error && blocks.length>0&&(
        <BlockList blocks={blocks} onDelete={fetchBlocks} />
      )}
     </section>
    </main>
  );
}
