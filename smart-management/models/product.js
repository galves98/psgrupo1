const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    descricao:{
        type: String,
        required: true
    },
    codigo:{
        type: Number,
        required: true,
        unique: true
    },
    quantidade:{
        type: Number,
        required: true
    },
    lote:{
        type: Number,
        required: true
    },
    vencimento: {
        type: Date,
        required: true
    }
}, {timestamps: true});

const ProductModel = mongoose.model('ProductArtLima', productSchema);

class Product {
    static createNew(product){
        return new Promise((resolve,reject)=>{
            ProductModel.create(product).then(result =>{
                resolve(result);
            }).catch(error=>{
                reject(error);
            });
        });
    };

    static remover(codigo, quantidade){
        return new Promise ((result, reject)=>{
            ProductModel.findOneAndUpdate(codigo, {$inc: {quantidade: - quantidade}}).exec().then(result =>{
                resolve(result);
            }).catch((error)=>{
                reject(error);
            });
        });
    };
}


module.exports = Product;
