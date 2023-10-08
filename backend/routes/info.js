const router = require('express').Router();
const auth = require('../middleware/auth');
const { Info, User } = require('../schema');

router.post('/save', auth , async (req, res) => {
    const { number, brand, description, cost } = req.body;
    try {
        const newInfo = new User({number, brand, description, cost});
        await newInfo.save();
        res.status(200).json({message: 'Info saved successfully'});
    } catch (err) {
        return res.status(500).json({message: 'Server error'});
    }
});

router.get('/get', auth, async (req, res) => {
    try {
        const allInfo = Info.find({});
        res.status(200).json({allInfo: allInfo});
    } catch (err) {
        return res.status(500).json({message: 'Server error'})
    }
    
});

router.get('/delete/:id', auth, async (req, res) =>{
    const info = req.params.id;
    const deleteInfo = await Info.findByIdAndDelete({ _id: info })
    .then((del) => { 
        if (del) return res.status(200).json({message: 'Info deleted successfully'});
        else return res.status(200).json({message: 'No info found matching the criteria'})})
    .catch((err) => {return res.status(500).json({message: 'Server Error'})});
});

module.exports = router;