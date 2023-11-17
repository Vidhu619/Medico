import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { deluser } from "../../store/authslice";

function Logout() {
    var user = useSelector(store => store.auth);
    var navigate = useNavigate();
    var tokenn = user.token
    var dispatch = useDispatch();
    axios
    .post('https://medicalstore.mashupstack.com/api/logout', { headers: { Authorization: "Bearer " + tokenn } }).then(
        dispatch(deluser(user)))
        .catch(() => 
        navigate('/'))

    return <div className="col">
        <h2 className="text-success align-center">Logout successful</h2>

    </div>
}

export default Logout;