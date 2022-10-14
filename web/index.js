
const form = document.getElementById("formulario");


let transactionId = 0;

form.addEventListener("submit", function(event) {
    event.preventDefault();
    let transactionFormData = new FormData(form);
    let transactionTableRef = document.getElementById("transactionTable");
    //let newTransactionRowRef = transactionTableRef.insertRow(-1);

    //let newTypeCellRef = newTransactionRowRef.insertCell(0);
    //newTypeCellRef.textContent = transactionFormData.get("transactionType");
    let transactionTypeObj = transactionFormData.get("transactionType");

    //newTypeCellRef = newTransactionRowRef.insertCell(1);
    //newTypeCellRef.textContent = transactionFormData.get("transactionDescription");
    let transactionDescriptionObj = transactionFormData.get("transactionDescription");

   // newTypeCellRef = newTransactionRowRef.insertCell(2);
    //newTypeCellRef.textContent = transactionFormData.get("transactionPrice");
    let transactionPriceObj = transactionFormData.get("transactionPrice");

    //newTypeCellRef = newTransactionRowRef.insertCell(3);
    //newTypeCellRef.textContent = transactionFormData.get("transactionCategory");
    let transactionCategoryObj = transactionFormData.get("transactionCategory");

    //newTypeCellRef = newTransactionRowRef.insertCell(4);
    //newTypeCellRef.textContent = transactionFormData.get("transactionDate");
    let transactionDateObj = transactionFormData.get("transactionDate");
  
    
    //transactionId++; 

  /*let transactionDescriptionObj = document.getElementById("transactionDescription").value;
 let transactionTypeObj = document.getElementById("transactionType").value;
  let transactionPriceObj = document.getElementById("transactionPrice").value;
  let transactionCategoryObj = document.getElementById("transactionCategory").value;
 let transactionDateObj = document.getElementById("transactionDate").value;
    */

    let transactionFormDataObj = {
        'transactionType' : transactionTypeObj,
        'transactionDescription' : transactionDescriptionObj,
        'transactionPrice' : transactionPriceObj,
        'transactionCategory': transactionCategoryObj,
        'transactionDate': transactionDateObj,
        'transactionId': transactionId
    }

    let transactionJson = JSON.stringify(transactionFormDataObj);

    // ENVIO A LA API LA DATA
    fetch('http://localhost:3000/transactions', {
        method: 'Post',
        headers: {
            "Content-Type": "application/json",
        },
        body: transactionJson
    })
    .then((result) => {
        console.log(result);
    })

    refreshTable();

})


async function refreshTable(){
   let transactions = await getTransactionsFromApi();
   drawTable(transactions);
}

async function getTransactionsFromApi(){
    const response = await fetch('http://localhost:3000/transactions');
    let transactions = await response.json();
    return transactions;
}


async function addRowTransactionTable(transactions){
   // console.log(transactions)
    const transactionTable = document.getElementById("tbodyTable");
    const row = transactionTable.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    const cell6 = row.insertCell(5);
    const cell7 = row.insertCell(6);
    let botonEliminar = document.createElement("button");
    let botonEliminarconTexto = botonEliminar.innerText = `<button id='${transactions.id}' name='boton_eliminar' onclick='eliminarRegistro(this.id)'>Eliminar</button>`

    cell1.innerHTML = transactions.id;
    cell2.innerHTML = transactions.type;
    cell3.innerHTML = transactions.description;
    cell4.innerHTML = '$  ' + transactions.price;    
    cell5.innerHTML = transactions.category;
    cell6.innerHTML = transactions.date.slice(0,10);
    cell7.innerHTML = botonEliminarconTexto;

    if(transactions.type == 'Egreso'){
        cell2.style.background = 'Red';
        cell2.style.color = 'white';
    } else
        cell2.style.background = 'Green';
        cell2.style.color = 'white';

    return botonEliminarconTexto
}

async function drawTable(transactions){
    const tbodyTable = document.getElementById("tbodyTable").innerHTML= "";
    transactions.forEach(transaction => {
        addRowTransactionTable(transaction);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    refreshTable();
})

// Eliminar Transaccion
async function eliminarRegistro(id){
   const response = await fetch(`http://localhost:3000/transactions/${id}`, { method: 'DELETE' })
    const data = await response.json();
    console.log(data);
    refreshTable();
}
