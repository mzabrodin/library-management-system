import express from "express";
import routes from "./routes";
import {notFound} from "./middleware/notFound.middleware";
import {errorHandler} from "./middleware/errorHandler.middleware";

const app = express();

app.use(express.json());
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;