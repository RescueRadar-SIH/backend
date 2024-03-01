import express from 'express'
import twilio from 'twilio';
import axios from 'axios';
import { Emergency, Contact, User, Admin } from '../db/schema.js'

const router = express.Router();

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const client = twilio(accountSid, authToken);

router.post('/login',)
router.post('/register',)

router.post('/sendotp', async (req, res) => {
    try {
        const { name, number } = req.body;

        if (!name || !number) {
            req.status(401).send("Invalid Credentials");
        }

        client.verify.v2.services
            .create({ friendlyName: 'RescueRadar Verify Service' })
            .then((service) => {
                console.log(service.sid)
                client.verify.v2.services(service.sid)
                    .verifications
                    .create({ to: number, channel: 'sms' })
                    .then(verification => console.log(verification.status));

                res.status(200).json({ "msg": 'OTP sent successfully', "Service_sid": service.sid });
            })

    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
})

router.post('/verifyotp', async (req, res) => {
    try {
        const { otp, number, service_sid } = req.body;

        if (!otp || !number || !service_sid) {
            req.status(401).send("Invalid Credentials");
        }

        client.verify.v2.services(service_sid)
            .verificationChecks
            .create({ to: number, code: otp })
            .then(verification_check => console.log(verification_check.status));
        res.status(200).send('OTP verified successfully')

    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
})

async function getNearestCamp(latitude, longitude, res) {
    const originLatitude = latitude;
    const originLongitude = longitude;

    let min = Number.MAX_VALUE, mincampId = 0;
    const adminCamps = await Admin.find({});

    adminCamps.forEach(async (item) => {
        const destinationLatitude = item.latitude
        const destinationLongitude = item.longitude

        const campId = item._id;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${originLatitude},${originLongitude}&origins=${destinationLatitude},${destinationLongitude}&units=imperial&key=${process.env.GOOGLE_API}`;

        try {
            const response = await axios.get(url);
            const dist = response.data.rows[0].elements[0].distance.text;
            let num = dist.replace(/[^\d.-]/g, '');
            if (min > num) {
                min = num;
                mincampId = campId;
            }
        } catch (err) {
            console.log(err)
            // res.status(500).send({ 'Internal Error': err });
        }
    })
    console.log(mincampId)
    return mincampId;
}

router.post('/emergency', async (req, res) => {
    try {
        const { name, number, cause, latitude, longitude } = req.body;

        if (!name || !number || !cause || !latitude || !longitude) {
            req.status(401).send("Invalid Credentials");
        }

        const Currdate = new Date();
        let currentDay = String(Currdate.getDate()).padStart(2, '0');
        let currentMonth = String(Currdate.getMonth() + 1).padStart(2, "0");
        let currentYear = Currdate.getFullYear();
        let date = `${currentDay}-${currentMonth}-${currentYear}`;
        const campId = await getNearestCamp(latitude, longitude,res);

        const obj = {
            name,
            number,
            cause,
            latitude,
            longitude,
            date,
            campId
        }
        const newEmergencyCase = new Emergency(obj);
        await newEmergencyCase.save();
        console.log('Emergency Case saved');
        res.status(201).json({ msg: "Success!" });
    } catch (err) {
        res.status(500).send({ 'Internal Error': err });
    }
})

router.post('/offemergency', async (req, res) => {

})

router.post('/map',)
router.post('/call',)

router.get('/profile', async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            req.status(401).send("Invalid Credentials");
        }

        const response = await User.findById(_id)

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
        const { _id, name } = req.body;

        if (!name || _id) {
            req.status(401).send("Invalid Credentials");
        }

        const updatedResponse = await User.findByIdAndUpdate({ _id }, { "name": name })

        if (!updatedResponse) {
            res.status(403).send("Not Updated")
        } else {
            res.status(201).send("Updated")
        }
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
})

router.post('/contact', async (req, res) => {
    try {
        const { name, number, description } = req.body;

        if (!name || !number || !description) {
            req.status(401).send("Invalid Credentials");
        }

        const obj = { name, number, description };
        const newContact = new Contact(obj);
        await newContact.save();
        console.log('Emergency Case saved');
        return res.status(201).json({ msg: "Success!" });
    } catch (err) {
        return res.status(500).send({ 'Internal Error': err });
    }
})

export default router;