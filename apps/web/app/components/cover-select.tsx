"use client";
import { cn } from "@ui/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { XIcon } from "lucide-react";

export default function CoverSelect({
  baseCoverImage,
  customCoverImage,
}: {
  baseCoverImage: string;
  customCoverImage: string;
}) {
  const [showBase, setShowBase] = useState(true);
  const [showTip, setShowTip] = useState(true);

  return (
    <div className="relative w-[800px] h-[420px]">
      {showBase ? (
        <Image
          onClick={() => setShowBase(!showBase)}
          alt=""
          src={baseCoverImage}
          width={1600}
          height={840}
          className={cn(
            "rounded-md w-[800px] h-[420px] object-cover border border-neutral-300 cursor-pointer",
          )}
        />
      ) : (
        <Image
          alt=""
          src={customCoverImage}
          width={1600}
          onClick={() => setShowBase(!showBase)}
          height={840}
          className={cn(
            "rounded-md w-[800px] h-[420px] object-cover border border-neutral-300 z-0 cursor-pointer",
          )}
        />
      )}

      <div
        className={cn(
          "absolute right-4 bottom-4 bg-white shadow-md rounded-md p-4 w-80 text-sm text-neutral-600 transition-opacity duration-300",
          showTip ? "opacity-100" : "opacity-0",
        )}
      >
        <button
          onClick={() => setShowTip(!showTip)}
          className="absolute right-2 top-2 hover:cursor-pointer hover:opacity-50"
        >
          <XIcon className="h-4 w-4" />
        </button>
        Click on the cover to switch between the default cover and your custom
        cover.
      </div>
    </div>
  );
}
