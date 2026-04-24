import { useState } from "react";
import "./App.css";
import Sidebar from "./components/sideBar";
import Nowtrending from "./components/nowTrending";
import Navbar from "./components/navbar";
import LikedMost from "./components/like";

interface Movie {
  _id: string;
  name: string;
  description: string;
  genre: "sci-fi" | "action" |"animation"| "horror";
  picUrl: string;
  views: number;
}

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <div className="pagecontainer">
      <Navbar onMovieSelect={setSelectedMovie} />  {/* ✅ pass down */}
      <Sidebar />
      <Nowtrending selectedMovie={selectedMovie} />  {/* ✅ pass down */}
      <LikedMost />
    </div>
  );
}