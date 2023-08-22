import "./Home.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegCommentAlt,FaRegHeart ,FaHeart } from "react-icons/fa";
import Homecomp from "./Homecomp/Homecomp"
import Viewimg from "./Display/Viewimg";
import {useEffect,useState ,useContext} from "react";
import { useNavigate } from "react-router-dom";
import AuthInfo from "./Context/Authcontext";
import { db } from "../firebase";
import { collection,getDocs, query,limit,orderBy,startAfter
   ,doc ,updateDoc ,arrayUnion ,arrayRemove} from "firebase/firestore";




function Home()
{

    const navitoProf=useNavigate()
  const dpData=collection(db,"dp_data")

  const {userid,userName}=useContext(AuthInfo)

  const[homepic,setHomepic]=useState([])
  const[dpPics,setDppics]=useState([])

  const[closePic ,setClosepic]=useState(false)

  const[docid,setDocid]=useState(null)
  const[currid,setCurrid]=useState(null)

   const[loader,setLoader]=useState(false)
  const[lastData,setLastdata]=useState(null);
  const[likedb,setLikedb]=useState([]);
  const[disLike,setDislike]=useState([]);

  const[showMore,setShowmore]=useState(-1);
  

  useEffect(()=>{
      async function fetchData()
    {
    
      const homeImg=query(collection(db,"prof_img"),orderBy("timestamp","desc"),limit(5));

      try{
        setLoader(true)
      const snapshot=await getDocs(homeImg)
        setHomepic(snapshot.docs.map((items)=>({...items.data(),id:items.id})))
          setLastdata(snapshot.docs[snapshot.docs.length - 1].data().timestamp);
          setLoader(false)
  }
  catch(err)
  {
    console.log(err);
    setLoader(false)
  }

  }
    fetchData();
  },[])


 console.log("eit353",lastData)
 console.log("244",homepic)
    useEffect(()=>{
      
      const fetchDp=async()=>
    {
      try
      {
        const dpHold= await getDocs(dpData)
        setDppics(dpHold.docs.map((items)=>({...items.data()})))
      }
      catch(err)
      {
        console.log(err);
      }
    }
    fetchDp()
  },[])


// useEffect(()=>{

    
//    moreLoad();
//    },[hasData])

   async function moreLoad()
   {

    if(lastData)
    {
    const homeImg=query(collection(db,"prof_img"),orderBy("timestamp","desc"),startAfter(lastData),limit(3));
    try{

      setLoader(true)
         const snap=await getDocs(homeImg)
         if(snap.docs.length>0)
         {
        setHomepic(homepic.concat(snap.docs.map((items)=>({...items.data(),id:items.id}))))
        // setLoader(false)
        // setHasdata(false)
          setLastdata(snap.docs[snap.docs.length - 1].data().timestamp); 
         }
         else
         {
          setLastdata(null);
         } 
         setLoader(false)
                // if(snap.docs.length<2)
                // {
                //   setHasdata(false)
                //   setLoader(false)
                // }   
  }
  catch(err)
  {
    console.log(err);
    setLoader(false)
  }
}
   }

  //  useEffect(()=>{

  //   const newImg=query(collection(db,"prof_img"),orderBy("timestamp","desc"));
  //   try{
  //   const getsnap=onSnapshot(newImg,(sn)=>
  //   {
  //     setLikeData(sn.docs.map((lyk)=>({...lyk.data().Likes})))
  //         return ()=>getsnap;
  //   })
  // }
  // catch(err)
  // {
  //   console.log(err);
  // }

  //  },[])

  //  console.log("grsy",likeData)


    console.log("eit3574",lastData)





  function handleScroll()
  {
     if(window.innerHeight + document.documentElement.scrollTop+1 >= document.documentElement.scrollHeight)
      moreLoad()
  }
  
  useEffect(()=>
{
     window.addEventListener("scroll",handleScroll)

     return()=>window.removeEventListener("scroll",handleScroll)
   },[lastData])

function profErr(e)
{
  e.target.src="/images/profileimg.jpg"
}
  function formatDate(sec)
  {

   let options = {
 	year: 'numeric',
 	month: 'long',
 	day: 'numeric',
  hour:'numeric',
  minute:'numeric'
 };

  const timestampDate = new Date(sec * 1000); 
  const formattedDate = timestampDate.toLocaleDateString("en-GB",options);
  return formattedDate;
  }

  async function liker(docid)
  {
      const viewData=doc(db,"prof_img",docid)
    try{
      await updateDoc(viewData,{
      Likes:arrayUnion(userid)
      })
    }
    catch(err)
    {
      console.log(err);
    }
setLikedb((prev) =>
      prev.includes(docid)
        ? prev.filter((id) => id !== docid)
        : [...prev, docid]
    );


}

 async function unlike(docid)
 {
  const viewData=doc(db,"prof_img",docid)
  try{
    
  await updateDoc(viewData,{
       Likes:arrayRemove(userid)
  })   
    }
       catch(err)
    {
      console.log(err);
    }
setDislike((prev) =>
      prev.includes(docid)
        ? prev.filter((id) => id !== docid)
        : [...prev, docid]
    );
}
function opentheProf(profid)
{
       navitoProf(`/profile/${profid}`)
}
function openMainImg(data)
{
  setClosepic(true)
setDocid(data.id);
setCurrid(data.uid);
}


  if(closePic)
    document.body.style.overflow="hidden";

    if(!closePic)
    document.body.style.overflow="auto"


  console.log(homepic)
    return (      
    <section id="home-page">
      <div className="compHome">
      <Homecomp></Homecomp>
      </div>
    <div>
      {homepic?.map((ele,i)=><div className="each-hero" key={ele?.id}>
        <div className="d-flex align-items-center p-2">
        {dpPics?.filter((dp)=>(ele.uid==dp.uid)).map((filterDp)=><img className="user-hero-dp" 
        src={filterDp.dpUrl} alt="" onClick={()=>opentheProf(ele.uid)} onError={profErr}/>)}
        <div className="w-100 d-flex flex-column mx-1">
        <p className="hero-name m-0" onClick={()=>opentheProf(ele.uid)}>{ele.nameid}</p>
        <p className="hero-time m-0">{formatDate(ele.timestamp.seconds)}</p>
        </div>
        </div>
        <div>
          <p className="mx-2">{showMore==i ? ele?.caption : ele?.caption.slice(0,100)}
          {ele?.caption.length>100 && <button
          className="show-more-btn my-1" onClick={()=>setShowmore(i)}>{showMore==i?"":"...show more"}</button>}</p>
        </div>
        <img className="hero-imgs" src={ele.photoUrl} alt="" onClick={()=>openMainImg(ele)} loading="lazy" />
           <div className="d-flex justify-content-between mx-2 like-cmt-hero">
                        <p><FaHeart style={{color:"#00A676"}}/><span
                         className="mx-1">{likedb.includes(ele.id)?`You and ${ele.Likes.length} other`:ele.Likes.length}</span></p>
                        <p><span className="mx-1">{ele.comment.length}</span><FaRegCommentAlt/></p>
                        </div>

                        <div className="d-flex justify-content-around hero-info-btn" key={ele.id}>

                              {ele.Likes.includes(userid)?<button className="btn 
                              hact" key={ele.id}
                            onClick={()=>unlike(ele.id)}>
                              {!disLike.includes(ele.id)? <span><FaHeart style=
                              {{color:"#00A676",marginRight:"2px"}} />Liked</span>:
                              <span><FaRegHeart style={{color:"#00A676",marginRight:"2px"}} />Like</span>}
                              </button>:
                             
                            <button className="btn hact" key={ele.id}
                            onClick={()=>liker(ele.id)}>
                              {likedb.includes(ele.id)?<span><FaHeart style=
                              {{color:"#00A676",marginRight:"2px"}} />Liked</span>:
                              <span><FaRegHeart style={{color:"#00A676",marginRight:"2px"}} />Like</span>}
                           
                            </button>}
                              
                              <button className="btn hact" onClick={()=>openMainImg(ele)}>
                              <FaRegCommentAlt /> Comment</button>
                        </div>
                        {closePic && <Viewimg docid={docid}
         crossClose={setClosepic} pguid={currid}
         changeDpv={"abc"} authid={userid} authname={userName}></Viewimg>}
         <div></div>
      </div>)}
      {/* <div className="d-flex justify-content-center"><button onClick={handleScroll}>Load More</button></div> */}
    </div>
   {loader && <div className="d-flex justify-content-center my-2">
  <div className="spinner-border text-success" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
</div>}
{/* {!snapLen && <div className="text-center" style={{color:"#b8b6b6"}}>No more data</div>} */}
    </section>
  )
}

export default Home
