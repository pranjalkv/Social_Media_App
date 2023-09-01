
import "bootstrap/dist/css/bootstrap.min.css";
import "./Files.css";
import { useEffect, useState } from 'react';
import { db,storage } from '../firebase';
import { collection,addDoc,FieldValue,serverTimestamp} from "firebase/firestore";
import { ref,uploadBytes,getDownloadURL,uploadBytesResumable} from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";


function Files({modal,openModal,uidprop,userName})
{
    const[image,setImage]=useState(null)
    const[caption,setCaption]=useState("")
    const[prog,setProg]=useState(0)
    const navigate=useNavigate()

    function choose(e)
    {
        if(e.target.files[0])
        {
            setImage(e.target.files[0])
        }
        if(image!==null)
        {
          e.target.title=""
        }
    }
    function addCaption(e)
    {
      setCaption(e.target.value)
    }


    function uploadImage(e)
    {
        e.preventDefault()
        if(image===null)
        return;
        const imgRef=ref(storage,`app_img/${uidprop}/${image.name+v4()}`)
        const uploadTask=uploadBytesResumable(imgRef,image)

        uploadBytes(imgRef,image).then(async()=>
        {
          const photoUrl=await getDownloadURL(imgRef);
           await addDoc(collection(db, "prof_img"),{
            photoUrl,
            caption,
            timestamp:serverTimestamp(FieldValue),
            uid:uidprop,
            nameid:userName,
            Likes:[],
            comment:[]
          })
          navigate(`/profile/${uidprop}`)
        })
        .catch((err)=>
        {
            alert(err.message)
        })
                uploadTask.on(
    "state_changed",
    (snapshot)=>{
      var percent = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
      setProg(percent)
    },
    (error) => {
        console.error('Error uploading photo:', error);
      },()=>{
      setProg(100);
      alert("Image uploaded successfully!")
            setCaption('');
        setImage(null);
        openModal(false)
      });
  }
    return(
        <>


  {modal && <div
    className="modal fade show"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabIndex={-1}
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
    style={{display:"block"}}
  >
    <div className="modal-dialog show">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="staticBackdropLabel">
            Upload Photo
          </h1>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={()=>openModal(false)}
          />
        </div>
       
          <div className="modal-body">
         <textarea className="text-area" label="Caption here" 
         variant="filled" placeholder="Your caption" value={caption}
         onChange={addCaption}/>
         {image && <div className="div-upload"><img className="upload-img"
          src={URL.createObjectURL(image)}/>
         <button className="btn btn-outline-light remove-btn btn-sm" 
         onClick={()=>{setImage(null)}}>Remove</button>
         </div>}
         <input className="file-input" type="file" 
         accept="image/*" value={image===null ? "":""} onChange={choose}/>
      </div>
  
     <div className="modal-footer">
          {prog===0 || prog===100  ? (<button type="button" className="btn green-btn"
        onClick={uploadImage}
        disabled={image && prog!==100 ? false:true}>
            {prog===100?"Done":"Upload"}
          </button>):
           (<button className="btn prog-bar-btn green-btn" type="button"> 
           <span className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"/>&nbsp;{prog}%</button>)}
        </div>
      </div>
    </div>
  </div>}
        </>
    )
}
export default Files;