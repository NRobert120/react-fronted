import { Bell } from "lucide-react";
import Searchbar from "./searchbar";

interface Movie {
  _id: string;
  name: string;
  description: string;
  genre: "sci-fi" | "action" | "crime" | "romance" | "horror";
  picUrl: string;
  views: number;
}

interface Props {
  onMovieSelect: (movie: Movie) => void;  // ✅ receive from App
}

export default function Navbar({ onMovieSelect }: Props) {
  return (
    <div className="navbar">
      <Searchbar onMovieSelect={onMovieSelect} />  {/* ✅ pass to Searchbar */}
      <ul className="navbar-list">
        <li className="navbar-list-item">Movie</li>
        <li className="navbar-list-item">Tv series</li>
        <li className="navbar-list-item">Animation</li>
        <li className="navbar-list-item">Mistery</li>
        <li className="navbar-list-item">Adventure</li>
      </ul>
      <div className="navbar-bellring">
        <Bell size={15} color="white" />
      </div>
      <div className="account__info">
        <p>account info</p>
      </div>
    </div>
  );
}
