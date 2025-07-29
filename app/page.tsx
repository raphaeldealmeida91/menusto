"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navigation />
      <div className="w-full h-full flex justify-center items-center flex-col gap-12 bg-background">
        <h1 className="text-5xl w-7/12 text-center font-bold">
          Retrouvez tous les menus de vos restaurants préférés ! Tous ça chez{" "}
          <span className="text-amber-500">Menusto</span> !
        </h1>
        <motion.form
          onSubmit={handleSearch}
          className="w-full max-w-md mx-auto relative flex items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            animate={{ width: isFocused ? "100%" : "80%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative"
          >
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              type="text"
              placeholder="Rechercher un restaurant..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="pl-10 pr-4 py-6 text-base focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all duration-300"
            />
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
