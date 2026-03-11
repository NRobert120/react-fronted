 import { Play, Download, MoreHorizontal } from "lucide-react"

function Nowtrending(){
    return (
        <div className="nowtrending__container">
           <video autoPlay muted loop playsInline>
        <source src="/your-video.mp4" type="video/mp4" />
      </video>
            <h6 className="small-header">Now Trending</h6>
            <div className="description">
                <h2>Spider-Man:<br/>Across the spiderverse</h2>
                <p>Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.</p>
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

      {/* More Options Button */}
      <div  className="more">

        <MoreHorizontal size={20} />
      </div>

    </div>

        </div>
    )
}
export default Nowtrending