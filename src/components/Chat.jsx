import "./Chat.css"
import { useState ,useEffect ,useContext} from "react";
import {FaComments} from "react-icons/fa";
import AuthInfo from "./Context/Authcontext"
import { db } from "../firebase";
import {setDoc,getDocs, collection,getDoc,limit, query,where,doc,or} from "firebase/firestore";
import Chatbox from "./Homecomp/Chatbox";


function Chat()
{
 const{userid,userName}=useContext(AuthInfo)
 const[openBox,setOpenbox]=useState(false)
 const[recvId,setrecvId]=useState("")
 const[chatDp,setChatdp]=useState("")
 const[chatnm,setchatnm]=useState("")
 const[roomId,setroomId]=useState("")
 const[chatHis,setchatHis]=useState([])

 const dp_all=query(collection(db,"dp_data"),where("uid","!=",userid),limit(10))
 const chat_user=query(collection(db,"chat_data"),or(where("user1","==",userid),where("user2","==",userid )))
    // const dp_all=query(collection(db,"dp_data"),where('name','<',"Guest 001"),where('dpUrl','==',"abc"))
    const[fewData,setFewdata]=useState([])

    function goProf(e)
    {
          e.stopPropagation()
        console.log(e)
    }



    async function chatOpen(id2,dp,nameChat)
    {
        try
        {
            
        
        const bothId=userid>id2? userid+id2 : id2+userid
        setrecvId(id2)
        setChatdp(dp)
        setchatnm(nameChat)
        setOpenbox(true)
        setroomId(bothId);
        const dataChat=await getDoc(doc(db,"chat_data",bothId))
        if(!dataChat.exists())
        {
           await setDoc(doc(db,"chat_data",bothId),
            {
                user1:userid,
                user2:id2,
                chats:[],
            })
        }
       }
       catch(err)
       {
        console.log(err);
       }
    }

    useEffect(()=>
    {
        async function getChathis()
        {
            try
            {
                const datachats=await getDocs(chat_user)
                setchatHis(datachats.docs.map((ele)=>({...ele.data(),id:ele.id})))
            }
            catch(err)
            {
                console.log(err)
            }
        }
        getChathis()
    },[])
    console.log("cahtasf",chatHis)
    useEffect(()=>
    {
       const getFew=async()=>
        {
            try
            {
                const data=await getDocs(dp_all)
                setFewdata(data.docs.map((ele)=>({...ele.data(),iddp:ele.id})))
            }
            catch(err)
            {
                console.log(err);
            }
        }
        getFew()
    },[])
    console.log(fewData)

    return(
    <>
    <section id="app-chat">
         <section id="chat-user">
        {fewData.map((item)=>(<div className="div-chat-user py-1" key={item.iddp} 
         onClick={()=>chatOpen(item.uid,item.dpUrl,item.name)}>
        <img className="chat-user-img" src={item.dpUrl} alt="" 
         onError={(e)=>e.target.src="/images/profileimg.jpg"}  id={item.uid} onClick={goProf}/>
        <div className="info-chat">
        <p className="name-chat-user mb-0 text-truncate">{item.name}</p>
        {chatHis.filter((curr)=>(curr.id==item.uid +userid || curr.id==userid + item.uid)).map((msg,i)=><p 
        className="last-msg mx-1" key={i}>{msg.currMsg}</p>)}
        </div>
        </div>))}
        </section>
        {openBox ? <Chatbox chatDp={chatDp} roomId={roomId} userid={userid} 
        recvId={recvId} chatnm={chatnm}></Chatbox>:
        <div className="no-box">
            <h1><FaComments size="1.5em"/></h1>
            <h3>Start a conversation by clicking on a user</h3>
        </div>}
    </section>
    </>
    )
}

export default Chat;