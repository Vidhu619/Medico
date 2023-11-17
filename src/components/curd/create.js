import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import checkAuth from "../auth/checkAuth";

function Addmed() {
    // Get the navigation function for routing
    var navigate = useNavigate();
    
    // Define state variables for form inputs
    var [name, setname] = useState('');
    var [company, setcompany] = useState('');
    var [expiry_date, setexpiry_date] = useState('');
    var [price, setprice] = useState('');
    var [quantity, setquantity] = useState('');
    
    // Get the user information from the Redux store
    var user = useSelector(store => store.auth.user);
    
    // Extract the user's token from the user information
    var token = user.token;

    // Function to handle form submission
    function postmed(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Send a POST request to the API to add a medicine
        axios.post('http://127.0.0.1:8000/storeapi/medicine', {
            name: name,
            company: company,
            expiry_date: expiry_date,
            price:price,
            quantity:quantity,
        }, { headers: { Authorization: "Token " + token } })
            .then(() => {
                // Redirect to the medicine list page on success
                navigate('/list');
            })
            .catch(error => {
                // Handle error here
                console.error("Error adding medicine:", error);
            });
    }

    return (
        <div>
            <Navbar />
            <div className="row grey-background">
                <div className="col col-5 mx-auto d-block mt-5 form-group">
                    <h1 className="mb-5 text-warning">Add medicine</h1>
                    <form onSubmit={postmed}>
                        <label>name:</label>
                        <input
                            value={name}
                            onChange={(event) => { setname(event.target.value) }}
                            placeholder="name.."
                            type="text"
                            className="form-control"
                            required
                        />
                        <label>company:</label>
                        <input
                            value={company}
                            onChange={(event) => { setcompany(event.target.value) }}
                            placeholder="company.."
                            type="text"
                            className="form-control"
                            required
                        />
                        <label>expiry date:</label>
                        <input
                            value={expiry_date}
                            onChange={(event) => { setexpiry_date(event.target.value) }}
                            type="date"
                            className="form-control"
                            required
                        />
                        <label>price</label>
                        <input
                            value={price}
                            onChange={(event) => { setprice(event.target.value) }}
                            type="number"
                            className="form-control"
                            required
                        />
                        <label>quantity:</label>
                        <input
                            value={quantity}
                            onChange={(event) => { setquantity(event.target.value) }}
                            type="number"
                            className="form-control"
                            required
                        />
                        <button type="submit" className="btn btn-success mt-3 mx-auto d-block">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Use the checkAuth higher-order component to protect this route
export default checkAuth(Addmed);
