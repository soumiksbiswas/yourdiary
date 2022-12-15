import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type) => {
    setAlert({
      msg: msg,
      type: type,
    });
     
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  return (
    <>
      
      {/* Involves concept of Context API: NoteState is defined at the outermost scope, so that the state variables within NoteState become available to all the components of the application and components inside those components as well */}

      <NoteState>
        <BrowserRouter>
          <Navbar />
          <Alert alert={alert} />
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert} />}></Route>
              <Route exact path="/about" element={<About />}></Route>
              <Route exact path="/signin" element={<SignIn showAlert={showAlert} />}></Route>
              <Route exact path="/signup" element={<SignUp showAlert={showAlert} />}></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </NoteState>
    </>
  );
}

export default App;
