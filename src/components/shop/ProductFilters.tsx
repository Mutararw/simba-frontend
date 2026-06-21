import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal, ArrowDownWideNarrow, ArrowUpNarrowWide, Check } from "lucide-react";
import { formatRWF } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterState {
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: string;
}

interface ProductFiltersProps {
  maxPrice: number;
  initialFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function ProductFilters({ maxPrice, initialFilters, onFilterChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync internal state with props if they change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const reset: FilterState = {
      priceRange: [0, maxPrice],
      inStockOnly: false,
      sortBy: "relevance",
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  const hasActiveFilters = 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < maxPrice || 
    filters.inStockOnly || 
    filters.sortBy !== "relevance";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2">
          <Button 
            variant={isExpanded ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-9 rounded-full gap-2 shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary-foreground text-primary">
                !
              </Badge>
            )}
          </Button>

          <div className="h-6 w-[1px] bg-border mx-1 shrink-0" />

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <Button
              variant={filters.inStockOnly ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilters({ inStockOnly: !filters.inStockOnly })}
              className={`h-9 rounded-full gap-1.5 shrink-0 transition-all ${filters.inStockOnly ? "bg-primary shadow-sm" : ""}`}
            >
              {filters.inStockOnly && <Check className="h-3.5 w-3.5" />}
              In Stock
            </Button>

            <Select 
              value={filters.sortBy} 
              onValueChange={(val) => updateFilters({ sortBy: val })}
            >
              <SelectTrigger className="h-9 w-[140px] rounded-full shrink-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-9 rounded-full gap-2 text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border bg-card/50 p-6 shadow-inner space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price Range</h4>
                  <div className="text-sm font-medium text-primary">
                    {formatRWF(filters.priceRange[0])} — {formatRWF(filters.priceRange[1])}
                  </div>
                </div>
                <div className="px-2 pt-2">
                  <Slider
                    defaultValue={[0, maxPrice]}
                    value={filters.priceRange}
                    max={maxPrice}
                    step={100}
                    onValueChange={(val) => updateFilters({ priceRange: val as [number, number] })}
                    className="py-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Additional filters can be added here */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Sort</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateFilters({ sortBy: "price-low" })}
                      className={`flex-1 rounded-xl gap-2 ${filters.sortBy === "price-low" ? "border-primary bg-primary/5" : ""}`}
                    >
                      <ArrowUpNarrowWide className="h-4 w-4" />
                      Low to High
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateFilters({ sortBy: "price-high" })}
                      className={`flex-1 rounded-xl gap-2 ${filters.sortBy === "price-high" ? "border-primary bg-primary/5" : ""}`}
                    >
                      <ArrowDownWideNarrow className="h-4 w-4" />
                      High to Low
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
