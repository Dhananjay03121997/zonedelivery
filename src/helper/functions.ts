import user from "../models/users.js";
import messages from "./messages.js";
import jwt from 'jsonwebtoken';

const validateEmail = (email) => {

    if (String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
        return { code: 200 };
    };
    return { message: messages.invalid.replace('##name##', 'email'), code: 400 };
};

const getDataByEmail = async (email, dataToReturn: any = {id:1}) => {
    const a = await user.findOne({email:email}).select(dataToReturn);
    if(a){
        return a;
    }else{
        return null;
    }
}

const generateToken = async(payload: {_id: string})=>{
    try {
        return await jwt.sign(payload, 'jwtsecret', {expiresIn: '2d'})
    } catch (error) {
        return {code:500, message:error.message};
    }
}

export {validateEmail, getDataByEmail, generateToken};