import { Play } from "lucide-react"
import { useState, useEffect } from "react"

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

// interface Props{
//   selected
// }

function Sidebar() {
  const [movies, setMovie] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const filtered = movies.slice(0,15);

  const getMovie = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5500/api/v1/movies")
      if (res.ok) {
        const dbmovies: ApiResponse = await res.json()
        setMovie(dbmovies.data);
      } else {
        throw new Error(res.statusText)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMovie();
  }, []);

  return (
    <div className="sidebar">

      <div className="sidebar-trending">
        <h5>New Trending</h5>

        {loading ? (
          <p>loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          filtered.map(movie => (
            <div
             key={movie._id} 
             style={{  backgroundImage: `url(${movie.picUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",}} 
          className="sidebar-trending-item"
          // onClick={(se)}
          >
              <div className="sidebar-trending-item-description">
                <p>{movie.description}</p>
              </div>
              <Play size={40} className="play" fill="black" />
            </div>
          ))
        )}
      </div>

      <div className="sidebar-continue">
        <h2>Continue Watching</h2>

        <div className="sidebar-continue-item">
          <img className="sidebar-continue-item-thumbnail" src="dark.jpg" alt="Dark" />
          <div className="sidebar-continue-item-info">
            <h4>Dark Season 3</h4>
            <span>Episode 3</span>
          </div>
          <div className="sidebar-continue-item-play">
            <Play size={18} fill="white" color="white" />
          </div>
        </div>

        <div className="sidebar-continue-item">
          <img className="sidebar-continue-item-thumbnail" src="transformers.jpg" alt="Transformers" />
          <div className="sidebar-continue-item-info">
            <h4>Transformers - Da...</h4>
            <span>32min 12sec</span>
          </div>
          <div className="sidebar-continue-item-play">
            <Play size={18} fill="white" color="white" />
          </div>
        </div>

        <div className="sidebar-continue-item">
          <img className="sidebar-continue-item-thumbnail" src='/assets/lupin.jpg' alt="Lupin" />
          <div className="sidebar-continue-item-info">
            <h4>Lupin Season 2</h4>
            <span>Episode 2</span>
          </div>
          <div className="sidebar-continue-item-play">
            <Play size={18} fill="white" color="white" />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Sidebar