import {Bell} from "lucide-react"
import Searchbar from "./searchBar"

export default function Navbar(){
    return (
        <div className="navbar">
<Searchbar/>
            <ul className="navbar-list">
                <li className="navbar-list-item">Movie</li>
                <li className="navbar-list-item">Tv series</li>
                <li className="navbar-list-item">Animation</li>
                <li className="navbar-list-item">Mistery</li>
                <li className="navbar-list-item">Adventure</li>
            </ul>
         {/* ✅ Correct — div wraps the Bell */}
            <div className="navbar-bellring">
             <Bell size={15} color="white" />
            </div> 
             <div className="account__info">
             <p>account info</p>
             </div>
  
        </div>
    )
}