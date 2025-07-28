"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  className?: string;
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
}

export function Rating({
  className,
  value,
  onChange,
  max = 5,
  readOnly = false,
}: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value;
        return (
          <button
            key={i}
            onClick={() => !readOnly && onChange?.(i + 1)}
            aria-label={`Note ${i + 1} étoile${i > 0 ? "s" : ""}`}
            disabled={readOnly}
            className={cn(
              "transition-colors disabled:cursor-default",
              filled
                ? "text-yellow-500"
                : "text-gray-300 hover:text-yellow-400",
              className
            )}
          >
            <Star
              className="w-5 h-5 fill-current"
              fill={filled ? "currentColor" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
}
