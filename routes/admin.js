import express from 'express'
import { Admin } from '../db/schema.js'

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.status(401).send("Invalid Credentials");
        }

        const user = await Admin.findOne({ email, password })

        if (user) {
            // const token = jwt.sign({ id: user._id, role: 'admin' }, secretKey, { expiresIn: '1h' })
            // return res.status(200).json(token);
            return res.status(200).json('Logged in!');
        } else {
            return res.status(403).send('Invalid Credentials');
        }
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
})

router.post('/language',)

router.get('/profile', async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            req.status(401).send("Invalid Credentials");
        }

        const response = await Admin.findById(_id)

        if (!response) {
            res.status(403).send("No Response")
        } else {
            res.status(201).json({ "data": response })
        }
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
})

router.put('/profile', async (req, res) => {
    try {
        const { _id, workforce, available } = req.body;

        if (!workforce || !available|| !_id) {
            req.status(401).send("Invalid Credentials");
        }

        const updatedResponse = await Admin.findByIdAndUpdate({ _id }, { "available": available, "workforce":workforce })

        if (!updatedResponse) {
            res.status(403).send("Not Updated")
        } else {
            res.status(201).send("Updated")
        }
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
})

router.post('/map', async (req,res) => {
    const adminCamps = await Admin.find({});
    res.json(adminCamps);
})

router

router.post('/search',)
router.post('/call',)

export default router;