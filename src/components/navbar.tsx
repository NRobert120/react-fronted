import { Bell } from "lucide-react";
import Searchbar from "./searchbar";

interface Movie {
  _id: string;
  name: string;
  description: string;
  genre: "sci-fi" | "action" | "animation" | "horror";
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
        <li className="navbar-list-item" >All</li>
        <li className="navbar-list-item">Action</li>
        <li className="navbar-list-item">Horror</li>
        <li className="navbar-list-item">Sci-fi</li>
        <li className="navbar-list-item">Animation</li>
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
