const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require("nodemailer");

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

/* ================= EMAIL SETUP ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "achubooks6@gmail.com",
    pass: "dyopbhxlutuyapss" // ✅ REMOVE SPACES
  }
});

// 🔍 CHECK IF EMAIL CONFIG WORKS
transporter.verify((err, success) => {
  if (err) {
    console.log("❌ MAIL ERROR:", err);
  } else {
    console.log("✅ MAIL READY");
  }
});

/* ================= DATABASE ================= */
mongoose.connect('mongodb+srv://archanajagadesh08_db_user:eMkiiWwutEJ5Df7n@archana.cfpdggh.mongodb.net/?appName=Archana')
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

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

    // 📩 SEND EMAIL
    await transporter.sendMail({
      from: "achubooks6@gmail.com",
      to: "achubooks6@gmail.com",
      subject: "New Comment 💬",
      text: `New comment from ${name}\n\n${message}`
    });

    console.log("✅ EMAIL SENT");

    res.send("Comment saved + Email sent");

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);
    res.send("Comment saved but email failed");
  }
});
// 📥 GET ALL COMMENTS (VERY IMPORTANT)
app.get('/comments', async (req, res) => {
  try {
    const data = await Comment.find();
    res.json(data);
  } catch (err) {
    console.log("❌ FETCH ERROR:", err);
    res.status(500).send("Error fetching comments");
  }
});
// 💬 Add reply
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
// ❌ Delete comment
app.delete('/comment/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.send("Comment deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Delete failed");
  }
});
// ✏️ Edit comment
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

/* ================= TEST EMAIL ================= */
app.get('/testmail', async (req, res) => {
  try {
    await transporter.sendMail({
      from: "achubooks6@gmail.com",
      to: "achubooks6@gmail.com",
      subject: "Test Email 💌",
      text: "If you see this, email works!"
    });

    console.log("✅ TEST EMAIL SENT");
    res.send("Email sent");

  } catch (err) {
    console.log("❌ TEST EMAIL ERROR:", err);
    res.send("Error sending email");
  }
});

/* ================= START SERVER ================= */
app.listen(5000, () => console.log("Server running on port 5000"));