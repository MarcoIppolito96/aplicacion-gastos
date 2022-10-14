const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
let newArray = [];
app.use(
    express.urlencoded({
        extended: true
    
    })
)

app.use(express.json({
    type: "*/*"
}))

app.use(cors());

//Requiero el modulo de Postgress
const { Client } = require('pg');
const { response } = require('express');


//OBETENER LAS CATEGORÍAS
const obtenerCategorias = async () => {

//Creo una instancia de NodePostgress
const client = new Client({
    user: 'euokwidrckmnwd',
    host: 'ec2-3-211-6-217.compute-1.amazonaws.com',
    database: 'd9rj8os31p5qbp',
    password: '585210c0044caa3007ed480e2f00260d59cb2419ebfe0b4d8e5a87926ef312ad',
    port: 5432,
    ssl:{
        rejectUnauthorized: false,
    },
  });

//Conecto la instancia a la DB
await client.connect();

const res = await client.query('SELECT * FROM categories');

const result = res.rows;
await client.end();

return result;
};

obtenerCategorias()
.then((result) => {
    console.log(result);
})


app.post('/transactions', (req, res) => {
    console.log(req.body);
    saveTransactionsInDatabase(req.body.transactionDate, req.body.transactionDescription, req.body.transactionPrice,req.body.transactionType,
   req.body.transactionCategory);

})

app.get('/transactions', async (req, res) => {
    //res.send(JSON.stringify(newArray))
    const transactions = await getTransactionsInDatabase();
    res.send(transactions);
})

app.get('/transactions/:id', (req, res) => {
    const transactionId = req.params.id;
    const selectedTransaction = req.body.filter(transaction => transaction.transactionId == transactionId)
    res.send(selectedTransaction);
})

// ELIMINAR TRANSACCION 

app.delete('/transactions/:id', (req, res) => {
    const transactionId = req.params.id;
    const deletedTransaction = deleteTransactionInDatabase(transactionId);
    res.send(deletedTransaction);
    })


app.listen(port, () => {
    console.log(`Estoy ejecutandome en http://localhost:${port}`)
})

// GUARDO LAS TRANSACCIONES EN LA DB
async function saveTransactionsInDatabase(transactionDate, transactionDescription,transactionPrice,transactionType, transactionCategory){
        //Creo una instancia de NodePostgress
const client = new Client({
    user: 'euokwidrckmnwd',
    host: 'ec2-3-211-6-217.compute-1.amazonaws.com',
    database: 'd9rj8os31p5qbp',
    password: '585210c0044caa3007ed480e2f00260d59cb2419ebfe0b4d8e5a87926ef312ad',
    port: 5432,
    ssl:{
        rejectUnauthorized: false,
    },
  });

//Conecto la instancia a la DB
await client.connect();
const queryToInsert = `INSERT INTO transactions (date, description,price,type,category) VALUES ('${transactionDate}', '${transactionDescription}','${transactionPrice}', '${transactionType}', '${transactionCategory}');`;
const res = await client.query(queryToInsert);
console.log(`Se esta ejecutando: ${queryToInsert}`);
const result = res.rows;
await client.end();

return result;
}


// PIDO LAS TRANSACCIONES A LA DB
async function getTransactionsInDatabase(){
const client = new Client({
    user: 'euokwidrckmnwd',
    host: 'ec2-3-211-6-217.compute-1.amazonaws.com',
    database: 'd9rj8os31p5qbp',
    password: '585210c0044caa3007ed480e2f00260d59cb2419ebfe0b4d8e5a87926ef312ad',
    port: 5432,
    ssl:{
        rejectUnauthorized: false,
    },
  });

//Conecto la instancia a la DB
await client.connect();
const queryToInsert = `SELECT id, date, description, price, type, category FROM public.transactions;`;
debugger;
const res = await client.query(queryToInsert);
console.log(`Se esta ejecutando: ${queryToInsert}`);
const result = res.rows;
await client.end();

return result;
}

//BORRO TRANSACCION EN LA DB
async function deleteTransactionInDatabase(transactionId){
    const client = new Client({
        user: 'euokwidrckmnwd',
        host: 'ec2-3-211-6-217.compute-1.amazonaws.com',
        database: 'd9rj8os31p5qbp',
        password: '585210c0044caa3007ed480e2f00260d59cb2419ebfe0b4d8e5a87926ef312ad',
        port: 5432,
        ssl:{
            rejectUnauthorized: false,
        },
      });
    
    //Conecto la instancia a la DB
    await client.connect();
    const queryToInsert = `DELETE FROM transactions WHERE id=${transactionId};`;
    
    const res = await client.query(queryToInsert);
    console.log(`Se esta ejecutando: ${queryToInsert}`);
    const result = res.rows;
    await client.end();
    
    return result;
    }
    