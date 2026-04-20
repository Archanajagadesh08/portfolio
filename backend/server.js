const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
mongoose.connect('mongodb+srv://archanajagadesh08_db_user:eMkiiWwutEJ5Df7n@archana.cfpdggh.mongodb.net/?appName=Archana')
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.log("❌ DB ERROR:", err));

/* ================= SCHEMA ================= */
const commentSchema = new mongoose.Schema({
  name: String,
  message: String,
  replies: [
    {
      name: String,
      message: String
    }
  ]
});

const Comment = mongoose.model('Comment', commentSchema);

/* ================= ADD COMMENT ================= */
app.post('/comment', async (req, res) => {
  try {
    const { name, message } = req.body;

    const newComment = new Comment({ name, message });
    await newComment.save();

    res.send("Comment saved");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving comment");
  }
});

/* ================= GET COMMENTS ================= */
app.get('/comments', async (req, res) => {
  try {
    const data = await Comment.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching comments");
  }
});

/* ================= ADD REPLY ================= */
app.post('/reply/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    comment.replies.push(req.body);
    await comment.save();

    res.send("Reply added");
  } catch (err) {
    console.log(err);
    res.status(500).send("Reply failed");
  }
});

/* ================= EDIT REPLY (IMPORTANT) ================= */
app.put('/reply/:commentId/:index', async (req, res) => {
  try {
    const { commentId, index } = req.params;
    const { message } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).send("Comment not found");

    if (!comment.replies[index]) {
      return res.status(404).send("Reply not found");
    }

    comment.replies[index].message = message;

    await comment.save();

    res.send("Reply updated successfully");

  } catch (err) {
    console.log(err);
    res.status(500).send("Reply update failed");
  }
});

/* ================= DELETE COMMENT ================= */
app.delete('/comment/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.send("Comment deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Delete failed");
  }
});

/* ================= EDIT COMMENT ================= */
app.put('/comment/:id', async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, {
      message: req.body.message
    });
    res.send("Comment updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("Update failed");
  }
});

/* ================= START SERVER ================= */
app.listen(5000, () => console.log("🚀 Server running on port 5000"));