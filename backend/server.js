const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const { youtube } = require('scrape-youtube');
const rawMaterials = require('./routes/rawMaterials');
const create = require('./routes/create');
const { Surovini, secondLevel, thirdLevel, Product, Kontragent, Supplier } = require('./schema');
const { PrismaClient } = require('@prisma/client');

// dotenv
require('dotenv').config();

const prisma = new PrismaClient();




const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test1')
.then(() => console.log(`====================================\n|  MongoDB connected successfully! |\n====================================`))
.catch((err) => console.log(`Error connecting to MongoDBa ${err}`) );


// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// app use routes
app.use('/api/auth', require('./routes/auth'))
// app.use('/', create);
// app.use('/create', rawMaterials);

// CORS 
app.use(cors());

const jwt_key = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
    console.log(`if it exists`, req.headers.authorization)
    const token = req.headers.authorization;
    console.log(`token?`, token);
    if (!token) {
        res.status(401).json({message: 'Token not found'});
        console.log(`done 1`)
        return;
    }
    
    jwt.verify(token, jwt_key, (err, decoded) => {
        if (err) {
            res.status(401).json({message : 'Token is invalid'});
            console.log(`done 2`)
            return;
        }
        req.user = decoded;
        // res.json({status: 200 , message: 'Token is valid, congrats'});
        next();
    })
    console.log(`its done`)
}

//app.use(authenticateToken);

app.get('/', (req, res) => {
    res.json({status: 200, message: 'Server is running'});
});

// test if backend works
app.get('/get',authenticateToken , async (req, res) => {
    console.log(`req.user? `, req.user);
    const { videos } = await youtube.search('go fuck yourself',);
    console.log(`videos`, videos);
    res.json({status: 200, message: videos, })
});

app.post('/search', async (req, res) => {
    console.log(`body`, req.body.name);
    const prod = req.body.name;

    try {
        const products = await Product.find({name: prod});
        const info = await Product.find({});
        return res.status(200).json({info: info, products : products, message: 'Successful search', })
    } catch (err) {
        console.error(`EROR`, err)
        return res.status(500).json({message: `Server error \n ${err}`});
    }
});


app.post('/getAll', async (req, res) => {
    console.log(`getAll req.body`, req.body);
    const { surovini, vtoro, kontragent, supplier, treto } = req.body;
    const countSurovini = await prisma.surovini.findMany();
    //  (chosen && chosen.surovini && chosen.surovini.id) ? const countVtoro = await prisma.secondLevel.findMany({ where: {suroviniId: chosen.surovini.id  } })  : const countVtoro = await prisma.secondLevel.findMany();
    let countVtoro;
    console.log(`debug1`);
    if ( surovini && surovini.id) {
      console.log(`debug2`);
        countVtoro = await prisma.secondLevel.findMany({ where: {suroviniId: surovini.id  } });
        console.log(`countVtoro`, countVtoro);
    }
    let countTreto;
    if ( vtoro && vtoro.id) {
        countTreto = await prisma.thirdLevel.findMany({ where: {secondLevelId: vtoro.id  } });
        console.log(`countTreto`, countTreto);
    }

    const countKontragent = await prisma.kontragent.findMany();
    // const countSupplier = await prisma.supplier.findMany({ where: {  } });
    let countSupplier;
    if ( kontragent && kontragent.id ) {
      console.log(`debug3`, kontragent);
        countSupplier = await prisma.supplier.findMany({ where: { kontragentId: kontragent.id } });
        console.log(`countSupplier`, countSupplier);
    }
    let countProducts;
    console.log(`debug4`, treto);
    if ( treto && treto.id) {
      countProducts = await prisma.product.findMany({ where: { thirdLevelId: treto.id  }, include: { supplier: { select: { name: true } } } });
    }
    console.log(`countProducts`, countProducts);
    // const countProducts = await prisma.product.findMany();
    // console.log(`surovini`, countSurovini);

    return res.json({message: 'Success', surovini: countSurovini, vtoro: countVtoro, treto: countTreto, kontragent: countKontragent, supplier : countSupplier, products: countProducts});
})

