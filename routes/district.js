import express from 'express'
import dotenv from 'dotenv'
import { Admin, District, Emergency } from '../db/schema.js'

dotenv.config();
const router = express.Router();

const secretKey = process.env.SECRET_KEY;

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await District.findOne({ email, password })
        console.log(user)
        console.log(user._id)

        if (user) {
            // const token = jwt.sign({ id: user._id, role: 'district' }, secretKey, { expiresIn: '1h' })
            // return res.status(200).json(token);
            return res.status(200).json("Login Successful");
        } else {
            return res.status(403).send('Invalid Credentials');
        }
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
})

router.get('/emergency', async (req, res) => {
    const Currdate = new Date();
    let currentDay1 = String(Currdate.getDate()).padStart(2, '0');
    let currentMonth1 = String(Currdate.getMonth() + 1).padStart(2, "0");
    let currentYear1 = Currdate.getFullYear();
    let date1 = `${currentDay1}-${currentMonth1}-${currentYear1}`;
    
    let dateYesterday = Currdate;
    dateYesterday.setDate(Currdate - 1)
    let currentDay2 = String(dateYesterday.getDate()).padStart(2, '0');
    let currentMonth2 = String(dateYesterday.getMonth() + 1).padStart(2, "0");
    let currentYear2 = dateYesterday.getFullYear();
    let date2 = `${currentDay2}-${currentMonth2}-${currentYear2}`;
    
    const emerCases1 = await Emergency.findOne({ "date":date1 })
    const emerCases2 = await Emergency.findOne({ date2 })
    
    const obj = {
        "today": emerCases1,
        "yesterday": emerCases2
    }

    if (!emerCases1 && !emerCases2) {
        res.status(403).send('No Emergency Cases');
    } else {
        res.status(200).json(obj);
    }
})

router.post('/map',)

// It registers the Admin, not for the District Admin registration.
router.post('/register', async (req, res) => {
    try {
        const { name, number, email, password, workers, latitude, longitude } = req.body;

        if (!name || !number || !email || !password || !latitude || !longitude ) {
            return res.status(401).send('Invalid Credentails');
        }

        const user = await Admin.findOne({ email })

        if (user) {
            return res.status(403).send('User already Exists');
        } else {
            const obj = {
                name,
                number,
                email,
                password,
                latitude,
                longitude,
                // workers
            }

            const newAdmin = new Admin(obj);
            await newAdmin.save()
            console.log('Admin saved');
            return res.status(201).json({ msg: "Successfully Created Admin!" });
        }
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
})

router.post('/call',)

export default router;