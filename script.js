// Select DOM elements
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const filterCategory = document.getElementById("filter-category");



const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

// Get transactions from localStorage
const localStorageTransactions = JSON.parse(
    localStorage.getItem("transactions")
);

// Store transactions
let transactions = localStorage.getItem("transactions") !== null
    ? localStorageTransactions
    : [];

// Add transaction
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = textInput.value.trim();
    const amount = +amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (text === "" || amount === 0 || category === "" || date === "") {
        alert("Please fill all fields correctly");
        return;
    }

    const transaction = {
        id: Date.now(),
        text,
        amount,
        category,
        date
    };

    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateValues();
    updateLocalStorage();
    clearInputs();
});

filterCategory.addEventListener("change", function () {
    displayFilteredTransactions(this.value);
});


// Add transaction to DOM
function addTransactionToDOM(transaction) {
    const sign = transaction.amount > 0 ? "income" : "expense";

    const item = document.createElement("li");
    item.classList.add(sign);

    item.innerHTML = `
        <span>
        ${transaction.text}<br>
        <small>${transaction.category} • ${transaction.date}</small>
        </span>

        <span>
            ₹${transaction.amount}
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
        </span>
    `;

    transactionList.appendChild(item);
}

// Update balance, income & expense
function updateValues() {
    const amounts = transactions.map(t => t.amount);

    const total = amounts.reduce((acc, val) => acc + val, 0);
    const income = amounts
        .filter(val => val > 0)
        .reduce((acc, val) => acc + val, 0);
    const expense = amounts
        .filter(val => val < 0)
        .reduce((acc, val) => acc + val, 0);

    balanceEl.innerText = `₹${total}`;
    incomeEl.innerText = `₹${income}`;
    expenseEl.innerText = `₹${Math.abs(expense)}`;
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);

    updateLocalStorage();
    init();
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize app
function init() {
    transactionList.innerHTML = "";

    transactions.forEach(addTransactionToDOM);
    updateValues();
}

init();

// Clear form inputs
function clearInputs() {
    textInput.value = "";
    amountInput.value = "";
    categoryInput.value = "";
    dateInput.value = "";
}

function displayFilteredTransactions(category) {
    transactionList.innerHTML = "";

    if (category === "All") {
        transactions.forEach(addTransactionToDOM);
    } else {
        const filtered = transactions.filter(
            t => t.category === category
        );
        filtered.forEach(addTransactionToDOM);
    }
}
