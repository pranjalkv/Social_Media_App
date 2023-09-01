import "./Search.css"
import {FaSistrix} from "react-icons/fa"
import {db} from "../../firebase"
import { getDocs ,collection} from "firebase/firestore"
import {useEffect, useState} from "react"
import {useNavigate } from "react-router-dom";
function Search()
{
   const searProf=useNavigate();
    const[searchWord,setsearchWord]=useState([]);
    const[allQuery,setallQuery]=useState("");

    useEffect(()=>
    {
        async function searcher()
        {
            try
            {
                let term=collection(db,"dp_data")
                const seaData=await getDocs(term)
                setsearchWord(seaData.docs.map((doc)=>doc.data()))
            }
            catch(err)
            {
                console.log(err);
            }
        }
        searcher();
    },[])

    function palceDP(e)
    {
        e.target.src="/images/profileimg.jpg"
    }

    function profOpen(e)
    {
        e.stopPropagation();
        searProf(`/profile/${e.currentTarget.id}`)
    }
    

    function queryFn(e)
    {
        setallQuery(e.target.value)
    }
    return(
        <div className="search-div">
            <div className="inp-div">
                <input className="inp-search" type="text" value={allQuery}
                 onChange={queryFn} autoFocus/>
                <button className="search-btn">
                    <FaSistrix />
                </button>
            </div>
              {allQuery !="" && <div className="search-items">
            {searchWord?.filter((fil)=>fil.name.toLowerCase()
            .includes(allQuery.toLocaleLowerCase())).map((ele)=>
            <div className="search-result" key={ele.uid} id={ele?.uid} onClick={profOpen}>
                <img className="seach-dp" src={ele.dpUrl} alt="" onError={palceDP} />
                <p className="search-user-name">{ele.name}</p>
            </div>)}
            </div>}
        </div>     
    )
}

export default Search;