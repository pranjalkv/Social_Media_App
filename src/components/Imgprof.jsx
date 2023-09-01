import { useEffect, useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaCommentAlt,FaHeart} from "react-icons/fa";
import { collection,onSnapshot,orderBy,query,where ,getDocs } from "firebase/firestore";
import { db, } from "../firebase";
import "./Imgprof.css"
import Viewimg from "./Display/Viewimg";



function Imgprof({pguid,authid,authname})
{
    const[closeImg,setCloseimg]=useState(false)
    const[docid,setDocid]=useState(null)
    const[iUid,setiUid]=useState(null)
    const[hover,setHover]=useState("");
    function fullView(imgCick)
    {
       
        setCloseimg(true);
        setDocid(imgCick.id);
        setiUid(imgCick.uid);
    }

    const[allImg,setAllimg]=useState([])
    const imgStore=query(collection(db,"prof_img"),where("uid",'==' ,pguid),orderBy("timestamp","desc"))

    
    useEffect(()=>
    {
       
                const imgData= onSnapshot(imgStore,(snap)=>{
                setAllimg(snap.docs.map((doc) => ({...doc.data(),id:doc.id})))
                })    
                return ()=>imgData;
        
    },[pguid])



    function imgError(e)
    {
        e.target.src="/images/noimg.jpg"
    }

    if(closeImg)
    document.body.style.overflow="hidden";

    if(!closeImg)
    document.body.style.overflow="auto"
    return(
        <>
        <div id="gallery">
        <div className="img-prof-div">
        {allImg?.map((ele,i)=><div className="img-each-div" onMouseEnter={()=>setHover(ele.id)}
         onMouseLeave={()=>setHover("")} onClick={()=>fullView(ele)}>
            <LazyLoadImage className="picsum-img" 
        src={ele.photoUrl} key={ele.id} id={ele.id} alt="" slot={ele.uid}
        onError={imgError}/>
        {hover==ele.id && <div className="img-hover-div">
            <p><FaHeart/>&nbsp;{ele?.Likes.length}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p><FaCommentAlt/>&nbsp;{ele?.comment.length}</p>
        </div>}
        </div>)} 
        </div>
        </div>
        {closeImg && <Viewimg docid={docid}
         crossClose={setCloseimg} pguid={pguid}
        authid={authid} authname={authname}></Viewimg>}
        </>
    )

}

export default Imgprof;