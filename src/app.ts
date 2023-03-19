import express from 'express';
import { productRouter } from './routes/products/products.routes.js';
import { userRouter } from './routes/users/users.routes.js';

const app = express();

app.use(express.json());

app.use(userRouter);
app.use(productRouter);



app.listen(3000, ()=>{
    console.log('Server is running ');
});

export default app;