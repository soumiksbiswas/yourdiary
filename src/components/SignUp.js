import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';

const SignUp = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name,email,password,cpassword} = credentials;
    if(cpassword!==password){
      props.showAlert("Confirm password did not match!","danger");
      return;
    }
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        cpassword: credentials.cpassword
      }), // body data type must match "Content-Type" header
    });

    const json = await response.json();
    console.log(json);
    if (json.success) {
      //  Save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      navigate("/");
      props.showAlert("Account created successfully!","success");
    } else {
      props.showAlert("Invalid details!", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value }); // ... is called the spread operator
  };

return (
  <div className="container" style={{marginTop: "6rem"}}>
    <section className="vh-20">
      <div className="container-fluid h-custom">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start my-2">
                <h2>
                  Create your account
                </h2>
              </div>

              {/* <!-- Name input --> */}
              <div className="form-outline mb-3">
                <input
                  type="text"
                  id="name"
                  value={credentials.name}
                  name="name"
                  onChange={onChange}
                  className="form-control form-control-lg"
                  placeholder="Enter name"
                />
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

              {/* <!-- Password input --> */}
              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="cpassword"
                  onChange={onChange}
                  name="cpassword"
                  value={credentials.cpassword}
                  className="form-control form-control-lg"
                  placeholder="Confirm password"
                />
              </div>

              <div className="text-center text-lg-start pt-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}
                >
                  Sign up
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
);
};

export default SignUp;
