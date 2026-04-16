const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB connection
mongoose.connect('mongodb+srv://archanajagadesh08_db_user:eMkiiWwutEJ5Df7n@archana.cfpdggh.mongodb.net/?appName=Archana')
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

// 🧠 Schema
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

// ➕ Add comment
app.post('/comment', async (req, res) => {
  const newComment = new Comment(req.body);
  await newComment.save();
  res.send("Comment saved");
});

// 📥 Get comments
app.get('/comments', async (req, res) => {
  const data = await Comment.find();
  res.json(data);
});

// 💬 Add reply
app.post('/reply/:id', async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  comment.replies.push(req.body);
  await comment.save();
  res.send("Reply added");
});
// DELETE COMMENT
app.delete('/comment/:id', async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.send("Comment deleted");
});

// EDIT COMMENT
app.put('/comment/:id', async (req, res) => {
  await Comment.findByIdAndUpdate(req.params.id, {
    message: req.body.message
  });
  res.send("Comment updated");
});
// 🚀 Start server
app.listen(5000, () => console.log("Server running on port 5000"));
