import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom';
import noteContext from "../context/notes/noteContext";


const SignIn = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  
  const context = useContext(noteContext);
  const {getUser} = context;

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }), // body data type must match "Content-Type" header
    });

    const json = await response.json();
    console.log(json);
    //  Save the auth token and redirect
    if (json.success) {
      localStorage.setItem("token", json.authToken);
      getUser();
      navigate("/");
      props.showAlert("Logged in successfully!", "success");
    } else {
      props.showAlert("Invalid credentials!", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value }); // ... is called the spread operator
  };

  return (
    <div className="container" style={{marginTop: "8rem"}}>
      <section className="vh-20">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 vertical-center-col">
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start my-2">
                  <h2>
                    Sign in to continue
                  </h2>
                </div>

                {/* <!-- Email input --> */}
                <div className="form-outline mb-3">
                  <input
                    type="email"
                    id="email"
                    value={credentials.email}
                    name="email"
                    onChange={onChange}
                    className="form-control form-control-lg"
                    placeholder="Enter email address"
                  />
                </div>

                {/* <!-- Password input --> */}
                <div className="form-outline mb-3">
                  <input
                    type="password"
                    id="password"
                    onChange={onChange}
                    name="password"
                    value={credentials.password}
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                  />
                </div>


                <div className="text-center text-lg-start mt-1 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}
                  >
                    Login
                  </button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" className="link-primary">
                    Sign Up
                  </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
