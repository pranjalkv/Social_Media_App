import "bootstrap/dist/css/bootstrap.min.css";
import "./Viewimg.css"
import { FaRegCommentAlt ,FaRegPaperPlane,FaRegHeart ,FaHeart ,FaTimes} from "react-icons/fa";
import { useEffect, useState ,useRef } from "react";
import { doc, getDoc,getDocs,updateDoc,deleteDoc, onSnapshot,arrayUnion, arrayRemove, collection} from "firebase/firestore";
import { db } from "../../firebase";
import { v4 as cid} from "uuid";
import Loadspin from "../Loadspin";

 function Viewimg({crossClose,docid,authid,authname,pguid})
 {
    const mref=useRef();
    const fref=useRef();
    const viewData=doc(db,"prof_img",docid)
    const viewDp=collection(db,"dp_data")
    const [like,setLike]=useState(null);
    const[totalLike,settotalLike]=useState(0)
    const[views,setViews]=useState(null)
    const[openEdit,setopenEdit]=useState(false)
    const[getCaption,getsetCaption]=useState("")
    const[editC,setEditc]=useState(false)
    const[spin,setSpin]=useState(false)
    const[openDel,setopenDel]=useState(false)
    const[sumComnt,setSumcomnt]=useState(0)
    const[cmnt,setCmnt]=useState("")
    const[comData,setcomData]=useState(null);
    const[write,setWrite]=useState(true)
    const[dpPics,setDppics]=useState([])

function captionChange()
{

}
    function openCedit()
    {
        setEditc(true)
    }

    useEffect(()=>
    {
         const getView=async()=>
        {
            try{
                const viewImg=await getDoc(viewData)
                setViews(viewImg.data())
                getsetCaption(viewImg.data().caption)
                if(viewImg.data().Likes.includes(authid))
      setLike(true)
      else
      setLike(false)
            }
            catch(err)
            {
                console.log("failed to load images",err)
            }
        }
        getView()
    },[])

    useEffect(()=>
    {
    const unsubscribe = onSnapshot(viewData, (snapshot) => {
      const postData = snapshot.data();
      settotalLike(postData.Likes.length);
      setSumcomnt(postData.comment.length);
      setcomData(postData.comment);
    });

    return () => unsubscribe();
    },[])

        useEffect(()=>{
      
      const fetchDp=async()=>
    {
      try
      {
        const dpHold= await getDocs(viewDp)
        setDppics(dpHold.docs.map((items)=>({...items.data()})))
      }
      catch(err)
      {
        console.log(err);
      }
    }
    fetchDp()
  },[])

     if (!views) {
    return <Loadspin/>;
  }

  if (!views.timestamp || typeof views.timestamp !== 'object') {
    return <p>data not available</p>;
  }


  const { seconds } = views.timestamp; 

   let options = {
 	year: 'numeric',
 	month: 'long',
 	day: 'numeric'
 };

  const timestampDate = new Date(seconds * 1000); 
  const formattedDate = timestampDate.toLocaleDateString("en-GB",options);

  function captionChange(e)
  {
    getsetCaption(e.target.value)
    setWrite(false);
  }

  async function updateCap(e)
  {
    e.preventDefault();
    e.stopPropagation();
    setSpin(true)
    try{
    await updateDoc(viewData,{
      caption:getCaption
    })
    }
    catch(err)
    {
        alert("caption cannot be changed... Try again later")
    }
             setSpin(false)
     setEditc(false)
     crossClose(false)
    
  }

  async function deleteImg()
  {
    setSpin(true)
    try
    {
      await deleteDoc(viewData)
      alert("Image Deleted");
    }
    catch(err)
    {
      alert("Try again Later");
    }
    setSpin(false)
    setopenDel(false);

  }

async function liker()
  {
    try{
      await updateDoc(viewData,{
        Likes:arrayUnion(authid)
      })
      setLike(true)
    }
    catch(err)
    {
      console.log(err);
    }
 }

 async function unlike()
 {
  try{
  await updateDoc(viewData,{
        Likes:arrayRemove(authid)
      })
   setLike(false)
   
    }
       catch(err)
    {
      console.log(err);
    }
}

function focusCmnt()
{
  fref.current.focus();
}

function handleCmnt(e)
{
  setCmnt(e.target.value);
}

async function postCmnt(e)
{
  const ctime={
    year: 'numeric',
 	month: 'long',
 	day: 'numeric',
  hour:'numeric',
  minute:'numeric'
  }

  const ctimefomrat=new Date().toLocaleDateString("en-GB",ctime)

  e.preventDefault()
    try{
  await updateDoc(viewData,{
        comment:arrayUnion({comment:cmnt,
       nam:authname,
          uid:authid,
        comid:cid(),
      createat:ctimefomrat})
      })
    }
       catch(err)
    {
      console.log(err);
    }
    setCmnt("")

}
function placeImg(e)
{
  e.target.src="/images/profileimg.jpg"
}

    return(
        <section id="image-popup">
          {spin && <Loadspin></Loadspin>}
             <div className="image-dis" ref={mref}>
                <button className="btnclose" 
                onClick={()=>crossClose(false)}>
                    <FaTimes /></button>
            <div className="image-container d-flex align-items-center row">
                <div className="img-dis-div col-lg-9 col-md-9 col-sm-12 d-flex justify-content-center">
                  <img src={views?.photoUrl} className="image-part" alt=""  />
                </div>
                <div className="img-info-div col-lg-3 col-md-3 col-sm-12">
                    <div className="info-part">
                        <div className="editor d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                      {dpPics?.filter((dp)=>(dp.uid==views.uid)).map((filterDp,i)=><img className="profile-img-info" 
                      src={filterDp.dpUrl} key={i} alt="" onError={placeImg} />)}
                         <div className="info-time-name">
                        <p className="nameid">{views?.nameid}</p>
                        <p>{formattedDate}</p>
                         </div>
                        </div>
                        <div>
                              {(pguid==authid) && <button  className="btn btn-outline-dark btn-sm"
                              onClick={()=>setopenEdit(!openEdit)}>Edit</button>}
                        </div>
            {openEdit && <ul className="btn-modal-list list-group" ref={mref}>
  <li className="list-group-item" style={{color:"#00A676"}}
  onClick={openCedit}>Edit caption</li>
  <li className="list-group-item" style={{color:"red"}}
  onClick={()=>{setopenDel(true)}}>Delete</li>
  <li className="list-group-item" style={{color:"#475b5a"}}
  onClick={()=>setopenEdit(false)}>Cancel</li>
   </ul>}
                        </div>
                        <p>{views?.caption}</p>

                            <div className="d-flex justify-content-between like-cmt">
                        <p><FaHeart style={{color:"#00A676"}}/> <span>{totalLike}</span></p>
                        <p><FaRegCommentAlt/> <span>{sumComnt}</span></p>
                        </div>

                        <div className="d-flex justify-content-around div-info-btn">
                            <button className="btn act liker"
                            onClick={!like?liker:unlike}>{!like ?<FaRegHeart 
                              style={{color:"#00A676",marginRight:"2px"}}/>:
                              <FaHeart style={{color:"#00A676",marginRight:"2px"}}/>} 

                            {!like?"Like":"Liked"}</button>


                            <button className="btn act comnt" onClick={focusCmnt}>
                              <FaRegCommentAlt /> Comment</button>
                        </div>
                        
                        <div className="all-comment">
                         
                         {comData.map((ele)=><article className="info-comment mb-1" key={ele.comid}>
                          <div className="d-flex">
                            {dpPics.filter((dp)=>(dp.uid==ele.uid)).map((ele)=><img className="comnt-img"
                             src={ele.dpUrl} alt="" onError={placeImg}/>)}
                        <p className="comnt-name">{ele?.nam}
                        <span>&nbsp;{ele.comment}</span>
                        </p>
                        </div>
                         <p className="time-comment mb-0 p-0">{ele.createat}</p>
                        
                         </article>)}
                         </div>

                         <div className="div-comment-box">
                         <div className="comment-box">
      <div className="input-wrapper">
        <textarea
          className="comment-input"
          placeholder="Write a comment..."
          value={cmnt}
          ref={fref}
          onChange={handleCmnt}
        />
        <button className={`post-button ${!cmnt?"noClk":""}`} onClick={postCmnt}>
          <FaRegPaperPlane/></button>
      </div>
    </div>
    </div>
                    </div>
                </div>
            </div>
        </div>

        {editC && <div className="editC d-flex justify-content-center align-items-center">
        <div className="card">
  <div className="card-header">Edit Caption</div>
  <div className="card-body">
      <textarea className="edit-area" type="text" 
      placeholder="Add a description..." value={getCaption} onChange={captionChange} required/>
    <button className="btn btn-success" onClick={updateCap} disabled={write}>
      Save
    </button>
     <button className="btn btn-secondary" style={{marginLeft:"6px"}} 
     onClick={()=>{setEditc(false)
     setopenEdit(false)}}>
      Cancel
    </button>
  </div>
</div>
</div>}

        {openDel && <div className="deleteImg d-flex justify-content-center align-items-center">
        <div className="card">
  <div className="card-header">Alert!</div>
  <div className="card-body">
       <h5 className="card-text">Are you sure you want delete this Image</h5>
       <div className="w-100">
    <button className="btn btn-danger btn-sm w-25" onClick={deleteImg}>
      Yes
    </button>
     <button className="btn btn-secondary btn-sm  w-25" style={{marginLeft:"6px"}} 
     onClick={()=>{setopenDel(false)
     setopenEdit(false)}}>
      No
    </button>
    </div>
  </div>
</div>
</div>}
        </section>
    )
 }

 export default Viewimg