import Navbar from "./components/Navbar"
import './App.css'
import Home from "./components/Home"
import { Routes,Route } from "react-router-dom"
import Signup from "./components/Signup"
import Front from "./components/Front"
import {auth} from "./firebase"
import { useState,useEffect } from "react"
import Profile from "./components/Profile"
import Error from "./components/Error"
import Loadspin from "./components/Loadspin"
import Chat from "./components/Chat"
import AuthInfo from "./components/Context/Authcontext"
import { onAuthStateChanged } from "firebase/auth"



function App() {

  
    const [userName, setUserName] = useState("");
    const [userid,setUserid]=useState("");
    const[loader,setLoader]=useState(true);

  useEffect(() => {
    const log= onAuthStateChanged(auth,(user) => {
      if (user) {
        setUserName(user.displayName);
        setUserid(user.uid)
      } else
       setUserid("");
       setLoader(false);
    });
     return () => log();
  }, []);

  if(loader)
  {
    return <Loadspin/>
  }
  return (
    <>
    {userid && <Navbar userName={userName} setUserName={setUserName} userid={userid} ></Navbar>}

<AuthInfo.Provider value={{userid,userName}} >
    <Routes>
      <Route path="/"
      element={<>{userid!=="" ? <div><Home></Home>
    </div> :<div><Front></Front></div>}</>}></Route>
      {/* <Route path="/user" element={<>{userid ? <User /> : <User notLog={true} />}</>}></Route> */}
      <Route path="/signup" element={<>{userid ? <Home/>: <Signup/>}</>}></Route>  
      <Route path="/profile/:pguid" element={<>{userid ? <Profile/>: <Front/>}</>}></Route>
      <Route path="/chat" element={<>{userid ? <Chat/>:<Front/>}</>}></Route>
      <Route path="/profile/*" element={<Error/>}></Route>
    </Routes>
    </AuthInfo.Provider>
   
    </>
  )
}

export default App
