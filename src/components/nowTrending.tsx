import { Play, Download, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

interface Movie {
  _id: string;
  name: string;
  description: string;
  genre: "sci-fi" | "action" | "crime" | "romance" | "horror";
  picUrl: string;
  views: number;
}

interface ApiResponse {
  success: boolean;
  data: Movie[];
}

interface Props {
  selectedMovie: Movie | null;  // ✅ receive selected movie from parent
}

function Nowtrending({ selectedMovie }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (movies.length === 0) return <p>No movies found</p>;

  const maxViews = Math.max(...movies.map((movie) => movie.views));
  const highestViewed = movies.filter((movie) => movie.views === maxViews)[0];

  
  const displayMovie = selectedMovie ?? highestViewed;

  return (
    <div
      style={{
        backgroundImage: `url(${displayMovie.picUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        
      }}
      className="nowtrending__container"
    >
      <h6 className="small-header">Now Trending</h6>
      <div className="description">
        <h2>{displayMovie.name}</h2>
        <p>{displayMovie.description}</p>
      </div>

      <div className="controls">
        <button className="watch">
          <Play size={18} fill="black" />
          Watch
        </button>
        <button className="download">
          <Download size={18} />
          Download
        </button>
        <div className="more">
          <MoreHorizontal size={20} />
        </div>
      </div>
    </div>
  );
}

export default Nowtrending;