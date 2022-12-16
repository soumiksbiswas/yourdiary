import React, { useContext, useState, useEffect, useRef } from "react"; // useRef hook is used to give reference to a specific element
import noteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import {useNavigate} from 'react-router-dom';

const Notes = (props) => {
  const context = useContext(noteContext);
  let navigate = useNavigate();
  const { notes, getNotes, editNote } = context;
  const ref = useRef(null);
  const refClose = useRef(null);

  useEffect(() => {
    if(localStorage.getItem('token')){ // if not null
      getNotes();
    }
      else{
        navigate("/signin");
      }
  }, []);

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value }); // ... is called the spread operator
  };

  const handleSubmit = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click(); // if we click on the handleSubmit button, the refClose reference button will also be clicked automatically
    props.showAlert("Note updated successfully!", "success");
  };

  return (
    // 'row' class helps to arrange the cards row-wise
    <>
      <AddNote showAlert={props.showAlert} />
      {/* Button trigger modal */}
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        // We dont want to display this button, that's why we use class d-none
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Edit Note
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={note.etitle}
                    name="etitle"
                    id="etitle"
                    onChange={onChange}
                    minLength={5}
                    required
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    value={note.edescription}
                    name="edescription"
                    className="form-control"
                    id="edescription"
                    minLength={5}
                    required
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    value={note.etag}
                    id="etag"
                    name="etag"
                    className="form-control"
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={note.etitle.length<5 || note.edescription.length<5}
                className="btn btn-primary"
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>Your notes</h2>
        <div className="container mx-2">
          {notes.length === 0 && "No notes to display!"}
        </div>
        {notes.map((note) => {
          return (
            <NoteItem key={note._id} note={note} showAlert={props.showAlert} updateNote={updateNote} />
          ); // mongo-db has the id tag as '_id'
        })}
      </div>
    </>
  );
};

export default Notes;
