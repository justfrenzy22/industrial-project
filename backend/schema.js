const mongoose = require('mongoose');
const { Schema } = mongoose;

const SuroviniSchema = new Schema({
    name : { type: String, required: true, }
});

const secondLevelSchema = new Schema({
    name: {type: String, required: true,},
    Surovini : { type: Schema.Types.ObjectId, ref: 'Surovini' },
});

const thirdLevelSchema = new Schema({
    name: {type: String, required: true,},
    secondLevel : {type: Schema.Types.ObjectId, ref: 'secondLevel'},
})

const KontragentSchema = new Schema({
    name: {type: String, required: true},
})

const SupplierSchema = new Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    website: { type: String, required: true },
    email: { type: String, required: true },
    employees: { type: String, required: true },
    another: { type: String, required: true },
    address_workshop: { type: String, required: true },
    kontragent: { type: Schema.Types.ObjectId, ref: 'Kontragent' },
})

const ProductSchema = new Schema({
    name: { type: String, required: true },
    measure: { type: String, required: true },
    density: { type: String, required: true },
    size: { type: String, required: true },
    weight: { type: String, required: true },
    description: { type: String, required: true },
    another: { type: String, required: true },
    code: { type: String, required: true },
    package: { type: String, required: true },
    cost: { type: String, required: true },
    supplier : { type: Schema.Types.ObjectId, ref: 'Supplier' },
    thirdLevel : { type: Schema.Types.ObjectId, ref: 'thirdLevel' },

})



const Surovini = mongoose.model('Surovini', SuroviniSchema);
const secondLevel = mongoose.model('secondLevel', secondLevelSchema);
const thirdLevel = mongoose.model('thirdLevel', thirdLevelSchema);
const Product = mongoose.model('Product', ProductSchema);
const Kontragent = mongoose.model('Kontragent', KontragentSchema);
const Supplier = mongoose.model('Supplier', SupplierSchema);
module.exports = { Surovini, secondLevel, thirdLevel, Product, Kontragent, Supplier };
    
// const Info = mongoose.model('Info', infoSchema);

// module.exports = Product;