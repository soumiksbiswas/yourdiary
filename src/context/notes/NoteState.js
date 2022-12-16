import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  // Fetch all notes
  const getNotes = async() => {
    // API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
     method: "GET", // *GET, POST, PUT, DELETE, etc.
     headers: {
       "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
       "auth-token": localStorage.getItem('token')
     }
   });
   
   const json = await response.json(); // parses JSON response into native JavaScript objects
   setNotes(json);
 };

  
  // Add a note
  const addNote = async(title, description, tag) => {
     // API call
     const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag}), // body data type must match "Content-Type" header
    });
    const note = await response.json(); // parses JSON response into native JavaScript objects
    setNotes(notes.concat(note)); // concat returns an array, whereas push updates an array
  };

  
  // Edit a note
  const editNote = async (id, title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
        "auth-token": localStorage.getItem('token'),
      },
      body: JSON.stringify({title,description,tag}), // body data type must match "Content-Type" header
    });
    const json = await response.json(); // parses JSON response into native JavaScript objects
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };


  // Delete a note
  const deleteNote = async (id) => {
    // API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json(); // parses JSON response into native JavaScript objects
    console.log(json);
    
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    }); // if 'note._id' is not equal to the argument 'id', then it will remain in the notes, otherwise it will be deleted
    setNotes(newNotes);
  };


  // Get username
  const getUser = async() => {
    // API call
    const response = await fetch(`${host}/api/auth/getuser`, {
     method: "POST", // *GET, POST, PUT, DELETE, etc.
     headers: {
       "auth-token": localStorage.getItem('token')
     },
   });
   
   const json = await response.json(); // parses JSON response into native JavaScript objects
   localStorage.setItem("name", json.name);
   localStorage.setItem("email", json.email);
 };


  return (
    <NoteContext.Provider
      value={{ notes, setNotes, getNotes, addNote, editNote, deleteNote, getUser }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
