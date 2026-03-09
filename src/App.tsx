import { useState, useEffect } from "react";
import "./App.css"
import Sidebar from "./components/sideBar";
import Searchbar from "./components/searchBar";
import Navbar from "./components/navbar";

export default function App() {
  return (
    <div className="pagecontainer">
      {/* <Sidebar/> */}
      {/* <Searchbar/> */}
      <Navbar/>

    </div>
  );
}























































































//interface Weather {
//   name: string;
//   id: number;
//   cod: number;
//   coord: { lat: number; lon: number };
//   main: {
//     temp: number;
//     feels_like: number;
//     temp_min: number;
//     temp_max: number;
//     humidity: number;
//     pressure: number;
//   };
//   weather: {
//     id: number;
//     main: string;
//     description: string;
//     icon: string;
//   }[];
//   wind: { speed: number; deg: number };
//   clouds: { all: number };
//   visibility: number;
//   sys: { country: string; sunrise: number; sunset: number };
//   timezone: number;
//   dt: number;
// }

// // ✅ Bug 1 fixed — capital G
// function GetWeather() {
//   const [data, setData]       = useState<Weather | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError]     = useState<string>("");

//   const lat    = -1.6369;
//   const lon    = 29.5807;
//   const apiKey = "72874298bea7effe28cfd0db9c33e42a"; // ✅ Bug 2 fixed — consistent name
//   const url    = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

//   const fetchWeather = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(url); // ✅ Bug 5 fixed — using url variable

//       if (res.ok) {
//         const json = await res.json() as Weather;
//         setData(json);
//       } else {
//         throw new Error(`Failed: ${res.status}`);
//       }

//     } catch (err) {
//       setError(`${err}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Bug 3 fixed — useEffect runs fetchWeather once on mount
//   useEffect(() => {
//     fetchWeather();
//   }, []);

//   return (
//     <div>
//       <h1>🌡️ Weather</h1>

//       {/* ✅ Bug 4 fixed — correct conditional rendering */}
//       {loading && <h2>Loading...</h2>}
//       {error   && <p style={{ color: "red" }}>{error}</p>}

//       {data && (
//         <div>
//           <h2>{data.name}, {data.sys.country}</h2>
//           <p className="container">🌡️  Temp:        {data.main.temp}°C</p>
//           <p className="container">🤔 Feels like:  {data.main.feels_like}°C</p>
//           <p className="container">💧 Humidity:    {data.main.humidity}%</p>
//           <p className="container">🌤️  Description: {data.weather[0].description}</p>
//           <p className="container">💨 Wind:        {data.wind.speed} m/s</p>
//           <p className="container">☁️  Clouds:      {data.clouds.all}%</p>
//         </div>
//       )}
//     </div>
//   );
// }
