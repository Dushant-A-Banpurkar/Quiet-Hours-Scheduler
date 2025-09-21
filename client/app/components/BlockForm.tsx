/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  onSuccess: () => void;
}

export default function BlockForm({ onSuccess }: Props) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Your must be logged in!");
    }
    setLoading(true);

    const res = await fetch("/api/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startTime, endTime, userId: user.id,email:user.email }),
      
    });

    setLoading(false);
    if (res.ok) {
      setStartTime("");
      setEndTime("");
      onSuccess();
    } else {
      alert("Failed to create block");
    }
  };
  if(!isClient||!user){
    return(
      <p className="text-green-500">Loading user data</p>
    )
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-100 p-4 rounded-lg"
    >
      <h2 className="text-lg font-semibold">Add Quiet Hour</h2>
      <div>
        <label className="block mb-1">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1">End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
