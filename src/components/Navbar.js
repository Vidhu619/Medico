import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
function Navbar() {
  var user = useSelector(store => store.auth.user);
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <NavLink to="/app" className="navbar-brand">
          <h4>MEDICO.</h4>
        </NavLink>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
          <li className="nav-item">
              <NavLink to="/login" activeClassName="active" className="nav-link">
                Adminlogin
              </NavLink>
            </li>

            

            {user?

               <li className="nav-item">
              <NavLink to="/app" activeClassName="active" className="nav-link">
                Home
              </NavLink>
            </li>
             :
            <li className='nav-item'>
              <span className={'nav-link'}></span>
              </li>

            }
             {user?
                <li className="nav-item">
                  <NavLink to="/addmed" activeClassName="active" className="nav-link">
                    Add Medicine
                  </NavLink>
                  </li> : 
                <li className='nav-item'>
              <span className={'nav-link'}></span>
                
                </li>
              }  
              {user?   
                <li className="nav-item">
              <NavLink to="/aboutus" activeClassName="active" className="nav-link">
                About us
              </NavLink>
            </li>
            : 
            <li className='nav-item'>
          <span className={'nav-link'}></span>
            
            </li>
}
                {user? 
                <li className="nav-item">
                  <NavLink to="/list" activeClassName="active" className="nav-link">
                    List View
                  </NavLink>
                </li>
                : 
                <li className='nav-item'>
              <span className={'nav-link'}></span>
                
                </li>
                }
                {user? 
                <li className="nav-item">
                  <NavLink to="/logout" className="nav-link">
                    Logout
                  </NavLink>
                  </li>
                : 
                <li className='nav-item'>
              <span className={'nav-link'}></span>
                
                </li>
                }
            
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
