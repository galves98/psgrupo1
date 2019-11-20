const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		descricao: {
			type: String,
			required: true
		},
		codigo: {
			type: Number,
			required: true,
			unique: true
		},
		quantidade: {
			type: Number,
			required: true,
			min: 0
		},
		lote: {
			type: Number,
			required: true
		},
		diavencimento: {
			type: Number,
			required: true
		},
			mesvencimento: {
				type: Number,
				required: true
		},
				anovencimento: {
					type: Number,
					required: true
		},
		ultimaRetirada: {
			type: Number,
			required: false
		}
	},
	{ timestamps: true }
);

const ProductModel = mongoose.model('ProductosOficial', productSchema);

class Product {
	static createNew(product) {
		return new Promise((resolve, reject) => {
			ProductModel.create(product)
				.then((result) => {
					resolve(result);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

//	static (codigo, quantidade) {
//		//falta arrumar logica do ficar negativo
//		const quant = ProductModel.findOne({codigo: codigo}, {quantidade:1});
//		console.log(quant);
//	if (quant<quantidade){
//		return new Promise((result, reject) => {
//			ProductModel.findOneAndUpdate(
//				{ codigo: codigo },
//				{ $inc: { quantidade: -quantidade }, $set: {ultimaRetirada: quantidade}},
//				{ new: true, runValidators: true }
//			)
//				.then((doc) => {
//					//console.log(doc);
//				})
//				.catch((err) => {
//					console.error(err);
//				});
//		});
//}
//else{
//	console.log("entrouaqui");
//}
//}

static remover(codigo, quantidade) {
	//falta arrumar logica do ficar negativo
	var quant;
		ProductModel.findOne({codigo: codigo}).then(produto=>{
		 quant = produto.quantidade;
		 console.log("PRoduto que queremos: ");
		 console.log(produto);
		 console.log("Quant: ");
		 console.log(quant);
		 console.log("Quantidade: ");
		 console.log(quantidade);

	if (quant>quantidade){
	return new Promise((resolve, reject) => {
		ProductModel.findOneAndUpdate(
			{ codigo: codigo },
			{ $inc: { quantidade: -quantidade }, $set: {ultimaRetirada: quantidade}},
			{ new: true, runValidators: true }
		).then((doc) => {
				console.log(doc);
				resolve(doc);
			}).catch((err) => {
				console.error(err);
				resolve(error);
			});
	});
}
else{
	console.log("entrouaqui");
}
});
}
	static produtosVencendo() {
		//mudar data pra 3 meses
		return new Promise((resolve, reject) => {
			var date = new Date()
			var nextDate = date.getDate() + 30;
			date.setDate(nextDate);
			ProductModel.find({ vencimento: { $lt: date } }, { _id: 0 }, { sort: { vencimento: 1 } })
				.then((result) => {
					resolve(result);
				})
				.catch((error) => {
					reject(error);
					console.log(error);
				});
		});
	}

	static lotesAcabando() {
		return new Promise((resolve, reject) => {
			ProductModel.find({ quantidade: { $lt: 100 } }, { _id: 0 })
				.then((result) => {
					resolve(result);
					// console.log('lotes acabando:');
					// console.log(result);
				})
				.catch((error) => {
					reject(error);
					console.log(error);
				});
		});
	}

	static retiradosRecente() {
		return new Promise((resolve, reject) => {
			var date = new Date()
			var nextDate = date.getDate() - 2;
			date.setDate(nextDate);
			ProductModel.find({ updatedAt: { $gt: date } }, { _id: 0 }, { sort: { updatedAt: -1 } })
				.then((result) => {
					resolve(result);
					console.log('retirados recentemente:');
					console.log(result);
				})
				.catch((error) => {
					reject(error);
					console.log(error);
				});
		});
	}

	static todosProdutos() {
		return new Promise((resolve, reject) => {
			ProductModel.find({})
				.then((results) => {
					resolve(results);
					console.log('todos os produtos:');
					console.log(results);
				})
				.catch((error) => {
					reject(error);
					console.log(error);
				});
		});
	}
}

module.exports = Product;
