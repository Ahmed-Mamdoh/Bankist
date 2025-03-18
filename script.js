'use strict';

/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// Account data for user 1
const account1 = {
  owner: 'Ahmed Mamdoh',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // Interest rate in percentage
  pin: 1111,
  movementsDates: [
    '2020-11-18T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2023-02-23T17:01:17.194Z',
    '2025-02-24T23:36:17.929Z',
    '2025-02-26T10:51:36.790Z',
  ],
  currency: 'EUR', // Currency type
  locale: 'pt-PT', // Locale for formatting
};

// Account data for user 2
const account2 = {
  owner: 'Abdullah walid',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5, // Interest rate in percentage
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD', // Currency type
  locale: 'en-US', // Locale for formatting
};

// Array of all accounts
const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements

// UI elements for displaying information
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app'); // Main app container
const containerMovements = document.querySelector('.movements'); // Container for movements

// Buttons for user actions
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

// Input fields for user input
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const locale = navigator.language; // Get user's locale

// Function to format movement dates
const formatMovementDate = date => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// Function to format currency values
const formatCurr = (value, locale, currancy) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currancy,
  }).format(value);

// Function to display movements in the UI
const displayMovments = function (acc, reverse = false) {
  containerMovements.innerHTML = ''; // Clear previous movements
  const movs = reverse ? acc.movements.slice(0).reverse() : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'; // Determine type of movement
    const date = reverse
      ? new Date(acc.movementsDates[acc.movementsDates.length - i - 1])
      : new Date(acc.movementsDates[i]); // Get date of movement
    const displayDate = formatMovementDate(date); // Format date for display
    const formatedMov = formatCurr(mov, acc.locale, acc.currency); // Format movement for display

    const html = `       
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      reverse ? movs.length - i : i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html); // Insert movement into the UI
  });
};

// Function to calculate and print account balance
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0); // Calculate balance
  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency); // Display balance
};

// Function to calculate and display summary of account
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0) // Filter for income movements
    .reduce((acc, mov) => acc + mov, 0); // Sum income movements
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency); // Display income

  const outcomes = acc.movements
    .filter(mov => mov < 0) // Filter for outcome movements
    .reduce((acc, mov) => acc + mov, 0); // Sum outcome movements
  labelSumOut.textContent = formatCurr(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  ); // Display outcome

  const interest = acc.movements
    .filter(mov => mov > 0) // Filter for deposits
    .map(deposite => (deposite * acc.interestRate) / 100) // Calculate interest for each deposit
    .reduce((acc, deposit) => acc + deposit); // Sum interest
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency); // Display interest
};

// Function to create usernames for accounts
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) // Create username from initials
      .join('');
  });
};

// Create usernames for all accounts
createUsernames(accounts);

const updateUI = function (acc = currentAccount) {
  displayMovments(acc); // Display movements
  calcPrintBalance(acc); // Print balance
  calcDisplaySummary(acc); // Display summary
};

let currentAccount = account1; // Set default current account

// Event Listeners
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default form submission
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin == inputLoginPin.value) {
    labelWelcome.textContent = `welcome back ${
      currentAccount.owner.split(' ')[0]
    }`; // Welcome message
    containerApp.style.opacity = 100; // Show app
    inputLoginUsername.value = inputLoginPin.value = ''; // Clear input fields
    inputLoginPin.blur(); // Remove focus from pin input
    updateUI(); // Update UI with current account data
  }

  let now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now); // Format and display date
  if (timer) clearInterval(timer); // Clear existing timer
  timer = startLogoutTimer(); // Start logout timer
});

// Transfer event listener
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default form submission
  const amount = +inputTransferAmount.value; // Get transfer amount
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value // Find receiver account
  );

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount); // Deduct from sender
    receiverAcc.movements.push(amount); // Add to receiver
    currentAccount.movementsDates.push(new Date().toISOString()); // Add date to sender
    receiverAcc.movementsDates.push(new Date().toISOString()); // Add date to receiver
    inputTransferAmount.value = ''; // Clear input fields
    inputTransferTo.value = '';
    clearInterval(timer); // Clear existing timer
    timer = startLogoutTimer(); // Start logout timer
    updateUI(); // Update UI
  }
});

let timer; // Timer variable

// Close account event listener
btnClose.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default form submission
  if (
    currentAccount.pin === +inputClosePin.value &&
    currentAccount.username === inputCloseUsername.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username // Find index of current account
    );
    accounts.splice(index, 1); // Remove account from accounts array
    containerApp.style.opacity = 0; // Hide app
    inputCloseUsername.value = inputClosePin.value = ''; // Clear input fields
  }
});

// Function to start logout timer
const startLogoutTimer = function () {
  let time = 120; // Set timer for 2 minutes

  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, '0'); // Calculate minutes
    const sec = String(time % 60).padStart(2, '0'); // Calculate seconds
    labelTimer.textContent = `${min}:${sec}`; // Display timer

    if (time === 0) {
      clearInterval(timer); // Clear timer
      labelWelcome.textContent = `login to get started`; // Reset welcome message
      containerApp.style.opacity = 0; // Hide app
    }
    time--; // Decrement time
  };

  tick(); // Call tick immediately to display initial time
  const timer = setInterval(tick, 1000); // Start timer
  return timer; // Return timer ID
};

// Loan event listener
btnLoan.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default form submission
  const amount = Math.floor(inputLoanAmount.value); // Get loan amount

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount); // Add loan to movements
      currentAccount.movementsDates.push(new Date().toISOString()); // Add date to movements
      updateUI(); // Update UI
      this.disabled = false; // Enable button
      inputLoanAmount.disabled = false; // Enable input
    }, 3 * 1000); // Delay for 3 seconds
    this.disabled = true; // Disable button
    inputLoanAmount.disabled = true; // Disable input
    clearInterval(timer); // Clear existing timer
    timer = startLogoutTimer(); // Start logout timer
    inputLoanAmount.value = ''; // Clear input field
  }
});

let sort = true; // Sort flag

// Sort event listener
btnSort.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default form submission
  displayMovments(currentAccount, sort); // Display movements with sort option
  sort = !sort; // Toggle sort flag
});
