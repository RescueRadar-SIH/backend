import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {Request, Response, NextFunction} from 'express'

dotenv.config();

export const secretKey = process.env.SECRET_KEY;

export async function authenticate(req, res, next) {    
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).send(err);
            }
            
            req.headers['id']=user.id;
            req.headers['role']=user.role;
            next();
        });
    } else {
        return res.status(401).send('Unauthorised');
    }
}