import { useState } from "react";
import { Search } from "lucide-react";

function Searchbar() {
  const [query, setQuery] = useState("");

  return (
    <div className="searchbar">
      <Search className="searchbar__icon" size={16} />
      <input
        type="text"
        className="searchbar__input"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

export default Searchbar;