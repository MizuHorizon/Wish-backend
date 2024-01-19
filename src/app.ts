import Express from 'express';
const app = Express();
import env from "./config/serverConfig";
import bodyParser from 'body-parser';
import apiRoutes from './routes/index'
import cors from "cors";




(async()=>{
   
    app.use(bodyParser.json());
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/api',apiRoutes);



   app.listen(env.PORT,()=>{
        console.log(`Server Started On Port ${env.PORT}`); 
   });
})();