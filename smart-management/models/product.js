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
		vencimento: {
			type: Date,
			required: true
		}
	},
	{ timestamps: true }
);

const ProductModel = mongoose.model('ProductArtLima', productSchema);

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

	static remover(codigo, quantidade) {
		//falta arrumar logica do ficar negativo
		return new Promise((result, reject) => {
			ProductModel.findOneAndUpdate(
				{ codigo: codigo },
				{ $inc: { quantidade: -quantidade } },
				{ new: true, runValidators: true }
			)
				.then((doc) => {
					console.log(doc);
				})
				.catch((err) => {
					console.error(err);
				});
		});
	}

	static produtosVencendo() {
		//mudar data pra 3 meses
		return new Promise((resolve, reject) => {
			ProductModel.find({ vencimento: { $lt: new Date('2019-12-12') } }, { _id: 0 }, { sort: { vencimento: 1 } })
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
				})
				.catch((error) => {
					reject(error);
					console.log(error);
				});
		});
	}

	static retiradosRecente() {
		return new Promise((resolve, reject) => {
			ProductModel.find({ updatedAt: { $lt: new Date('2019-12-12') } }, { _id: 0 }, { sort: { updatedAt: -1 } })
				.then((result) => {
					resolve(result);
				})
				.catch((error) => {
					reject(error);
					console.log(error);
				});
		});
	}

	static todosProdutos() {
		return new Promise((resolve, reject) => {
			ProductModel.find({}).then((results) => {
					resolve(results);
				}).catch((error) => {
					reject(error);
					console.log(error);
				});
		});
	}
}

module.exports = Product;
