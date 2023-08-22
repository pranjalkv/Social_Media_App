import "./Chatbox.css"
import "bootstrap/dist/css/bootstrap.min.css";
// import { useRef } from "react";
import {FaRegPaperPlane} from "react-icons/fa";
import { useState,useEffect ,useRef } from "react";
import { db } from "../../firebase";
import {doc,updateDoc, onSnapshot,arrayUnion} from "firebase/firestore";




function Chatbox({chatDp,roomId,chatnm,userid,recvId})
{

    const chatRef=doc(db,"chat_data",roomId)
    const[msgWrite,setmsgWrite]=useState("")

    const[allChats,setallChats]=useState([])
    const[userChat,setUserchat]=useState(false)
    const[hover,setHover]=useState(-1)
    const msgRef = useRef(null)
    const focref=useRef();

    function writter(e)
    {
        setmsgWrite(e.target.value);
    }
    console.log(msgWrite)
    async function addChats(e)
    {
         const times={
    year: 'numeric',
 	month: 'long',
 	day: 'numeric',
  hour:'numeric',
  minute:'numeric'
  }

  const chatTime=new Date().toLocaleDateString("en-GB",times)


        e.preventDefault();
        try{
    await updateDoc(chatRef,{
      chats:arrayUnion({msg:msgWrite,
      uiduser:userid,
      at:chatTime
      }),
      currMsg:msgWrite
    })
    }
    catch(err)
    {
        alert("caption cannot be changed... Try again later")
    }
    setmsgWrite("")
    focref.current.focus();
    }

    
    useEffect(()=>
    {
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const postChat = snapshot.data();
      setallChats(postChat.chats)
      focref.current.focus();
    });

    return () => unsubscribe();
    },[recvId])

    console.log("Fdsgs",allChats)

    function noImgerr(e)
    {
        e.target.src="/images/profileimg.jpg"
    }
   

useEffect(() => {

 msgRef.current?.scrollIntoView({ behavior: "smooth" })
 }, [allChats]);


    return(
        <>
         <div className="chat-box">
            <div className="chat-header p-2 w-100 d-flex ">
                <img src={chatDp} className="chat-img" alt="" onError={noImgerr}/>
                <h3 className="m-1">{chatnm}</h3>
                </div>
                <div className="all-chats px-1 pt-5 pb-4 w-100">
                    <div className="pt-2 pb-2">
                        {allChats.map((ele,i)=>
                        <div className="d-flex flex-column chats-msg" key={i}
                         onMouseEnter={()=>setHover(i)} 
                         onMouseLeave={()=>setHover(-1)}>
                            <p className={`para-chat  
                        px-2 py-1 
                        mt-1 mb-0 ${ele.uiduser==userid?"send-chat":"recv-chat"}`}>
                            {ele.msg}</p>
                            {hover==i && <p className={`chat-time my-2 
                            ${ele.uiduser==userid?"left-time":"right-time"}`} >{ele.at}</p>}</div>)}
                        {/* <p className="para-chat send-chat px-2 py-1 mt-1 mb-0">fsag</p> */}
                        <div ref={msgRef}></div>
                    </div>                               
                </div>
                <div className="chat-write w-100">
                <form className="w-100 d-flex justify-content-between">
                    <input className="chat-inp p-1 m-1" value={msgWrite} type="text"
                     placeholder="Write your meassage..." onChange={writter} ref={focref} />
                    <button className="chat-btn green-btn p-1" onClick={addChats}>
                        <FaRegPaperPlane/></button>
                </form>
                </div>
        </div>
        </>
    )
}

export default Chatbox;