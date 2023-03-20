import { commonResponse } from "./response.js";
import jwt from 'jsonwebtoken';
import user from "../models/users.js";

const auth = async (req, res, next) => {
    try {
        if(!req.header('Authorization') ){
           return commonResponse({code:401, message: 'unauthenticated request'}, res);
        }
        const token = req.header('Authorization').replace('Bearer ', '');
        if(!token.trim()){
           return commonResponse({code:401, message: 'unauthenticated request'}, res);
        }
        let decode:any = jwt.verify(token, 'jwtsecret');
        const userData = await user.findOne({_id: decode._id});
        if(!userData){
           return commonResponse({code:401, message: 'unauthenticated request'}, res);
        }
        req.user = userData;
        next();
    } catch (error) {
        return commonResponse({code:401, message: 'unauthenticated request'}, res);
    }

}

export  { auth };