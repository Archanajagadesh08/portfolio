console.log("JS WORKING");

// ─── SCROLL REVEAL ───────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
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
const allSections = document.querySelectorAll("section[id]");
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

    const currentUser = sessionStorage.getItem("userName") || "";
    const isOwner = currentUser === "Archana";

    commentBoxes.innerHTML = data.map(c => {
      const isMyComment = currentUser && currentUser === c.name;
      const replies = c.replies || []; // ✅ FIX

      const actionButtons = (isMyComment || isOwner) ? `
        <div class="action-buttons">
          ${isMyComment ? `<button onclick="showEdit('${c._id}')">Edit</button>` : ''}
          <button class="del" onclick="deleteComment('${c._id}')">Delete</button>
        </div>` : '';

      return `
        <div class="comment" id="card-${c._id}">

          <div class="comment-header">
            <div class="avatar">${c.name.charAt(0).toUpperCase()}</div>
            <div class="name">${c.name}</div>
          </div>

          <div class="comment-body" id="msg-${c._id}">${c.message}</div>

          <div class="edit-overlay" id="edit-overlay-${c._id}" style="display:none;">
            <textarea id="edit-${c._id}" rows="2">${c.message}</textarea>
            <div class="edit-actions">
              <button class="save-btn" onclick="saveEdit('${c._id}')">Save</button>
              <button class="cancel-btn" onclick="cancelEdit('${c._id}')">Cancel</button>
            </div>
          </div>

          <div class="replies" id="replies-${c._id}">
            ${replies.map((r, i) => `
              <div class="reply-item">
                <div class="reply-avatar">${r.name.charAt(0).toUpperCase()}</div>
                <div style="flex:1">
                  <b>${r.name}</b>
                  <p id="reply-msg-${c._id}-${i}">${r.message}</p>

                  ${isOwner && r.name === "Archana" ? `
                    <div class="edit-overlay" id="reply-edit-overlay-${c._id}-${i}" style="display:none;margin-top:6px;">
                      <textarea id="reply-edit-${c._id}-${i}" rows="2">${r.message}</textarea>
                      <div class="edit-actions">
                        <button class="save-btn" onclick="saveReplyEdit('${c._id}', ${i})">Save</button>
                        <button class="cancel-btn" onclick="cancelReplyEdit('${c._id}', ${i})">Cancel</button>
                      </div>
                    </div>
                    <button style="all:unset;font-size:11px;color:#a8e6cf;cursor:pointer;margin-top:4px;" onclick="showReplyEdit('${c._id}', ${i})">Edit reply</button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="reply-box">
            <input
              type="text"
              placeholder="Reply..."
              id="reply-${c._id}"
              onkeydown="if(event.key==='Enter'){event.preventDefault();addReply('${c._id}');}"
            />
            <button onclick="addReply('${c._id}')">Reply</button>
          </div>

          ${actionButtons}

        </div>
      `;
    }).join('');

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
  document.getElementById(`edit-overlay-${id}`).style.display = "flex";
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

// ─── REPLY ADD ───────────────────────────────────────────────────
window.addReply = async function(id) {
  const input = document.getElementById(`reply-${id}`);
  const message = input.value.trim();
  if (!message) return;

  const storedName = sessionStorage.getItem("userName") || "Archana"; // ← fix this line

  await fetch(`${API}/reply/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: storedName, message })
  });

  input.value = "";
  loadComments();
};
// ─── REPLY EDIT ──────────────────────────────────────────────────
window.showReplyEdit = function(commentId, index) {
  document.getElementById(`reply-edit-overlay-${commentId}-${index}`).style.display = "flex";
};

window.cancelReplyEdit = function(commentId, index) {
  document.getElementById(`reply-edit-overlay-${commentId}-${index}`).style.display = "none";
};

window.saveReplyEdit = async function(commentId, index) {
  const newText = document.getElementById(`reply-edit-${commentId}-${index}`).value.trim();
  if (!newText) return;

  await fetch(`${API}/reply/${commentId}/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: newText })
  });

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

  sessionStorage.setItem("userName", name);

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
  ?.addEventListener('click', function () {
    this.querySelector('.flip-inner-home')
      .classList.toggle('flip-active');
  });

// ─── INIT ────────────────────────────────────────────────────────
loadComments();