import "reflect-metadata";
import express from "express";
import productRouter from "./routes/productRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const PORT = PORT || 9000;

const app = express();
app.use(express.json());

app.use(productRouter);
app.use("*", errorHandler);

app.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});
