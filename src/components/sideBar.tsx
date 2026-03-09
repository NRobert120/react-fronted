import { useState } from "react";
import "../App.css";
import{Search,Home,User,MessageCircleIcon,Settings} from "lucide-react"

// 1. Define the type
interface NavItem {
  id: number;
  name: string;
  icon: React.ReactNode;
}

// 2. Fix the data — unique ids and different names
const items: NavItem[] = [
  { id: 1, name: "Home", icon:<Home/> },
  { id: 2, name: "Profile",   icon: <User/> },
  { id: 3, name: "Messages",  icon:<MessageCircleIcon/>  },
  { id: 4, name: "Analytics", icon: <Search/> },
  { id: 5, name: "Settings",  icon:<Settings/> },
];

function Sidebar() {
  // 3. Track which item is active
  const [activeId, setActiveId] = useState<number>(1);

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">MyApp</h2>

      <ul className="sidebar-list">
        {items.map(item => (
          <li
            key={item.id}                        
            className={`sidebar-item ${activeId === item.id ? "active" : ""}`}
            onClick={() => setActiveId(item.id)}  
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;