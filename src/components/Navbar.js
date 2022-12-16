import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Why are we using useLocation() hook?
// Ans) useLocation() gives the current location which we are at. Now, we will notice that in the navbar, 'Home' is always highlighted (active), even if we go to 'About'. This is because of 'nav-link active'. We need to change active to About when we visit About.

export default function Navbar(props) {
  let location = useLocation(); // useLocation() hook
  // useEffect(() => {
  //   // import useEffect() from React instead of using React.useEffect()
  //   console.log(location.pathname);
  // }, [location]);

  let navigate = useNavigate();

  const handleLogout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    props.showAlert("Signed out successfully!","success");
    navigate("/signin");
  }
  
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Your Diary
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>

            {!localStorage.getItem('token') &&
              <form className="d-flex" role="search">
              <Link className="btn btn-primary mx-1" to="/signin" role="button">Sign in</Link>
              <Link className="btn btn-primary mx-1" to="/signup" role="button">Sign up</Link>
              </form>
            }
            { localStorage.getItem('token') &&
              <div>
                <span className="text-light mx-2">{localStorage.getItem('email')}</span>
                <button onClick={handleLogout} className="btn btn-primary">Sign out</button>
              </div>
            }
          </div>
        </div>
      </nav>
    </>
  );
}
