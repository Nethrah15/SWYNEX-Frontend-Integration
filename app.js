// Change this to your Task 2 API URL
// If running locally: http://localhost:3000/api/expenses
// If deployed: your render/vercel link
const API_URL = "http://localhost:3000/api/expenses";

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const loading = document.getElementById("loading");
const errorEl = document.getElementById("error");
const totalEl = document.getElementById("total");

// GET - Load all expenses
async function loadExpenses() {
  loading.style.display = "block";
  errorEl.style.display = "none";
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load");
    const expenses = await res.json();
    list.innerHTML = "";
    let total = 0;
    expenses.forEach(exp => {
      total += exp.amount;
      const li = document.createElement("li");
      li.innerHTML = `<span>${exp.title} - ${exp.category} - ₹${exp.amount}</span>
      <button class="delete-btn" onclick="deleteExpense('${exp.id}')">Delete</button>`;
      list.appendChild(li);
    });
    totalEl.textContent = `Total: ₹${total}`;
  } catch (err) {
    errorEl.textContent = "Error: Could not load expenses. Is backend running?";
    errorEl.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}

// POST - Add expense
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newExpense = {
    title: document.getElementById("title").value,
    category: document.getElementById("category").value,
    amount: Number(document.getElementById("amount").value)
  };
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense)
    });
    if (!res.ok) throw new Error("Validation failed");
    form.reset();
    loadExpenses();
  } catch (err) {
    alert("Error: Title, Category required & Amount must be > 0");
  }
});

// DELETE - Delete expense
async function deleteExpense(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadExpenses();
}

loadExpenses();
