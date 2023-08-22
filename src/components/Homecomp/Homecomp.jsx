import "./Homecomp.css";
import { NavLink} from "react-router-dom";
import {FaGithub ,FaInstagram ,FaLinkedin} from "react-icons/fa"

function Homecomp()
{

    return(
        <section id="few-user">
            <p style={{margin:"0",letterSpacing:"px"}} className="footer-style top-gap">MADE BY PRANJAL KUMAR</p>
        <div className="div-few-user">
        <p style={{fontSize:"3em",fontWeight:"600",color:"#00A676"}}>vg</p>
        <div className="info-few">
        <NavLink to={"/profile/RDqda84IQ7Xc8go8mfAedaXhU8D2"}>
            <p className="name-few-user">&nbsp;&nbsp;Admin Pk</p></NavLink>
        </div>
        </div>

          <div className="div-few-user">
            <p><FaGithub size={43} /></p>
        <div className="info-few">
        <NavLink to="https://github.com/pranjalkv" target="_blank">
            <p className="name-few-user">&nbsp;@pranjalkv</p></NavLink>
        </div>
        </div>

          <div className="div-few-user">
        <p><FaInstagram size={43} style={{color:"#00A676"}}/></p>
        <div className="info-few">
        <NavLink to="https://www.instagram.com/pranjalkv" target="_blank">
            <p className="name-few-user">&nbsp;@pranjalkv</p></NavLink>
        </div>
        </div>
          <div className="div-few-user">
          <img className="few-user-img" src="/images/twi.png" alt="twitter"/>
        <div className="info-few">
        <NavLink to="https://twitter.com/kvpranjal" target="_blank"><p className="name-few-user">@kvpranjal</p></NavLink>
        </div>
        </div>

        <div className="div-few-user">
          <p><FaLinkedin size={43} style={{color:"#00A676"}}/></p>
        <div className="info-few">
        <NavLink to="https://www.linkedin.com/in/pranjalkv" target="_blank"><p className="name-few-user">@pranjalkv</p></NavLink>
        </div>
        </div>

        <p  className="footer-style">©2023 ALL RIGHTS RESERVED FROM pranjalkv.com</p>
        </section>
    )
}
<a href="https://www.linkedin.com/in/pranjalkv/" target="_blank"><FaLinkedin size="1.5em"/></a>

export default Homecomp;