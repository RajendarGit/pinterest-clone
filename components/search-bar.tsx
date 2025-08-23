import { Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="text"
        placeholder="Search for ideas"
        value={searchQuery}
        onChange={handleChange}
        className="pl-10 bg-muted border-0 focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default SearchBar;
