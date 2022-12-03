import express from "express";
import router from "./routes";
import cors from "cors";

const app = express();

const port = 8080;

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