app.get('/geta/:schema', async (req, res) => {
  const { schema } = req.params;
  try {
    let data;
    switch (schema) {
      case '0':
        data = await Surovini.find({});
        break;
      case '1':
        data = await secondLevel.find({}).populate('Surovini');
        break;
      case '2':
        data = await thirdLevel.find({}).populate('secondLevel');
        break;
      case '3':
        data = await Kontragent.find({});
        break;
      case '4':
        data = await Supplier.find({}).populate('kontragent');
        break;
      case '5':
        data = await Product.find({}).populate('supplier').populate('thirdLevel');
        break;
      default:
        return res.json({ status: 404, message: 'Invalid schema' });
    }
    return res.json({ status: 200, results: data, message: 'Success' });
  } catch (err) {
    return res.json({ status: 500, message: 'Server error' });
  }
});

// app.get('/getSelect/:schema')
app.get('/getSelect/:schema', async (req, res) => {
  const { schema } = req.params;
  try {
    let data;
    switch (schema) {
      case 'Surovini' || 'surovini':
        data = await Surovini.find({});
        break;
      case 'secondLevel':
        data = await secondLevel.find({});
        break;
      case 'thirdLevel':
        data = await thirdLevel.find({});
        break;
      case 'kontragent':
        data = await Kontragent.find({});
        break;
      case 'supplier':
        data = await Supplier.find({});
        break;
      default:
        return res.json({ status: 404, message: 'Invalid schema' });
    }
    return res.json({ status: 200, schema: data, message: 'Success' });
  } catch (err) {
    return res.json({ status: 500, message: 'Server error' });

  }
})

app.post('/getFiltered/:schema', async (req, res) => {
  console.log(`getFiltered`);
  const { schema } = req.params;
  const { id } = req.body;
  console.log(`req body get filtered`, req.body, schema);
  console.log(`schema`, schema);
  try {
    let data;
    switch (schema) {
      case '0':
        data = await prisma.secondLevel.findMany({ where: { suroviniId: id } });
        break;
      case '1':
        data = await prisma.thirdLevel.findMany({ where: { secondLevelId: id } });
        break;
      case '2':
        data = await prisma.product.findMany({ 
          where: { thirdLevelId: id },
          include: {
            supplier: {
              select: {
                name: true
              }
            }
          }
        });
        break;
      case '3':
        data = await prisma.supplier.findMany({ where: { kontragentId: id } });
        break;
      case '4':
        data = await prisma.supplier.findMany({ where: { kontragentId: id } });
        break;
      default:
        return res.json({ status: 404, message: 'Invalid schema' });
    }
    console.log(`data`, data);
    return res.json({ status: 200, schema: data, message: 'Success' });
  }
  catch (err) {
    console.log(`err`, err);
    return res.json({ status: 500, message: 'Server error' });
  }
});



