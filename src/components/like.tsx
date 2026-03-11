import { Play, MoreHorizontal } from "lucide-react"

function LikedMost(){
    return(
        <div className="liked-container">
            <h3>you might like</h3>
       <div className="liked-container-item">
        <div className="dots">
        <MoreHorizontal/>
        </div>
        <h4>fantasy</h4>
        <div className="liked-description">
        <h6>The flash</h6>
        <p>Barry align use his super speed to change the pastsdfhsjhfposjfsdjfoisdfopisdnpsdajfosdfasdjfpodshjfoisdo</p>
        </div>
        <Play size={40}  className="play" fill="black"/>
       </div>
       <div className="liked-container-item">
        <div className="dots">
        <MoreHorizontal/>
        </div>
         <h4>fantasy</h4>
        <div className="liked-description">
        <h6>The flash</h6>
        <p>Barry align use his super speed to change the pastsdfhsjhfposjfsdjfoisdfopisdnpsdajfosdfasdjfpodshjfoisdo</p>
        </div>
        <Play size={40} className="play" fill="black"/>
       </div>
       <div className="liked-container-item">
        <div className="dots">
        <MoreHorizontal/>
        </div>
         <h4>fantasy</h4>
        <div className="liked-description">
        <h6>The flash</h6>
        <p>Barry align use his super speed to change the pastsdfhsjhfposjfsdjfoisdfopisdnpsdajfosdfasdjfpodshjfoisdo</p>
        </div>
        <Play size={40}  className="play" fill="black"/>
       </div>
        <div className="liked-container-item">
            <div className="dots">
            <MoreHorizontal/>
            </div>
        <h4>fantasy</h4>
        <div className="liked-description">
        <h6>The flash</h6>
        <p>Barry align use his super speed to change the pastsdfhsjhfposjfsdjfoisdfopisdnpsdajfosdfasdjfpodshjfoisdo</p>
        </div>
        <Play size={40}  className="play" fill="black"/>
       </div>
        </div>
    )
}

export default LikedMost