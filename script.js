console.log("JS WORKING");
const sections = document.querySelectorAll('section');

    const reveal = () => {
      const trigger = window.innerHeight * 0.85;

      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;

        if (top < trigger) {
          sec.classList.add('show');
        }
      });
    };

    window.addEventListener('scroll', reveal);
    reveal();
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
const form = document.getElementById('contactForm');
const commentBoxes = document.getElementById('commentBoxes');

const API = "http://localhost:5000";

// LOAD COMMENTS
async function loadComments() {
  const res = await fetch(`${API}/comments`);
  const data = await res.json();

  commentBoxes.innerHTML = data.map(c => `
    <div class="comment">
      <strong>${c.name}</strong>
      <p>${c.message}</p>

      ${c.replies.map(r => `
        <p><b>${r.name}:</b> ${r.message}</p>
      `).join('')}

      <input placeholder="Reply..." id="reply-${c._id}">
      <button onclick="addReply('${c._id}')">Reply</button>

      <input id="edit-${c._id}" style="display:none;" placeholder="Edit">

      <div>
        <button onclick="deleteComment('${c._id}')">Delete</button>
        <button onclick="showEdit('${c._id}')">Edit</button>
        <button onclick="saveEdit('${c._id}')">Save</button>
      </div>
    </div>
  `).join('');
}

// DELETE
window.deleteComment = async function(id) {
  await fetch(`${API}/comment/${id}`, { method: "DELETE" });
  loadComments();
}

// SHOW EDIT
window.showEdit = function(id) {
  document.getElementById(`edit-${id}`).style.display = "block";
}

// SAVE EDIT
window.saveEdit = async function(id) {
  const text = document.getElementById(`edit-${id}`).value;

  await fetch(`${API}/comment/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message: text })
  });

  loadComments();
}

// REPLY
window.addReply = async function(id) {
  const input = document.getElementById(`reply-${id}`);
  const message = input.value;

  await fetch(`${API}/reply/${id}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name: "Archana", message })
  });

  loadComments();
}

// ENTER KEY
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    if (document.activeElement.closest("#contactForm")) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  }
});
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.querySelector('input').value;
  const message = form.querySelector('textarea').value;

  await fetch(`${API}/comment`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, message })
  });

  form.reset();
  loadComments();
});
loadComments();