import React, { useState, useContext } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value }); // ... is called the spread operator
  };

  const name = (localStorage.getItem('name'));

  const handleSubmit=(e)=>{
    e.preventDefault(); // to prevent the page from reloading when clicked on Submit
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    props.showAlert("Note addded successfully!", "success");
  }

  return (
    <div>
      <div className="container my-4">
        <h2>{"Hello "+name+"! Welcome to your diary!"} </h2>
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              onChange={onChange}
              minLength={5}
              required
              value={note.title}
              name="title"
              id="title"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="desc" className="form-label">
              Description
            </label>
            <input
              type="text"
              onChange={onChange}
              minLength={5}
              required
              value={note.description}
              name="description"
              className="form-control"
              id="desc"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              onChange={onChange}
              name="tag"
              value={note.tag}
              className="form-control"
              id="tag"
            />
          </div>
          <button
          disabled={note.title.length<5 || note.description.length<5}
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
