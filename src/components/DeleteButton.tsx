"use client";

import { deleteVideo } from "@/app/actions/video";
import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <button
      onClick={async () => {
        if (confirm("Supprimer définitivement cette vidéo ?")) {
          setIsDeleting(true);
          await deleteVideo(id);
          setIsDeleting(false);
        }
      }}
      disabled={isDeleting}
      className="px-3 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
    >
      {isDeleting ? "..." : "Supprimer"}
    </button>
  );
}