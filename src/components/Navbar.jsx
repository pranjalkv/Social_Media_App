import "./Navbar.css"
import Files from "./Files";
import Search from "./Homecomp/Search";
import {db,auth} from "../firebase"
import {FaHome,FaSistrix,FaEnvelope ,FaIdCard ,FaFolderPlus} from "react-icons/fa"
import { useState ,useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getDocs ,query,where,collection } from "firebase/firestore"




function Navbar({userName,setUserName,userid})
{
  const logref=useRef()
  const sref=useRef()
   const navigate=useNavigate()
    const[openbox,setopenBox]=useState(false)
    const[picId,setpicId]=useState("")
    const[signout,setsignout]=useState(false)
    const[openSearch,setOpensearch]=useState(false);
    const userFire=query(collection(db,"dp_data"),where("uid",'==' ,userid))

    function logoutBtn()
    {
      auth.signOut();
      setUserName("")
      window.location.reload();
    }

    function openProfile()
    {
      navigate(`/profile/${userid}`)
    }

    function errorImg(e)
    {
      e.target.src="/images/profileimg.jpg"
    }

    useEffect(()=>
    {
      const clickOutside=(e)=>
      {
      if(signout && logref.current && !logref.current.contains(e.target))
      {
        setsignout(false);
      }
      }
         document.addEventListener("mousedown", clickOutside)
  
    return () => {
      document.removeEventListener("mousedown", clickOutside)
    }
    },[signout])



    useEffect(()=>
    {
      const clickOutside=(e)=>
      {
      if((sref.current && !sref.current.contains(e.target)))
      {
        setOpensearch(false);
      }
      }
      document.addEventListener('mousedown', clickOutside);
    
    return () => {
      document.removeEventListener("mousedown", clickOutside)
    }
    },[openSearch])

  
      useEffect(()=>{
   async function dataUser()
   {
    try{
    const appData=await getDocs(userFire)
    setpicId(appData.docs[0].data().dpUrl)
    }
    catch(err){
      console.log(err)
    }
   }
   dataUser()
  },[])

    return(
        <section id="navbar" ref={sref}>
        <nav>
            <div className="nav-logo"><span><NavLink to="/">vibegram</NavLink></span>
            <p><NavLink to="/">vg</NavLink></p></div>
            <ul className="profile-item">
            <li id="home-link"><NavLink to="/"><FaHome className="nav-icon"/> 
            <span className="nav-name">Home</span></NavLink></li>

             <li onClick={()=>setOpensearch(prev=>!prev)}><FaSistrix 
             className="nav-icon"/> 
             <span className="nav-name">Explore</span></li> 
             
             <li><NavLink to="/chat"><FaEnvelope className="nav-icon"/> 
             <span className="nav-name">Messages</span></NavLink> </li>
            <li onClick={openProfile}><FaIdCard className="nav-icon"/> 
            <span className="nav-name">Profile</span></li>    
            <li><button className="upload-btn"
            type="button"
             data-bs-toggle="modal" 
             data-bs-target="#staticBackdrop"
             onClick={()=>setopenBox(true)}
            ><FaFolderPlus className="nav-icon btn-folder"/> 
            <span className="nav-name">Upload</span></button></li>
            </ul>
            <div className="div-logout">     
                <button className="btn-logout" onClick={()=>setsignout(!signout)}>
                    <img className="log-img"
                     src={picId} alt="" onError={errorImg}/><p>{userName}</p>
            </button>
            </div>
              {signout && <button className="logut-opt"  ref={logref} onClick={logoutBtn}>Logout</button>}
                    
        </nav>
        {openSearch && 
        <div>
        <Search></Search>
        </div>}
        {openbox && <Files openModal={setopenBox} modal={openbox} userName={userName} uidprop={userid}></Files>}
        </section>
    )
}

export default Navbar