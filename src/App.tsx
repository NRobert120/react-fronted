import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/sideBar";

import Navbar from "./components/navbar";

export default function App() {
  return (
    <div className="pagecontainer">
      {/* <Sidebar/> */}
      {/* <Searchbar/> */}
      <Navbar />
    </div>
  );
}


