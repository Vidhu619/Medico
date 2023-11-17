import { useSelector } from "react-redux";
import List from "../listview";
import { Fragment } from "react";
import Navbar from "../Navbar";

function Searchpage() {
    var val = useSelector(store => store.search);

    return (
        <Fragment>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        {val.length === 0 ? (
                            <p className="text-center mt-3">No results found.</p>
                        ) : (
                            val.map((list, index) => (
                                <div key={index} className="mb-3">
                                    <List list={list} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Searchpage;
