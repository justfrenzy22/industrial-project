    const router = require('express').Router();
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const { User } = require('../schema');
    const auth = require('../middleware/auth');
    const jwt_key = process.env.JWT_SECRET_KEY;

    router.post('/register', async (req, res) => {
        const { email,username, password  } = req.body

        try {
            const userMail = await User.findOne({email});
            const name = await User.findOne({username});
            if (userMail) return res.status(400).json({message: 'Email already exists'});
            if (name) return res.status(400).json({message: 'Username already exists'});

            user = new User({email, password, username });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            const payload = { user: { id: user.id } };
            const token = jwt.sign(payload, jwt_key, {expiresIn: '1h'});

            res.cookie('token', token, { httpOnly:true })
            res.json({message: 'User registered succesfully'});
        } catch (err) {
            res.status(500).json({message: 'Server error'});
        }
    })

    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({email});
            if (!user) return res.status(400).json({message: 'Invalid credentials'});

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({message: 'Invalid credentials'});

            const payload = { user: { id: user.id }};
            const token = jwt.sign(payload, jwt_key, {expiresIn: '1h'});

            res.cookie('token', token, {httpOnly: true});
            res.json({message: 'Logged in successfully'});
        } catch (err) {
            res.status(500).json({message: 'Server error'});
        }
    })

    router.get('/protected', auth, (req, res) => {
        res.json({message: 'Protected route'});
    })


    module.exports = router;