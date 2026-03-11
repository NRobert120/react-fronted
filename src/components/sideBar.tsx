import { Play}from "lucide-react"
 function Sidebar(){
  return(
    <div className="sidebar">

            <div className="sidebar-trending">
            <h5>New Trending</h5>
             <div className="sidebar-trending-item">

        <div className="sidebar-trending-item-description">
        <p>Barry align use his super speed to change the pastsdfhsjhfposjfsdjfoisdfopisdnpsdajfosdfasdjfpodshjfoisdo</p>
        </div>
        <Play size={40}  className="play" fill="black"/>
       </div>
       <div className="sidebar-trending-item">
        
        <div className="sidebar-trending-item-description">
        
        <p>Barry align use his super speed to change the pastsdfhsjhfposjfsdjfoisdfopisdnpsdajfosdfasdjfpodshjfoisdo</p>
        </div>
        <Play size={40} className="play" fill="black"/>
       </div>
       <div className="sidebar-trending-item">
        <div className="dots">
        
        </div>
    
        <div className="sidebar-trending-item-description">
      
        <p>Barry align use his super speed to change the pastsdfhsjhfposjfsdjfoisdfopisdnpsdajfosdfasdjfpodshjfoisdo</p>
        </div>
        <Play size={40}  className="play" fill="black"/>
       </div>
        <div className="sidebar-trending-item">
            <div className="dots">
            
            </div>
    
        <div className="sidebar-trending-item-description">
      
        <p>Barry align use his super speed to change the pastsdfhsjhfposjfsdjfoisdfopisdnpsdajfosdfasdjfpodshjfoisdo</p>
        </div>
        <Play size={40}  className="play" fill="black"/>
       </div>
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
    <img className="sidebar-continue-item-thumbnail" src="lupin.jpg" alt="Lupin" />
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