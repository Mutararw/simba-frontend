import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
};

export function SearchBar({
  className,
  inputClassName,
  placeholder = "Search...",
}: SearchBarProps) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        if (query) {
          navigate(`/browse?q=${encodeURIComponent(query)}`);
        }
      }}
      className={cn("w-full relative", className)}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={cn("pl-9 h-11 rounded-xl bg-muted/50 border-none focus-visible:ring-primary", inputClassName)}
      />
    </form>
  );
}
