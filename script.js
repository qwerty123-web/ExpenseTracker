const expenseForm = document.getElementById('expenseForm');
const typeInput = document.getElementById('typeInput');
const descriptionInput = document.getElementById('descriptionInput');
const amountInput = document.getElementById('amountInput');
const transactionList = document.getElementById('transactionList');
const clearButton = document.getElementById('clearButton');
const balanceAmount = document.getElementById('balanceAmount');
const incomeAmount = document.getElementById('incomeAmount');
const expenseAmount = document.getElementById('expenseAmount');

let transactions = JSON.parse(localStorage.getItem('expenseTrackerTransactions') || '[]');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function updateSummary() {
  const incomeTotal = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  const expenseTotal = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  balanceAmount.textContent = formatCurrency(incomeTotal - expenseTotal);
  incomeAmount.textContent = formatCurrency(incomeTotal);
  expenseAmount.textContent = formatCurrency(expenseTotal);
}

function saveTransactions() {
  localStorage.setItem('expenseTrackerTransactions', JSON.stringify(transactions));
}

function renderTransactions() {
  transactionList.innerHTML = '';

  if (transactions.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'transaction-item';
    emptyState.innerHTML = '<span class="transaction-description">No transactions yet.</span>';
    transactionList.appendChild(emptyState);
    return;
  }

  transactions.slice().reverse().forEach((transaction) => {
    const item = document.createElement('li');
    item.className = 'transaction-item';

    const descriptionBlock = document.createElement('div');
    descriptionBlock.className = 'transaction-description';
    descriptionBlock.innerHTML = `<strong>${transaction.description}</strong><span>${transaction.type}</span>`;

    const value = document.createElement('div');
    value.className = `transaction-value ${transaction.type}`;
    value.textContent = (transaction.type === 'expense' ? '-' : '+') + formatCurrency(transaction.amount);

    item.appendChild(descriptionBlock);
    item.appendChild(value);
    transactionList.appendChild(item);
  });
}

function addTransaction(event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid description and amount.');
    return;
  }

  transactions.push({
    type,
    description,
    amount,
    id: Date.now(),
  });

  saveTransactions();
  updateSummary();
  renderTransactions();

  expenseForm.reset();
  descriptionInput.focus();
}

function clearTransactions() {
  if (!confirm('Remove all transactions?')) {
    return;
  }

  transactions = [];
  saveTransactions();
  updateSummary();
  renderTransactions();
}

expenseForm.addEventListener('submit', addTransaction);
clearButton.addEventListener('click', clearTransactions);

updateSummary();
renderTransactions();
