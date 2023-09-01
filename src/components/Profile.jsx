
import { useEffect, useState,useRef, useContext } from "react";
import AuthInfo from "./Context/Authcontext";
import "./Profile.css";
import Imgprof from "./Imgprof";
import Loadspin from "./Loadspin";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { db,storage} from "../firebase";
import { doc,collection,getDocs,query,where,updateDoc, arrayUnion ,arrayRemove,onSnapshot} from "firebase/firestore";
import { ref,uploadBytes,getDownloadURL} from "firebase/storage";
import { v4 } from "uuid";



function Profile()
{
  
  const mref=useRef();
  const popref=useRef();
  const editRef=useRef();
  const fileRef=useRef(null);
  const {pguid}=useParams();
  const dpFire=query(collection(db,"dp_data"),where("uid",'==' ,pguid))
  
  
  const[userProfile,setUserprofile]=useState([]);
  const[changePro,setChangepro]=useState(false)
  const[changeDp,setchangeDp]=useState(null)
  const[docId,setdocId]=useState(null)
  const[spin,setSpin]=useState(false);
  const[fol,setFol]=useState(false)
  const[foldId,setfoldId]=useState("")
  const[unfolalert,setunfolalert]=useState(false);
  const[folSpin,setfolSpin]=useState(false)

  const{userid,userName}=useContext(AuthInfo)
  
  const[yourBio,setyourBio]=useState("");
  const[editOpen,seteditOpen]=useState(false)
  const[save,setSave]=useState(true)
  const[youFol,setyouFol]=useState(0);
  const[folyou,setFolyou]=useState(0);
  const[postsize,setPostsize]=useState(0);

   

  useEffect(()=>{
     async function lengthPost()
  {    
    const postLen=query(collection(db,"prof_img"),where("uid",'==' ,pguid))
    const len = await getDocs(postLen);
  setPostsize(len.size)
  }

  lengthPost();
  },[pguid])

  function proFn()
  {
      fileRef.current.click();
  }

     function updateChange(e)
     {
      e.preventDefault()
      e.stopPropagation();
    const dpu=e.target.files[0]
     if(!dpu)return

      const proRef=ref(storage,`profileDp/${pguid}/${dpu.name+v4()}`)
      const updateDp=doc(db,"dp_data",docId)
     uploadBytes(proRef,dpu).then(async()=>
     {
          const upDp=await getDownloadURL(proRef,dpu);
          setSpin(true)
           await updateDoc(updateDp,{
          dpUrl:upDp
    })
    setSpin(false);
    setchangeDp(upDp);
    setChangepro(false)

  })
    
        .catch((err)=>
        {
          alert("Sorry ,An error occurred ,please try agin later")
          console.log(err)
          setChangepro(false)
        })
      
    }

      useEffect(()=>{
   async function dataUser()
   {
    const userFireprof=query(collection(db,"dp_data"),where("uid",'==' ,userid))
    try{
    const appData=await getDocs(userFireprof)
    setfoldId(appData.docs[0].id)
  
    }
    catch(err){
      console.log(err)
    }
   }
   dataUser()
  },[])

  useEffect(() => {
    const checkOutside = e => {
      if (changePro && mref.current && !mref.current.contains(e.target))
      {
        setChangepro(false)
        
      }
    }
    document.addEventListener("mousedown", checkOutside)
  
    return () => {
      document.removeEventListener("mousedown", checkOutside)
    }
  }, [changePro])

   useEffect(() => {
    const checkOutside = e => {
      if (unfolalert && popref.current && !popref.current.contains(e.target))
      {
        setunfolalert(false)
      }
    }

    document.addEventListener("mousedown", checkOutside)
  
    return () => {
      document.removeEventListener("mousedown", checkOutside)
    }
  }, [unfolalert])

     useEffect(() => {
    const checkOutside = e => {
      if (editOpen && editRef.current && !editRef.current.contains(e.target))
      {
        seteditOpen(false)
      }
    }

    document.addEventListener("mousedown", checkOutside)
  
    return () => {
      document.removeEventListener("mousedown", checkOutside)
    }
  }, [editOpen])

    if(changePro)
     document.body.style.overflow = 'hidden';

      if(!changePro)
      document.body.style.overflow = 'auto';
console.log(pguid,"gd")
  // useEffect(()=>
  // {
  //  const getProf= async()=>
  //   {
  //     try{
  //     const profData=await getDocs(profFire)
  //     setUserprofile(profData.docs[0].data().name)
  //     }
  //     catch(err)
  //     {
  //       console.log("Failed to fetch data",err);
  //     }
  //  }
  //   getProf();
  // },[])

  useEffect(()=>{

    const getDp=async()=>
  {
    try
    {
      const dpPic=await getDocs(dpFire)
      setchangeDp(dpPic.docs[0].data().dpUrl)
      setUserprofile(dpPic.docs[0].data())
      setdocId(dpPic.docs[0].id)
      setyourBio(dpPic.docs[0].data().bio)
      if(dpPic.docs[0].data().followers.some(obj => obj.folid == userid)===true)
      {
        setFol(true);
      }
      else
      {
        setFol(false)
      }
    }
    catch(err)
    {
      console.log("failed to fetch dp data")
    }
  }
  getDp()
  setChangepro(false)
  },[pguid])

  
    useEffect(()=>
    {
    const unsubscribe = onSnapshot(dpFire, (snap) => {
      const postData = snap.docs[0].data();
      setFolyou(postData.followers.length);
      setyouFol(postData.follow.length);

    })
    return () => unsubscribe();
    },[pguid])


  async function removeDp()
  {
    const updateDp=doc(db,"dp_data",docId)
    setSpin(true)
    await updateDoc(updateDp,{
      dpUrl:"abc"
    })
    setSpin(false)
    setchangeDp("abc")
    setChangepro(false)
  }

  async function getFollow()
  {
    try
    {
      const dpFollowers=doc(db,"dp_data",docId)
      setfolSpin(true)
      await updateDoc(dpFollowers,{
        followers:arrayUnion({folname:userName,folid:userid})
    })
    const userFollow=doc(db,"dp_data",foldId)
    await updateDoc(userFollow,{
      follow:arrayUnion({yourfol:userProfile.name,yourfolid:pguid})
    })
    setFol(true)
    setfolSpin(false)
  }
    catch(err)
    {
      console.log(err)
    }
    
  }

  function unfollow()
  {
   setunfolalert(true);
  }

  async function confirmUnf()
  {
    try
    {
      const dpFollowers=doc(db,"dp_data",docId)
      setfolSpin(true)
      await updateDoc(dpFollowers,{
        followers:arrayRemove({folname:userName,folid:userid})
    })
    const userFollow=doc(db,"dp_data",foldId)
    await updateDoc(userFollow,{
      follow:arrayRemove({yourfol:userProfile.name,yourfolid:pguid})
    })
    setFol(false)
    setunfolalert(false)
    setfolSpin(false)
  }
    catch(err)
    {
      console.log(err)
    }
    
  }

  function profEditor()
  {
    seteditOpen(true)
  }

  async function btnAddBio()
  {
    const updateBio=doc(db,"dp_data",docId)
    try{
    setSpin(true)
    await updateDoc(updateBio,{
      bio:yourBio.slice(0,200)
    })
     setSpin(false)
  }
  catch(err)
  {
    console.log(err);
  }
  seteditOpen(false)
  }

  function changeBio(e)
  {
    setyourBio(e.target.value)
    setSave(false);
  }

  async function btnremBio()
  {
   const updateBio=doc(db,"dp_data",docId)
    try{
    setSpin(true)
    await updateDoc(updateBio,{
      bio:""
    })
     setSpin(false)
  }
  catch(err)
  {
    console.log(err);
  }
  seteditOpen(false)
  }

  function lengthFn(len)
  {
    if(len>200)
    {
      len=(200-len)
    }

    return len
  }

    return(
        <section id="user-profile">
          {userProfile.name?<div className="div-under-profile">
        <div id="main-profile">
        <img src={changeDp!=="abc" ?changeDp:"/images/profileimg.jpg"} alt="" 
        className="profile-picture"  onClick={()=>setChangepro(true)}
        onError={(e)=>e.target.src="/images/profileimg.jpg"}/>
         <div className="profile-page">
      <div className="profile-header">
        <h1 className="prof-name">{userProfile.name}</h1>
        {userid==pguid ?<button className="edit-pro-btn" onClick={profEditor}>Edit Profile</button>:
        <button className={`follow-pro-btn ${fol?"follow-done":""}`}
         onClick={!fol?getFollow:unfollow}>{fol ?"Following":"Follow"}</button>}
         {folSpin && <div className="spinner-border text-success mx-3" role="status">
  <span className="visually-hidden">Loading...</span>
</div>}
      </div>
      <div className="div-follow">
        <p><span className="profile-user">{postsize} </span>Posts</p>
        <p><span className="profile-user">{folyou} </span>Followers</p>
        <p><span className="profile-user">{youFol} </span>Following</p>
      </div> 
      <p className="bio-part text-turncate">{userProfile?.bio}</p>
    </div>
    <div className="photo-heading"><p>PHOTOS</p></div>
    </div>
    <hr />
{spin && <Loadspin></Loadspin>}
{(changePro && pguid==userid) && <div className="changeImg" >
   <div className="card" style={{ width: "18rem" }} ref={mref}>
  <div className="card-header" style={{ fontWeight: "600" }}>Change Profile Picture</div>
  <ul className="list-group list-group-flush">
    <button className="list-group-item" 
    style={{color:"#0096FF",fontWeight: "600"}}
    onClick={proFn}>Upload Photo</button>

     <input
        type="file"
         accept="image/*"
        id="fileInput"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={updateChange}
      />

    {(changeDp!=="abc" && changeDp!==null) && <button className="list-group-item" 
    style={{color:"red",fontWeight: "600"}}
    onClick={removeDp}>Remove Photo</button>}

    <button className="list-group-item" 
    onClick={()=>setChangepro(false)}>Cancel</button>
  </ul>
</div>
</div>}
</div>:<div className="err-noProf"><p></p><p>Sorry the particular user does not exist</p></div>}

{unfolalert && <div className="unfollow-div d-flex justify-content-center align-items-center" >
        <div className="card" ref={popref} >
  <div className="card-header">Alert!</div>
  <div className="card-body">
       <h5 className="card-text">Are you sure you want unfollow {userProfile.name}</h5>
       <div className="w-100 py-2">
    <button className="btn btn-danger btn-sm w-25" onClick={confirmUnf}>
      Yes
    </button>
     <button className="btn btn-secondary btn-sm  w-25" style={{marginLeft:"6px"}} 
     onClick={(e)=>setunfolalert(false)}>
      No
    </button>
    </div>
  </div>
</div>
</div>}

        {editOpen && <div className="editProfile d-flex justify-content-center align-items-center">
        <div className="card w-50"  ref={editRef}>
  <div className="card-header">Change your Bio</div>
  <div className="card-body">
      <textarea className="bio-area" type="text" 
      placeholder="Tell us about yourself" value={yourBio}
       onChange={changeBio} 
      required/>
      <p className="text-end"  style={{color:"#898888"}}>{lengthFn(yourBio.length)}/200</p>
    <button className="btn btn-success mx-2" onClick={btnAddBio} disabled={save}>
      Save
    </button>
   {userProfile.bio!=="" && <button className="btn btn-danger" onClick={btnremBio}>
      Remove Bio
    </button>}
     <button className="btn btn-secondary mx-2" style={{marginLeft:"6px"}} 
     onClick={()=>{
     seteditOpen(false)}}>
      Cancel
    </button>
  </div>
</div>
</div>}

    <Imgprof pguid={pguid}
     authid={userid} authname={userName}/>
    </section>
    )
}

export default Profile;