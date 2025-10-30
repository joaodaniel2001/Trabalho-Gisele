
const mysql2 = require('mysql2/promise')
const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

const pool = mysql2.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'projeto_gisele',
    port: 3306
})

pool.getConnection()
    .then(connection => {
        // Se conexão bem-sucedida
        console.log(`Pool de conexão bem-sucedida!`);
        connection.release();

        app.listen(port, () => {
            console.log(`http://localhost:${port}`);
        });
    })
    .catch(error => {
        // Em caso de erro
        console.error(`Erro ao conectar ao Banco de Dados: ${error.message}`);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.send('Foi')
})
