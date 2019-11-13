var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var Product = require('../models/product');

//  ESTOQUE
router.get('/estoque', function(req, res, next) {
	Product.todosProdutos()
		.then((product) => {
			console.log(product);
			res.render('estoque', { title: 'ESTOQUE', product });
		})
		.catch((error) => {
			console.log(error);
		});
});

// TESTE-MONGO
router.get('/teste-mongo', function(req, res, next) {
	res.render('teste-mongo', { title: 'TESTE MONGO' });
});

// PRODUCTS
router.get('/product', (req, res, next) => {
	res.render('product', { title: 'Product' });
});

// CADASTRO
router.get('/cadastro', function(req, res, next) {
	//Pega formulário de cadastro e joga para o FireBase
	res.render('cadastro', { title: 'Express' });
});

router.post('/cadastro', function(req, res, next) {
	const usuario = {
		email: req.body.usuario.email,
		senha: req.body.usuario.senha
	};
	firebase
		.auth()
		.createUserWithEmailAndPassword(usuario.email, usuario.senha)
		.then((firebase) => {
			res.render('cadastro'); //Se entrar aqui, é porque logou o usuario com sucesso
			console.log('Cadastrado com sucesso');
		})
		.catch((error) => {
			//Caso nao conseguiu logar usuario
			res.render('cadastro');
			console.log(error);
		});
});

//  '/'
router.get('/', function(req, res, next) {
	res.render('login', { title: 'LOGIN' });
});
router.post('/', function(req, res, next) {
	//Pega formulário de Login e valida no Firebase
	console.log(req.body.usuario.email);
	const usuario = {
		email: req.body.usuario.email,
		senha: req.body.usuario.senha
	};
	firebase
		.auth()
		.signInWithEmailAndPassword(usuario.email, usuario.senha)
		.then((firebase) => {
			res.redirect('home'); //Se entrar aqui, é porque logou o usuario com sucesso
			//window.alert("Cadastrado com sucesso");
			console.log('Cadastrado com sucesso');
		})
		.catch((error) => {
			//Caso nao conseguiu logar usuario
			res.render('login');
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
	Product.createNew(NovoProduto)
		.then((result) => {
			console.log(result);
			console.log('produto cadastrado com sucesso!');
			res.redirect('/entrada');
		})
		.catch((error) => {
			console.log(error);
		});
});

//SAIDA
router.get('/saida', function(req, res, next) {
	res.render('saida', { title: 'SAIDA' });
});

router.post('/saida', function(req, res, next) {
	const codigo = req.body.codigo;
	const quantidade = req.body.quantidade;
	Product.remover(codigo, quantidade)
		.then((results) => {
			console.log(results);
			console.log('produto removido com sucesso!');
			res.redirect('/saida');
		})
		.catch((error) => {
			console.log(error);
		});
});

//HOME
router.get('/home', function(req, res, next) {
	res.render('home', { title: 'HOME' });
	Product.produtosVencendo();
	Product.lotesAcabando();
	Product.retiradosRecente();
});

router.post('/home', function(req, res, next) {});

//ALL PRODUCTS
router.get('/allProducts', function(req, res, next) {
	res.render('allProducts', { title: 'ALLPRODUCTS' });
	Product.todosProdutos();
});

// router.get('/allProducts', function(req, res){
// 	 ProductModel.connect(url, function(err, db){
// 		 				var str = "";
//             var cursor = db.collection('ProductArtLima').find();
//             cursor.each(function(err, item) {
//                 if (item != null) {
//                     str = str + "   id  " + "</br>";
//                 }
//             });
//             res.send(str);
//             db.close();
//         });
//     });

module.exports = router;
