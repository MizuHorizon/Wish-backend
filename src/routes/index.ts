import express from 'express';
const app = express.Router();
import v1ApiRoutes from './v1/index';


app.use("/v1",v1ApiRoutes);

export default app;