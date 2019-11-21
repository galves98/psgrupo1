var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var Product = require('../models/product');

//Garante que o usuario está logado para ter acesso à pagina
function ensureAuthenticated(req, res, next) {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			return next();
		} else {
			// No user is signed in.
			res.redirect('/');
		}
	});
}

//  ESTOQUE
router.get('/estoque', ensureAuthenticated, function(req, res, next) {
	Product.todosProdutos()
		.then((product) => {
			console.log(product);
			res.render('estoque', { title: 'ESTOQUE', product });
		})
		.catch((error) => {
			console.log(error);
		});
});

//FUNCAO SIGOUT DO USUARIO
router.get('/signout', function(req, res, next) {
	firebase
		.auth()
		.signOut()
		.then(function() {
			res.redirect('/');
			// Sign-out successful.
		})
		.catch(function(error) {
			// An error happened
		});
});

//NEWPASSWORD
router.get('/newpassword', function(req, res, next) {
	res.render('newpassword', { title: 'NOVA SENHA' });
});
router.post('/newpassword', function(req, res, next) {
	//Pega email e enviar solicitação de nova senha

	console.log(req.body.usuario.email);
	const usuario = {
		email: req.body.usuario.email
	};
	firebase
		.auth()
		.sendPasswordResetEmail(usuario.email)
		.then((firebase) => {
			res.redirect('/'); //Se entrar aqui, é porque email foi enviado
			//window.alert("Cadastrado com sucesso");
			console.log('Email enviado com sucesso');
		})
		.catch((error) => {
			//Caso nao enviar
			console.log(error);
		});
});

// TESTE-MONGO
router.get('/teste-mongo', ensureAuthenticated, function(req, res, next) {
	res.render('teste-mongo', { title: 'TESTE MONGO' });
});

// PRODUCTS
router.get('/product', ensureAuthenticated, (req, res, next) => {
	res.render('product', { title: 'Product' });
});

// CADASTRO
router.get('/cadastro', ensureAuthenticated, function(req, res, next) {
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
router.get('/entrada', ensureAuthenticated, function(req, res, next) {
	res.render('entrada', { title: 'ENTRADA' });
});

router.post('/entrada', function(req, res, next) {
	const NovoProduto = {
		descricao: req.body.descricao,
		codigo: req.body.codigo,
		quantidade: req.body.quantidade,
		lote: req.body.lote,
		diavencimento: req.body.diavencimento,
		mesvencimento: req.body.mesvencimento,
		anovencimento: req.body.anovencimento
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

//SAIDA
router.get('/saida', ensureAuthenticated, function(req, res, next) {
	res.render('saida', { title: 'SAIDA' });
});

router.post('/saida', function(req, res, next) {
	const codigo = req.body.codigo;
	const quantidade = req.body.quantidade;
	Product.remover(codigo, quantidade);
	res.render('saida', { title: 'SAIDA' });
});

//HOME
router.get('/home', function(req, res, next) {
	Product.todosProdutos().then((vencendo) => {
		var today = new Date();
		var quaseVencidos = new Array();
		var n = 0;
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var oneDay = 24 * 60 * 60 * 1000;
		console.log(vencendo);
		for (var i = 0; i < vencendo.length; i++) {
			var firstDate = new Date(yyyy, mm, dd);
			var secondDate = new Date(vencendo[i].anovencimento, vencendo[i].mesvencimento, vencendo[i].diavencimento);
			var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
			console.log('---------------------------------------------------');
			//		console.log(vencendo[i].anovencimento);
			console.log(diffDays);
			if (diffDays < 31) {
				quaseVencidos[n] = vencendo[i];
				n++;
			}
		}
		res.render('home', { title: 'HOME', quaseVencidos });
	});
});

router.post('/home', function(req, res, next) {});

//ALL PRODUCTS
router.get('/allProducts', ensureAuthenticated, function(req, res, next) {
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
