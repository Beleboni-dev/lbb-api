import mongoose from "mongoose";

const password = encodeURIComponent("E2kJo81w01GzBLS0");
const dbName = "lbb-database-ro";
const mongoURI = `mongodb+srv://belebonidev:${password}@cluster0.pe8c4v1.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    const options: any = {
      useUnifiedTopology: true,
    };

    await mongoose.connect(mongoURI, options);
    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
};

export default connectDB;
