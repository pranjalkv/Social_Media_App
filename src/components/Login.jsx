import "./Login.css"
import { auth,provider,db } from "../firebase";
import { signInWithEmailAndPassword  ,signInWithPopup} from "firebase/auth";
import { collection,addDoc} from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useState } from "react";

function Login({notLog})
{
     const [cred, setCred] = useState( {
    email: "",
    password: ""})

     const[errorMsg,setErrormsg]=useState("")
    const[disbtn,setDisbtn]=useState(false);

     function changer(e)
    {
        setCred({...cred,[e.target.name]:e.target.value})
        setErrormsg("");
    }

    function handleSubmit(e)
    {
      e.preventDefault()
      if(cred.email ==="" || cred.password === "")
      {
        setErrormsg("Please fill all the feilds")
        setDisbtn(false)
        return;
      }
       setDisbtn(true);
    signInWithEmailAndPassword(auth, cred.email, cred.password)
      .then(async (res) => {
        setDisbtn(false);
      })
      .catch((err) => {
        setDisbtn(false);
        setErrormsg(err.message);
      });
  };

  function handleGlog(e)
  {
    e.preventDefault()

    signInWithPopup(auth,provider).then(async (data)=>{

      if(data._tokenResponse.isNewUser){
      await addDoc(collection(db, "dp_data"),{
        email:data.user.email,
        name:data.user.displayName,
        uid:data.user.uid,
        dpUrl:"abc",
        bio:"",
        follow:[],
        followers:[]
      });
      }
      console.log("da",data)
    })
    .catch((err)=>{
      setErrormsg(err.message)
    })

  }
    return(
        <div className={`login-page ${notLog ?"overlay-login":""}`}>
        <form>                                              
      
      <input
          label="Email"
          type="email"
          name="email"
          value={cred.email}
          placeholder="Enter email address"
        onChange={changer}
        />
        <input
          label="Password"
          type="password"
          name="password"
          value={cred.password}
          placeholder="Enter password"
          onChange={changer}
        />
            <button className="login-btn" onClick={handleSubmit} disabled={disbtn}>
            Login
          </button>
          <p className="error-msg">{errorMsg}</p>
         <hr />
           <button className="google-btn" onClick={handleGlog} disabled={disbtn}>
            <FcGoogle/> Continue with Google
          </button>
        <p>Don't have an account <Link to="/signup">Signup</Link></p>      

    </form>
    <hr />
    <p style={{marginBottom:"0"}}><span style={{fontWeight:600}}>Test Email: </span>sample@web.com</p>
    <p style={{marginBottom:"0"}}><span style={{fontWeight:600}}>Password: </span>Guestreactdev</p>
    </div>
    )
}
export default Login