app.post('/update/:schema/:id', async (req, res) => {
  console.log(`goes there`);
  const { id , schema} = req.params; // Get the ID from the request params
  const { name } = req.body; // Get the new name from the request body
  console.log(`1`);
  console.log(`schema`, req.body);
  const text = { 200: 'Не е намерен такъв артикул', 200: 'Артикула е променен успешно' };
  try {
      switch (schema) {
        case '0': {
          console.log(`req.body`, req.body);
          const updatedDoc = await prisma.surovini.update({where: { id: id, }, data: { name: name, },});
          if (updatedDoc) return res.json({status: 200, message: text[200]});
            return res.json({status: 404, message: text[404]});
          break;
        }
        case '1': {
          console.log(`req.body`, req.body);
          const { Surovini } = req.body;
          console.log(Surovini);
          const updatedDoc = await prisma.secondLevel.update({where: { id: id, },data: { name: name, suroviniId: Surovini },});
          if (updatedDoc) return res.json({status: 200, message: text[200]});
            return res.json({status: 404, message: text[404]});
          break;
        }
        case '2' : {
          const { secondLevel } = req.body;
          const updatedDoc = await prisma.thirdLevel.update({where: { id: id, },data: { name: name, secondLevelId: secondLevel }});
          if (updatedDoc) return res.json({status: 200, message: text[200]});
          return res.json({status: 404, message: text[404]});
          break;
        }
        case '3' : {
          const updatedDoc = await prisma.kontragent.update({where: { id: id, },data: { name: name },});
          if (updatedDoc) return res.json({status: 200, message: text[200]});
          return res.json({status: 404, message: text[404]});
          break;
        }
        case '4' : {
          const { country, city, address, website, email, employees, another, address_workshop } = req.body;
          const updatedDoc = await prisma.supplier.update({where: { id: id, },data: { name: name, country, city, address, website, email, employees, another, address_workshop }});
          if (updatedDoc) return res.json({status: 200, message: text[200]});
          return res.json({status: 404, message: text[404]});
          break;
          // const updatedDocument = await Supplier.findByIdAndUpdate(id, {name, country, city, address, website, email, employees, another, address_workshop}, {new : true});
          // if (!updatedDocument) return res.json({status: 404, message: text[404]});
          // return res.json({status: 200, message: text[200]});
          break;
        }
        case '5' : {
          const { measure, density, size, weight, description, another, code, package, cost, supplier, thirdLevel } = req.body;
          const updatedDoc = await prisma.product.update({where: { id: id, },data: { name: name, measure, density, size, weight, description, another, code, package, cost, supplier, thirdLevel }});
          if (updatedDoc) return res.json({status: 200, message: text[200]});
          return res.json({status: 404, message: text[404]});
          break;
          // const updatedDocument = await Product.findByIdAndUpdate(id, {name, measure, density, size, weight, description, another, code, package, cost, supplier, thirdLevel}, {new : true});
          // if (!updatedDocument) return res.json({status: 404, message: text[404]});
          // return res.json({status: 200, message: text[200]});
          // break;
        }
        
          
      }
    // Find the document in the MongoDB collection by ID and update the name
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/delete/:schema/:id', async (req, res) => {
  console.log(`in another demencion`);
  console.log(`req.params`, req.params);
  const { id, schema } = req.params;
    const text = { 404: 'Не е намерен такъв артикул', 200: 'Аритикула е изтрит успешно' };
  try {
    switch (schema) {
      case '0': {
          const deletedDoc = await prisma.surovini.delete({where: { id: id }});
          if (deletedDoc) return res.json({status: 200, message: text[200] });
          return res.json({status : 404, message: text[404]});
        break;
      }
      case '1' : {
        const deletedDoc = await prisma.secondLevel.delete({where: { id: id }});
        if (!deletedDoc) return res.json({status: 404, message: text[404]});
        return res.json({status: 200, message: text[200]});
        break;
      }
      case '2' : {
        const deletedDoc = await prisma.thirdLevel.delete({where: { id: id }});
        if (!deletedDoc) return res.json({status: 404, message: text[404]});
        return res.json({status: 200, message: text[200]});
        break;
      }
      case '3' : {
        const deletedDoc = await prisma.kontragent.delete({where: { id: id }});
        if (!deletedDoc) return res.json({status: 404, message: text[404]});
        return res.json({status: 200, message: text[200]});
        break;
      }
      case '4' : {
        const deletedDoc = await prisma.supplier.delete({where: { id: id }});
        if (!deletedDoc) return res.json({status: 404, message: text[404]});
        return res.json({status: 200, message: text[200]});
        break;
      }
      case '5' : {
        const deletedDoc = await prisma.product.delete({where: { id: id }});
        if (!deletedDoc) return res.json({status: 404, message: text[404]});
        return res.json({status: 200, message: text[200]});
        break;
      }
    }
  } catch (err) {
    return res.json({status: 500, message: 'Server error'})
  }
})

app.get('/deleteAll/:schema', async (req, res) => {
  const schema = req.params.schema;
  console.log(`schema something`, schema);
  try {
    switch (schema) {
      case '0': {
        await Surovini.deleteMany({});
        return res.json({ status: 200, message: 'Успешно изтриване на Суровините' });
      }
      case '1': {
        await secondLevel.deleteMany({});
        return res.json({ status: 200, message: 'Успешно изтриване на второто ниво' });
      }
      case '2': {
        await thirdLevel.deleteMany({});
        return res.json({ status: 200, message: 'Успешно изтриване на третото ниво' });
      }
      case '3': {
        await Kontragent.deleteMany({});
        return res.json({ status: 200, message: 'Успешно изтриване на контрагентите' });
      }
      case '4': {
        await Supplier.deleteMany({});
        return res.json({ status: 200, message: 'Успешно изтриване на доставчиците' });
      }
      case '5': {
        await Product.deleteMany({});
        return res.json({ status: 200, message: 'Успешно изтриване на продуктите' });
      }
      default:
        return res.status(404).json({ status: 404, message: 'Невалидна схема' });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, message: `Грешка при изтриването \n ${err}` });
  }
});

