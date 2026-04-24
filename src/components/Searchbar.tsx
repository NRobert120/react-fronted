import { useState } from "react";
import { Search } from "lucide-react";

interface Movie {
  _id: string;
  name: string;
  description: string;
  genre: "sci-fi" | "action" | "animation"| "horror";
  picUrl: string;
  views: number;
}

interface ApiResponse {
  success: boolean;
  data: Movie[];
}

interface Props {
  onMovieSelect: (movie: Movie) => void;  
}

function Searchbar({ onMovieSelect }: Props) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);

  const filtered = movies.filter((movie) =>
    movie.name.toLowerCase().includes(query.toLowerCase())
  );

  const getMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5500/api/v1/movies");
      if (res.ok) {
        const dbmovie: ApiResponse = await res.json();
        setMovies(dbmovie.data);
      } else {
        throw new Error("something went wrong");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  function HandleFocus() {
    setFocus(true);
    if (movies.length === 0) {
      getMovies();
    }
  }

  return (
    <>
      <div className="searchbar">
        <Search className="searchbar__icon" size={16} />
        <input
          type="text"
          className="searchbar__input"
          placeholder="Search movies..."
          value={query}
          onFocus={HandleFocus}
          onBlur={() => setFocus(false)}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {focus && (
        <div className="searchlist">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : query === "" ? (
            <p>Start typing to search...</p>
          ) : filtered.length === 0 ? (
            <p>No movies found for "{query}"</p>
          ) : (
            <ul>
              {filtered.map((movie) => (
                <li
                  key={movie._id}
                  onMouseDown={() => onMovieSelect(movie)}  // ✅ pass movie up
                  style={{ cursor: "pointer" }}
                >
                  <p>{movie.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

export default Searchbar;