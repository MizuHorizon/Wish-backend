import Express from 'express';
const app = Express();
import env from "./config/serverConfig";



(async()=>{
   app.listen(env.PORT,()=>{
        console.log(`Server Started On Port ${env.PORT}`); 
   });
})();