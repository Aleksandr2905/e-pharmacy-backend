import mongoose from "mongoose";
import app from "./app.js";

// MPwWF738ExBF

const DB_HOST =
  "mongodb+srv://Aleksandr:MPwWF738ExBF@cluster0.vtn0zno.mongodb.net/e-pharmacy?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
