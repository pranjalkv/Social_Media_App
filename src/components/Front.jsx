import "bootstrap/dist/css/bootstrap.min.css";
import "./Front.css";
import Login from "./Login";

function Front()
{
    return(
        <div className="front-app d-flex align-items-center justify-content-center">
            <div className="d-flex fornt-info row">
                <div className="slogan col-lg-7 col-md-6 col-sm-12">
                    <h1>vibegram</h1>
                    <h3>Discover and connect with people around the world with vibegram.</h3>
                </div>
                <div className="login-part col-lg-5 col-md-6 col-sm-12">
                    <Login></Login>
                </div>
            </div>
            <div className="front-foot w-100 text-center">
                <p className="p-0 m-0">Made by Pranjal Kumar</p>
                <div className="d-flex justify-content-center">
                <a href="https://github.com/pranjalkv" target="_blank" className="mx-1">Github</a>
                <a href="https://www.linkedin.com/in/pranjalkv" target="_blank">Linkedin</a>
               </div>
            </div> 
        </div>
    )
}

export default Front;
