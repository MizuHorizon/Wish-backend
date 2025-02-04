import Express from "express";
const app = Express();
import env from "./config/serverConfig";
import bodyParser from "body-parser";
import apiRoutes from "./routes/index";
import {job} from "./jobs/cron/fetchPriceCron";
import cors from "cors";
import { EventEmitter } from 'events';
import {createChannel,subscribeMessageForCreatingProduct,subscribeMessageForNotifications} from "./services/queueService";
EventEmitter.defaultMaxListeners = 16;

(async () => {
  app.use(bodyParser.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", apiRoutes);
  
  

  const channel = await createChannel();
  await subscribeMessageForCreatingProduct(channel,env.BINDING_KEY);
  await subscribeMessageForNotifications(channel,env.NOTIFICATION_BINDING_KEY);

 job.start();
 
  app.listen(env.PORT, () => {
    console.log(`Server Started Onn Port ${env.PORT}`);
  });
})();
