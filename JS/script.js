const container = document.querySelector('.container');
const form = document.getElementById('form');
const balance = document.getElementById('balance');
const incomeEarned = document.getElementById('money-plus');
const expenseIncurred = document.getElementById('money-minus');
const typeDescription = document.getElementById('text');
const amount = document.getElementById('amount');
const addList = document.getElementById('list');

//the var dummyTransaction was created for memory storage
/*const dummyTransactions = [
    {id: 1, typeDescription: "Salary", amount: 100000},
    {id:2,  typeDescription: "Savings", amount: -50000},
    {id: 3, typeDescription: "Home purchases", amount: -10000},
    {id:4 , typeDescription: "Eating out", amount: -3000}
] */

//let transactions = dummyTransactions (was used for memory storage with above variable)

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions')) //We use JSON.parse to convert the value to a number since local storage saves information as strings

let transactions = localStorage.getItem('transactions') !==null ? localStorageTransactions : [];  //as long as there is no information in local storage, everything in the app will be at Kshs. 0.00


//function to add the transactions input from the input forms

function addTransaction(event){
    event.preventDefault();

    if(typeDescription.value.trim() ===" " || amount.value.trim()===" "){
        alert `Please input your details`
    } else{
        const transaction = {
            id: generateID(),
            typeDescription: typeDescription.value,
            amount: parseInt(amount.value)
            

        };
       // console.log(transaction.amount)
        
       // console.log(transaction)

       transactions.push(transaction)

        addTransactionsDOM(transaction)

        updateValues();

        updateLocalStorage();

        typeDescription.value = "";
        amount.value = ''
        
    }

}

//function to generate random ID

function generateID (){
    return Math.floor(Math.random() * 1000000);

}


//function that adds the dummy transactions to our application

function addTransactionsDOM(transaction){
    const sign = transaction.amount <0 ? '-' : '+' //this is a shorthand expression for an if/if else statement

    const item = document.createElement('li'); //creates a new list element in our HTML

    item.classList.add(transaction.amount<0 ? 'minus' : 'plus');

    item.innerHTML =`
    ${transaction.typeDescription} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick= removeTransaction(${transaction.id})>x</button>` //the Math.abs method converts the transaction amounts into absolute numbers that do not take into consideration the negative/positive
    
    addList.appendChild(item); //adds the items to the HTML 
}
//Update values to the income/expense tabs on the app

function updateValues(){
    const amounts = transactions.map(function(transaction){  //this loops through the transactions and only returns each individual transaction amount
        return transaction.amount        
    })

    const total = amounts.reduce((acc, item)=> (acc += item),0).toFixed(2) //this takes the array returned from the amounts above. We run the method reduce which takes the argument accumulate and item variable. The return is an addition of alrady existing value and the new item. We made use of a fat arrow function
    //console.log(amounts)
    const income = amounts
    
    .filter(item=> item >0)
    .reduce((acc, item) => (acc += item),0)
    .toFixed(2)

    const expense = (
        amounts.filter(item=> item < 0)
        .reduce((acc, item)=> (acc += item), 0)*
        -1).toFixed(2);
  
    

    //console.log(expense) //to debug above

    balance.innerText = `Kshs.${total}`;
    incomeEarned.innerText = `Kshs.${income}`;
    expenseIncurred.innerText = `Kshs.${expense}`;
}

//remove transaction by id

function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !==id)

    updateLocalStorage()

    init()
}

//update local storage transactions

function updateLocalStorage(){
    localStorage.setItem('transactions' , JSON.stringify(transactions))
}

function init(){
    addList.innerHTML = " ";

    transactions.forEach(addTransactionsDOM); //this function takes in the addTransactionsDom function
    updateValues()
}

init() //on calling the init function, the transaction items should be appended to the website

//add vent Listeners for the form input

form.addEventListener('submit', addTransaction)