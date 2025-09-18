/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface Props {
  blocks: any[];
  onDelete: () => void;
}

export default function BlockList({ blocks, onDelete }: Props) {
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this block?")) return;

    await fetch(`/api/blocks?id=${id}`, { method: "DELETE" });
    onDelete();
  };

  if (blocks.length === 0) {
    return <p className="mt-6 text-gray-500">No quiet hours yet.</p>;
  }

  return (
    <ul className="mt-6 space-y-3">
      {blocks.map((block) => (
        <li
          key={block._id}
          className="flex justify-between items-center bg-white shadow p-3 rounded"
        >
          <div>
            <p className="font-medium">
              {new Date(block.startTime).toLocaleString()} →{" "}
              {new Date(block.endTime).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleDelete(block._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
