import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Update() {
    var navigate = useNavigate();
    var [name, setname] = useState('');
    var [company, setcompany] = useState('');
    var [expiry_date, setexpiry_date] = useState('');
    var [price, setprice] = useState('');
    var [quantity, setquantity] = useState('');
    var user = useSelector(store => store.auth.user);
    var token = user.token;
    var val = useParams();
    var id = val.id;
    var url = `http://127.0.0.1:8000/storeapi/medicines/${id}`; ;

    // Fetch the medicine data and set the initial state of 'name'
    useEffect(() => {
        // You can use axios or any other method to fetch the medicine data
        axios.get(url, { headers: { Authorization: "Token " + token } })
            .then(response => {
                const medicineData = response.data; // Assuming the response contains the medicine data
                setname(medicineData.name);
                setcompany(medicineData.company);
                setexpiry_date(medicineData.expiry_date);
                setprice(medicineData.price);
                setquantity(medicineData.quantity);
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    }, [url, token]);

    function postmed() {
        axios.put(url, {
            name: name,
            company: company,
            expiry_date: expiry_date,
            price:price,
            quantity:quantity

        }, { headers: { Authorization: "Token " + token } })
            .then(() => {
                // After successful submission, navigate to the list page
                navigate('/list');
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    }

    return (
        <div className="container-fluid">
            <Navbar />
            <div className="row">
                <div className="col col-5 mx-auto d-block mt-5 form-group">
                    <h1 className="mb-5 text-warning">Update Medicine</h1>
                    <form>
                        <label>Name:</label>
                        <input
                            value={name}
                            onChange={(event) => { setname(event.target.value) }}
                            placeholder="Name.."
                            type="text"
                            className="form-control"
                        />
                        <label>Company:</label>
                        <input
                            value={company}
                            onChange={(event) => { setcompany(event.target.value) }}
                            placeholder="Company.."
                            type="text"
                            className="form-control"
                        />
                        <label>Expiry Date:</label>
                        <input
                            value={expiry_date}
                            onChange={(event) => { setexpiry_date(event.target.value) }}
                            type="date"
                            className="form-control"
                        />
                        <label>price:</label>
                        <input
                            value={price}
                            onChange={(event) => { setprice(event.target.value) }}
                            type="number"
                            className="form-control"
                        />
                        <label>quantity:</label>
                        <input
                            value={quantity}
                            onChange={(event) => { setquantity(event.target.value) }}
                            type="number"
                            className="form-control"
                        />
                        <button type="button" onClick={postmed} className="btn btn-success mt-3 mx-auto d-block">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Update;
