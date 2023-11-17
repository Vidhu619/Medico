import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Viewmed() {
  const params = useParams();
  const id = params.id; // Ensure id is the correct type (e.g., parse it as an integer if needed)

  const data = useSelector((store) => store.list);
  const val = data.find((item) => item.id === id);

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (val) {
      // Parse the expiry_date as a Date object
      const expiryDate = new Date(val.expiry_date);
      const currentDate = new Date();

      // Calculate if the medicine is expired
      setIsExpired(expiryDate < currentDate);
    }
  }, [val]);

  if (!val) {
    // Handle the case where val is not found (e.g., medicine with the given id doesn't exist)
    return (
      <div>
        <Navbar />
        <div className="text-center mt-5">
          <h2>Medicine not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="row">
        <div className="col col-5 mx-auto d-block bg-light mt-5">
          <h2 className={isExpired ? "bg-danger text-white" : "bg-success text-white"}>
            Details of {val.name}
          </h2>
          <h5>Name: <span className={isExpired ? "text-danger" : "text-success"}>{val.name}</span></h5>
          <h5>Company: <span className={isExpired ? "text-danger" : "text-success"}>{val.company}</span></h5>
          <h5>Expiry: <span className={isExpired ? "text-danger" : "text-success"}>{val.expiry_date}</span></h5>
        </div>
      </div>
    </div>
  );
}

export default Viewmed;
