const router = require('express').Router();
const rawMaterials = require('../schema');

router.post('/', async (req, res) => {
    console.log(`raw Materials`);
    const data = req.body.name;
    console.log(`data`, data);
    try {
        const check = await rawMaterials.findOne({ name: data });
        if (check) {
            return res.status(400).json({ message: 'Material already exists' });
        }
        const newMaterial = new rawMaterials(data);
        await newMaterial.save();
        res.status(200).json({message: 'Material successfully created'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error creating material'});
    }
});

module.exports = router;