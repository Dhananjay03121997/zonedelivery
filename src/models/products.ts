import mongoose from "mongoose";
import messages from "../helper/messages.js";

const schema = new mongoose.Schema({
name: {
    type: String,
    trim: true,
    required: [true, messages.require.replace('##name##', 'Product name')],
},
description: {
    type: String,
    trim: true,
},
price: {
    type: Number,
    required: [true, messages.require.replace('##name##', 'Price')],
},
status:{
    type: Boolean,
    default: true
}
});

const product = mongoose.model('product', schema);
export default product;
