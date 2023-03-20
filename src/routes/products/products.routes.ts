import express from 'express';
import { auth } from '../../helper/auth.js';
import { commonResponse } from '../../helper/response.js';
import { deleteProduct, getProduct, getProducts, productAdd, updateProduct } from './products.js';

const router = express.Router();

router.post('/createproduct', auth, async(req,res)=>{
    const data = await productAdd(req.body);
    return commonResponse(data, res);
  })

router.get('/getproducts', auth, async(req,res)=>{
  const data  = await getProducts(req.query);
  return commonResponse(data, res);
})

router.get('/getproduct', auth, async(req,res)=>{
  const data  = await getProduct(req.query);
  return commonResponse(data, res);
})

router.patch('/updateproduct', auth, async(req,res)=>{
  const data  = await updateProduct(req.body, req.query);
  return commonResponse(data, res);
})

router.delete('/deleteproduct', auth, async(req,res)=>{
  const data = await deleteProduct(req.query);
  return commonResponse(data, res);
})
  export {router as productRouter};