console.log("JS WORKING");

// ─── SCROLL REVEAL ───────────────────────────────────────────────
const sections = document.querySelectorAll('section');
const reveal = () => {
  const trigger = window.innerHeight * 0.85;
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < trigger) sec.classList.add('show');
  });
};
window.addEventListener('scroll', reveal);
reveal();

// ─── ACTIVE NAV LINK ─────────────────────────────────────────────
const allSections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
window.addEventListener("scroll", () => {
  let current = "";
  allSections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ─── CONFIG ──────────────────────────────────────────────────────
const form = document.getElementById('contactForm');
const commentBoxes = document.getElementById('commentBoxes');
const API = "https://archana-portfolio-ezun.onrender.com";

// ─── LOAD COMMENTS ───────────────────────────────────────────────
async function loadComments() {
  try {
    const res = await fetch(`${API}/comments`);
    const data = await res.json();

    commentBoxes.innerHTML = data.map(c => `
      <div class="comment" id="card-${c._id}">

        <div class="comment-header">
          <div class="avatar">${c.name.charAt(0).toUpperCase()}</div>
          <div class="name">${c.name}</div>
        </div>

        <div class="comment-body" id="msg-${c._id}">${c.message}</div>

        <div class="edit-overlay" id="edit-overlay-${c._id}">
          <textarea id="edit-${c._id}" rows="2">${c.message}</textarea>
          <div class="edit-actions">
            <button class="save-btn" onclick="saveEdit('${c._id}')">Save</button>
            <button class="cancel-btn" onclick="cancelEdit('${c._id}')">Cancel</button>
          </div>
        </div>

        <div class="replies" id="replies-${c._id}">
          ${c.replies && c.replies.length ? c.replies.map(r => `
            <div class="reply-item">
              <div class="reply-avatar">${r.name.charAt(0).toUpperCase()}</div>
              <div>
                <b>${r.name}</b>
                <p>${r.message}</p>
              </div>
            </div>
          `).join('') : ''}
        </div>

        <div class="reply-box">
          <input
            type="text"
            placeholder="Reply..."
            id="reply-${c._id}"
            onkeydown="if(event.key==='Enter'){ event.preventDefault(); addReply('${c._id}'); }"
          />
          <button onclick="addReply('${c._id}')">Reply</button>
        </div>

        <div class="action-buttons">
          <button onclick="showEdit('${c._id}')">Edit</button>
          <button class="del" onclick="deleteComment('${c._id}')">Delete</button>
        </div>

      </div>
    `).join('');

  } catch (err) {
    console.error("Failed to load comments:", err);
  }
}

// ─── DELETE ──────────────────────────────────────────────────────
window.deleteComment = async function(id) {
  await fetch(`${API}/comment/${id}`, { method: "DELETE" });
  loadComments();
};

// ─── SHOW EDIT ───────────────────────────────────────────────────
window.showEdit = function(id) {
  document.getElementById(`msg-${id}`).style.display = "none";
  const overlay = document.getElementById(`edit-overlay-${id}`);
  overlay.style.display = "flex";
  document.getElementById(`edit-${id}`).focus();
};

// ─── CANCEL EDIT ─────────────────────────────────────────────────
window.cancelEdit = function(id) {
  document.getElementById(`msg-${id}`).style.display = "block";
  document.getElementById(`edit-overlay-${id}`).style.display = "none";
};

// ─── SAVE EDIT ───────────────────────────────────────────────────
window.saveEdit = async function(id) {
  const newText = document.getElementById(`edit-${id}`).value.trim();
  if (!newText) return;
  await fetch(`${API}/comment/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: newText })
  });
  loadComments();
};

// ─── REPLY ───────────────────────────────────────────────────────
window.addReply = async function(id) {
  const input = document.getElementById(`reply-${id}`);
  const message = input.value.trim();
  if (!message) return;
  await fetch(`${API}/reply/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Archana", message })
  });
  input.value = "";
  loadComments();
};

// ─── FORM SUBMIT ─────────────────────────────────────────────────
form.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById("nameInput").value.trim();
  const message = document.getElementById("msgInput").value.trim();
  if (!name || !message) return;
  await fetch(`${API}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message })
  });
  form.reset();
  loadComments();
});

// ─── FLIP CARD ───────────────────────────────────────────────────
document.querySelector('.flip-card-home')
  .addEventListener('click', function () {
    this.querySelector('.flip-inner-home')
      .classList.toggle('flip-active');
  });

// ─── INIT ────────────────────────────────────────────────────────
loadComments();