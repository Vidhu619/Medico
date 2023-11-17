import { Fragment } from "react";
import Delete from "./curd/delete";
import { Link } from "react-router-dom";
function List(props) {

    var data = props.list;
    var id = data.id;
    var url = '/view/' + id;
    var url2 = '/update/' + id;
    return <Fragment>
        <div className="row">


            <div className="col bg-light rounded">
                <p className="btn">{id}<Link to={url} > <span className="bg-white mr-3 mt-2 detail" style={{ fontWeight: 'bold' }}>
                    name : {data.name} </span> </Link></p>
            </div>
            <div className="col"><Link className="btn btn-info" to={url2}>Edit</Link> <Delete id={id} /></div>

        </div>
    </Fragment>
}

export default List;