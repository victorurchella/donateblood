// configurando o servidor
const express = require("express")
const server = express()

// configurar o servidor para apresentar os arquivos estaticos
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({ extended: true}))

// configurar db
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '2908',
    host: 'localhost',
    port: 5432,
    database: 'doacaoSangue'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, //boolean, true or false
})
 
// configurar apresentação da pagina
server.get("/", function(req, res) {

    db.query("SELECT * FROM doadores", function(err, result) {
        if (err) return res.send("Erro no banco de dados.")

        const doadores = result.rows
        return res.render("index.html", {doadores})
    })

})

server.post("/", function(req, res) {
    //pegar dados do form
    const nome = req.body.nome
    const email = req.body.email
    const sangue = req.body.sangue

    // fluxo erro de preenchimento
    if (nome == "" || email == "" || sangue == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // colocar valores do banco de dados
    const query = `
        INSERT INTO doadores ("nome", "email", "sangue") 
        VALUES ($1, $2, $3)`
        
    const values = [nome, email, sangue]

    db.query(query, values, function(err) {
        if (err) return res.send("erro no banco de dados.")

        return res.redirect("/")
    })

}) 

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("Iniciei o servidor!")
}) 