var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var Product = require('../models/product')

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', { title: 'LOGIN' });
});

router.get('/cadastro', function(req, res, next) {
	res.render('cadastro', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
	res.render('home', { title: 'HOME' });
});

router.get('/estoque', function(req, res, next) {
	res.render('estoque', { title: 'ESTOQUE' });
});

router.get('/saida', function(req, res, next) {
	res.render('saida', { title: 'SAIDA' });
});

router.get('/entrada', function(req, res, next) {
	res.render('entrada', { title: 'ENTRADA' });
});

router.get('/teste-mongo', function(req, res, next) {
	res.render('teste-mongo', { title: 'TESTE MONGO' });
});

router.get('/product', (req, res, next)=>{
	res.render('product', {title: 'Product'});
});

//Pega formulário de cadastro e joga para o FireBase
router.post("/cadastro", function(req, res, next) {
	const usuario = {
		email: req.body.usuario.email,
		senha: req.body.usuario.senha
	}
	firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha).then((firebase)=>{
		//Se entrar aqui, é porque logou o usuario com sucesso
		res.render("cadastro");
		console.log("Cadastrado com sucesso");
		}).catch((error)=>{
		//Caso nao conseguiu logar usuario
		res.render("cadastro");
		console.log(error);
	});
});



//Pega formulário de Login e valida no Firebase
router.post("/", function(req, res, next) {
	console.log(req.body.usuario.email);
	const usuario = {
		email: req.body.usuario.email,
		senha: req.body.usuario.senha
	}
	firebase.auth().signInWithEmailAndPassword(usuario.email, usuario.senha).then((firebase)=>{
		//Se entrar aqui, é porque logou o usuario com sucesso
		res.redirect("home");
		console.log("Cadastrado com sucesso");
		}).catch((error)=>{
		//Caso nao conseguiu logar usuario
		res.render("login");
		console.log(error);
	});
});



// adiciona produtos no banco de dados
router.post('/entrada', function(req, res, next) {
	const NovoProduto = {
		descricao: req.body.descricao,
		codigo: req.body.codigo,
		quantidade: req.body.quantidade,
		lote: req.body.lote,
		vencimento: Date(req.body.vencimento)
	};
	//funcao do mongo que cria um novo produto no banco de dados
	Product.createNew(NovoProduto).then(result=>{
		console.log(result);
		console.log("produto cadastrado com sucesso!");
		res.redirect("/entrada");
	}).catch(error =>{
		console.log(error);
	})
});



//pagina que remove produtos do banco de dados
router.post('/saida', function(req, res, next) {
	const RetiraProduto = {
		codigo: req.body.codigo,
		quantidade: req.body.quantidade
//funcao do mongo que incrementa um valor sobre o outro
//$inc: { quantidade: -req.body.quantidade}
	};
	//funcao que modifica produtos do banco de dados
	//ta dando erro caralho!!
	Product.updateById(req.body.codigo, RetiraProduto).then(result=>{
		console.log(result);
		console.log("produto(s) removido com sucesso!");
		res.redirect("/saida");
	}).catch(error =>{
		console.log(error);
	})
});


//esse allproducts ta sendo utilizado so para teste
router.get('/allProducts', function(req, res, next) {

});


// mostra todos os produtos do banco de dados
router.post('/allProducts', function(req, res, next) {
	Product.getAll().then((products) =>{
    res.render('allProducts', { title: 'product', products });
  }).catch(err =>{
    res.redirect('/product');
  });
});

module.exports = router;
