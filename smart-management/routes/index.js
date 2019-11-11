var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var Product = require('../models/product')

function ensureAuthenticated (req,res,next){
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
			return next();
	  } else {

			// No user is signed in.
			res.redirect("/");

	}
	});
};

router.get('/', function(req, res, next) {
	res.render('login', { title: 'LOGIN' });
});
/* GET home page. */
function irparahome (){
router.get('/', function(req, res, next) {
	res.render('login', { title: 'LOGIN' });
});
}
router.get('/cadastro',ensureAuthenticated, function(req, res, next) {
	res.render('cadastro', { title: 'Express' });
});

router.get('/home',ensureAuthenticated, function(req, res, next) {
	res.render('home', { title: 'HOME' });
});

router.get('/estoque',ensureAuthenticated, function(req, res, next) {
	res.render('estoque', { title: 'ESTOQUE' });
 Product.todosProdutos();
});

router.get('/saida',ensureAuthenticated, function(req, res, next) {
	res.render('saida', { title: 'SAIDA' });
});

router.get('/entrada',ensureAuthenticated, function(req, res, next) {
	res.render('entrada', { title: 'ENTRADA' });
});

router.get('/teste-mongo',ensureAuthenticated, function(req, res, next) {
	res.render('teste-mongo', { title: 'TESTE MONGO' });
});

//Pega formulário de cadastro e joga para o FireBase
router.post("/cadastro",ensureAuthenticated, function(req, res, next) {
	const usuario = {
		email: req.body.usuario.email,
		senha: req.body.usuario.senha
	}
	firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha).then((firebase)=>{
		res.render("cadastro");							//Se entrar aqui, é porque logou o usuario com sucesso
		console.log("Cadastrado com sucesso");
		alert("Cadastrado com sucesso");
		}).catch((error)=>{
		//Caso nao conseguiu logar usuario
		res.render("cadastro");
		console.log(error);
		alert("Erro no cadastro");
	});
});



//  '/'
router.get('/', function(req, res, next) {
	res.render('login', { title: 'LOGIN' });
});
router.post("/", function(req, res, next) {    //Pega formulário de Login e valida no Firebase
	console.log(req.body.usuario.email);
	const usuario = {
		email: req.body.usuario.email,
		senha: req.body.usuario.senha
	}
	firebase.auth().signInWithEmailAndPassword(usuario.email, usuario.senha).then((firebase)=>{
		//Se entrar aqui, é porque logou o usuario com sucesso

		res.redirect("home");
		console.log("Logado com sucesso");
		}).catch((error)=>{
		//Caso nao conseguiu logar usuario
		res.render("login");
		console.log(error);
	});
});



//ENTRADA
router.get('/entrada', function(req, res, next) {
		res.render('entrada', { title: 'ENTRADA' });
});

router.post('/entrada', function(req, res, next) {
		const NovoProduto = {
			descricao: req.body.descricao,
			codigo: req.body.codigo,
			quantidade: req.body.quantidade,
			lote: req.body.lote,
			vencimento: Date(req.body.vencimento)
		};
		Product.createNew(NovoProduto).then(result=>{
			console.log(result);
			console.log("produto cadastrado com sucesso!");
			res.redirect("/entrada");
		}).catch(error =>{
			console.log(error);
		})
});


//SAIDA
router.get('/saida', function(req, res, next) {
	res.render('saida', { title: 'SAIDA' });
});

router.post('/saida', function(req, res, next) {
	const codigo = req.body.codigo;
	const quantidade = req.body.quantidade;
	Product.remover(codigo, quantidade).then(results =>{
		console.log(results);
		console.log("produto removido com sucesso!");
		res.redirect("/entrada");
				}).catch(error =>{
					console.log(error);
				})
			});



//HOME
router.get('/home', function(req, res, next) {
	res.render('home', { title: 'HOME' });
	 Product.produtosVencendo();
	 Product.lotesAcabando();
	 Product.retiradosRecente();
});

router.post('/home', function(req, res, next) {
			});


// ALL PRODUCTS
router.get('/allProducts', function(req, res, next) {
	res.render('allProducts', { title: 'ALLPRODUCTS' });
	Product.todosProdutos();
});





module.exports = router;
