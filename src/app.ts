import Express from "express";
const app = Express();
import env from "./config/serverConfig";
import bodyParser from "body-parser";
import apiRoutes from "./routes/index";
import {job} from "./jobs/cron/fetchPriceCron";
import cors from "cors";
import {createChannel,subscribeMessage} from "./services/queueService";

(async () => {
  app.use(bodyParser.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", apiRoutes);
  
  const channel = await createChannel();
  await subscribeMessage(channel,env.BINDING_KEY);

 job.start();

  app.listen(env.PORT, () => {
    console.log(`Server Started On Port ${env.PORT}`);
  });
})();
