import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import List from "./listview";
import Search from "./curd/search";
import checkAuth from "./auth/checkAuth";
import { setlist } from "../store/listslice";

function ListContainer() {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [token, setToken] = useState(null);
  
  // Check if the user is authenticated and set the token accordingly
  useEffect(() => {
    if (user) {
      setToken(user.token);
    } else {
      // If user data is not available in Redux, check local storage
      const storedUser = JSON.parse(window.localStorage.getItem("user"));
      if (storedUser) {
        setToken(storedUser.token);
      } else {
        // If neither Redux nor local storage has user data, navigate to the home page
        navigate("/");
      }
    }
  }, [user, navigate]);

  // Fetch data when the token changes
  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/storeapi/medicine", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          const data = response.data;
          // Dispatch the fetched data to Redux store
          dispatch(setlist(data));
        })
       
    }
  }, [token, dispatch]);

  // Get the list from the Redux store
  const value = useSelector((store) => store.list);

  return (
    <div className="list-container">
      <Navbar />
      <div className="row mt-5">
        <div className="col">
          <Search />
          <h3 className="mt-5">List view</h3>
          <div>
            {/* Map through the 'value' array and render 'List' components */}
            {value.map((list) => (
              <List list={list} key={list.id} />
            ))}
          </div>
        </div>
        <div className="col d-none d-lg-block li"></div>
      </div>
    </div>
  );
}

export default checkAuth(ListContainer);
