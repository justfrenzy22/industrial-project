const router = require('express').Router();
const { Surovini, secondLevel, thirdLevel, Kontragent, Supplier, Product } = require('../schema');

router.post('/create', async (req, res) => {
    console.log(`body`, req.body);
    const { data } = req.body;

    try {
        const check = await Surovini.findOne({name: data.trim()});
        if (check) return res.json({status: 400, message: 'Суровината вече съществува'});

        const newSurovina = await Surovini({name: data.trim()});
        await newSurovina.save();
        res.json({status: 200, message: 'Суровината е създадена успешно'});
    } catch (err) {
        console.log(err);
        res.json({status: 500, message: 'Грешка при създаване на суровината'});
    }
})

router.post('/create1', async (req, res) => {
    console.log(`body`, req.body);
    const { text, id } = req.body;
    try {
        const check = await secondLevelCheck.findOne({ name: text.trim()});
        if (check) return res.json({status: 400, message: 'Второто ниво суровина вече съществува'});
        const newSecondLevel = new secondLevel({name: text, Surovinity: id});
        await newSecondLevel.save();
        return res.json({status: 200, message:' Второто ниво суровина е създадена успешно'});
    } catch (err) {
        console.error(err);
        return res.json({status: 500, message: 'Грешка при създаване на суровината'});
    }
});

router.post('/create2', async (req, res) => {
    console.log(`body`, req.body);
    const {text, id} = req.body;

    try {
        const check = await thirdLevel.findOne({name: text.trim()});
        if (check) return res.json({status: 400, message: 'Третото ниво суровина вече съществува'});

        const newThirdLevel = new thirdLevel({name: text.trim(), secondLevel: id});
        await thirdLevel.save();
        return res.json({status: 200, message: 'Третото ниво суровина е създадена успешно'});
    } catch (err) {
        console.error(err);
        return res.json({status: 500, message: 'Грешка при създаването на третото ниво суровина'});
    }

});

router.post('/create3', async (req, res) => {
    console.log(`body`, req.body);
    const { text } = req.body;
    try {
        const check = await Kontragent.findOne({name: text.trim()});
        if (check) return res.json({status: 400, message: 'Вече има съшествуващ контрагент'});
        const newKontragent = new Kontragent({name: text.trim()});
        await newKontragent.save();
        return res.json({status: 200, message: 'Контрагента е създаден успешно'});
    } catch (err) {
        console.error(err);
        return res.json({status: 500, message: 'Грешка при създаването на контрагента'});
    }
});

router.post('create4', async (req, res) => {
    console.log(`body`, req.body);
    const id = `6485932d0a63bf1bb7a64a98`;
    const { name, country, city, address, website, email, employees, another, address_workshop } = req.body;
    try {
        const check = await Supplier.findOne({ name: name});
        if (check) return res.json({status: 400, message: 'Вече има доставчик със същото име'});
        const newSupplier = new Supplier({name: name.trim(), country: country.trim(), city: city.trim(), address: address.trim(), website: website.trim(), email: email.trim(), employees: employees.trim(), another: another.trim(), address_workshop: address_workshop.trim(), kontragent: id }); 
        await newSupplier.save();
        return res.json({status: 200, message: 'Доставчика е създаден успешно'})
    } catch (err) {
        console.error(err);
        return res.json({status: 500, message: 'Грешка при създаването на доставчика'});
    }
});


module.exports = router;