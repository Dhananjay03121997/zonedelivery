import app from './src/app.js';
import './src/db/db.js';
import './src/socket/socket.js';

app.get('/', (req, res)=>{
    res.status(200).send({message:"success"});
});


app.listen((3001), () => {
    console.log('Server is running on port 3001');
});