app.post('/create/:ida', async (req, res) => {
    const { ida } = req.params;
    console.log(`req, body`, req.body);
    try {
      let result;
      let message;
  
      switch (ida) {
        case '0': {
          const { text } = req.body;
          const suroviniCheck = await prisma.surovini.findUnique({ where: { name: text } });
          if (suroviniCheck) {
            result = 400;
            message = 'Суровината вече съществува';
          } else {
            await prisma.surovini.create({ data: { name: text } });
            result = 200;
            message = 'Суровината е създадена успешно';
          }
          break;
        }
        case '1': {
          console.log(`dali tova liubov e`, req.body);
          const { id, text, name } = req.body;
          const vtoroCheck = await prisma.secondLevel.findUnique({ where: { name: text } });
          if (vtoroCheck) {
            result = 400;
            message = 'Второто ниво суровина вече съществува';
          } else {
            await prisma.secondLevel.create({ data: { name: text, suroviniId: id } });
            result = 200;
            message = 'Второто ниво суровина е създадена успешно';
          }

          break;
        }
        case '2': {
          const { id, text } = req.body;
          const tretoCheck = await prisma.thirdLevel.findUnique({ where: { name: text } });
          if (tretoCheck) {
            result = 400;
            message = 'Третото ниво суровина вече съществува';
          } else {
            await prisma.thirdLevel.create({ data: { name: text, secondLevelId: id } });
            result = 200;
            message = 'Третото ниво суровина е създадена успешно';
          }
          break;
        }
        case '3': {
          const { id, text } = req.body;
          const kontragentCheck = await prisma.Kontragent.findUnique({ where: { name: text } });
          if (kontragentCheck) {
            result = 400;
            message = 'Контрагента вече съществува';
          }
          else {
            await prisma.Kontragent.create({ data: { name: text } });
            result = 200;
            message = 'Контрагента е създадена успешно';
          }
          break;
        }
        case '4': {
          const { name, country, city, address, website, email, employees, another, address_workshop, phone, id } = req.body;
          const supplierCheck = await prisma.supplier.findUnique({ where: { name: name } });
          if (supplierCheck) {
            result = 400;
            message = 'Доставчика вече съществува';
          }
          else {
            await prisma.supplier.create({ data: { name: name, country : country, city : city, address : address, website : website, email: email, employees: employees, another: another, address_workshop: address_workshop, kontragentId: id } });
            result = 200;
            message = 'Доставчика е създадена успешно';
          }
          break;
        }
        case '5': {
          console.log(`aall \n asdsadajdasjdas \n asjdshajdksahdjkasn`, req.body);
          const {treto, name, measure, density, size, weight, description, another, supplier, code, package, cost} = req.body;
          const productCheck = await prisma.product.findUnique({ where: { name: name } });
          if (productCheck) {
            result = 400;
            message = 'Продукта вече съществува';
          }
          else {
            await prisma.product.create({ data: { name: name, density: density, measure: measure, size: size, weight: weight, description: description, another: another, code: code, package: package, cost: cost, thirdLevelId: treto.id, supplierId: supplier.id } })
            result = 200;
            message = 'Продукта е създадена успешно';
          }
          break;
        }
        // default:
        //   result = 400;
        //   message = 'Невалиден тип създаване на суровина';
      }
  
      res.json({ status: result, message: message });
    } catch (err) {
      console.error(err);
      res.json({ status: 500, message: `Грешка при създаването на ${getTypeName(ida)}` });
    }
});

// Helper function to get the entity type name based on the ida value

app.get('/suppliers', async (req, res) => {
  const text = { 404: 'Не е намерен такъв артикул', 200: 'Аритикула е изтрит успешно' };
  const suppliers = await prisma.supplier.findMany({
    where: { kontragent: { name: 'Доставчици' },},
    select: {id: true, name: true},
  });

  if (!suppliers) return res.status(404).json({ status: 404, message: text[404] });
  return res.json({ status: 200, message: text[200], suppliers: suppliers });
})


const getTypeName = (ida) => {
    switch (ida) {
      case '0':
        return 'суровината';
      case '1':
        return 'второто ниво суровина';
      case '2':
        return 'третото ниво суровина';
      case '3':
        return 'контрагента';
      case '4':
        return 'доставчика';
      default:
        return 'продукта';
    }
};




let PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`  Server On \n  Listening on port ${PORT}`);
})
