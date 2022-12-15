const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// THIS IS OUR FIRST END-POINT, name of this end point is 'fetchallnotes'
// Route 1: Get all the notes using : GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});

// THIS IS OUR SECOND END-POINT, name of this end point is 'addnote'
// Route 1: Add a new note using : POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    //title must have at least 3 letters
    body("title", "Enter a valid title").isLength({ min: 3 }),
    // description must have at least 5 letters
    body("description", "Enter a valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body; // using destructuring
      // If there are errors, return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // if there is some error in our entry, report error
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error!");
    }
  }
);

// THIS IS OUR THIRD END-POINT, name of this end point is 'updatenote'
// Route 1: Update an existing note using : PUT "/api/notes/updatenote/:id". Login required
// UPDATE IS PUT REQUEST

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body; // using destructuring
    // If there are errors, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // if there is some error in our entry, report error
    }

    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found!");
    }

    // if a user tries to access some other user's notes, we need to prevent him
    if (note.user.toString() != req.user.id) {
      return res.status(404).send("Not allowed!");
    }

    // if all the above errors are not reported, then the note exists and belongs to the current user
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});


// THIS IS OUR FOURTH END-POINT, name of this end point is 'deletenote'
// Route 1: Update an existing note using : DELETE "/api/notes/deletenote". Login required
// DELETE IS DELETE REQUEST

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
      const { title, description, tag } = req.body; // using destructuring
      // If there are errors, return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // if there is some error in our entry, report error
      }
  
      // Find the note to be deleted and delete it
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not found!");
      }
  
      // Allow deletion only if the user owns this note
      if (note.user.toString() != req.user.id) {
        return res.status(404).send("Not allowed!");
      }
  
      // if all the above errors are not reported, then the note exists and belongs to the current user
      note = await Notes.findByIdAndDelete(req.params.id);
  
      res.json({"Success":"Note has been deleted!", note: note});
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error!");
    }
  });


module.exports = router;
