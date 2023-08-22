import "bootstrap/dist/css/bootstrap.min.css";
import "./Loadspin.css";

function Loadspin()
{
    return(
        <div className="spin-screen d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
  <span className="visually-hidden">Loading...</span>
</div>
</div>
    )
}
export default Loadspin;