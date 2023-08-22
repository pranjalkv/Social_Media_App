import "./Error.css"
import { Link } from "react-router-dom"

function Error()
{
    return(
        <section className="error-page">
        <div>
        <p className="error-head">ERROR 404!</p>
        <p className="error-title">Page you are searching for does not exist</p>
        </div>
        </section>
    )
}

export default Error