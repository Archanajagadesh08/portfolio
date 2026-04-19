// ===== DEBUG =====
console.log("JS WORKING");

// ===== SCROLL ANIMATION =====
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

// ===== NAV ACTIVE LINK =====
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

// ===== CONFIG =====
const form = document.getElementById('contactForm');
const commentBoxes = document.getElementById('commentBoxes');

const API = "https://archana-portfolio-ezun.onrender.com";

// 👉 CHANGE THIS (owner name)
const OWNER_NAME = "Archana";

// ===== LOAD COMMENTS =====
async function loadComments() {
  try {
    const res = await fetch(`${API}/comments`);
    const data = await res.json();

    commentBoxes.innerHTML = data.map(c => `
      <div class="comment">

        <!-- HEADER -->
        <div class="comment-header">
          <div class="avatar">${c.name.charAt(0).toUpperCase()}</div>
          <div class="meta">
            <div class="name">${c.name}</div>
          </div>
        </div>

        <!-- MESSAGE -->
        <div class="comment-body">${c.message}</div>

        <!-- REPLIES -->
        <div class="replies">
          ${(c.replies || []).map(r => `
            <div class="reply-item">
              <div class="reply-avatar">${r.name.charAt(0).toUpperCase()}</div>
              <div>
                <b>${r.name}</b>
                <p>${r.message}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- REPLY BOX -->
        <div class="reply-box">
          <input 
            placeholder="Reply..." 
            id="reply-${c._id}"
            onkeydown="if(event.key==='Enter'){addReply('${c._id}')}"
          >
          <button onclick="addReply('${c._id}')">Reply</button>
        </div>

        <!-- DELETE BUTTON -->
        <div class="action-buttons">
          ${
            c.name === OWNER_NAME
              ? `<button onclick="deleteComment('${c._id}')">Delete</button>`
              : ""
          }
        </div>

      </div>
    `).join('');

  } catch (err) {
    console.error("Error loading comments:", err);
  }
}

// ===== DELETE COMMENT =====
window.deleteComment = async function(id) {
  try {
    await fetch(`${API}/comment/${id}`, {
      method: "DELETE"
    });

    loadComments();
  } catch (err) {
    console.error("Delete error:", err);
  }
};

// ===== ADD REPLY =====
window.addReply = async function(id) {
  const input = document.getElementById(`reply-${id}`);
  const message = input.value.trim();

  if (!message) return;

  try {
    await fetch(`${API}/reply/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: OWNER_NAME, // you can change dynamically later
        message
      })
    });

    input.value = "";
    loadComments();

  } catch (err) {
    console.error("Reply error:", err);
  }
};

// ===== ENTER KEY (FORM SUBMIT FIX) =====
form.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});

// ===== SUBMIT COMMENT =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const message = document.getElementById("msgInput").value.trim();

  if (!name || !message) return;

  try {
    await fetch(`${API}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message })
    });

    form.reset();
    loadComments();

  } catch (err) {
    console.error("Submit error:", err);
  }
});

// ===== INITIAL LOAD =====
loadComments();

// ===== FLIP CARD (UNCHANGED) =====
document.querySelector('.flip-card-home')
  ?.addEventListener('click', function () {
    this.querySelector('.flip-inner-home')
      .classList.toggle('flip-active');
  });