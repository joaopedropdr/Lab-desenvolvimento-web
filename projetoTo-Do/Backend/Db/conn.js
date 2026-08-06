import mongoose from "mongoose";

async function main(){
    await mongoose.connect("mongodb://localhost:27017/ToDo");
    // Outra maneira se der erro
    // await mongoose.connect("mongo://127.0.0.1.27017/ToDo")
    console.log("Conectou com o MongoDb");
} 

main().catch((err) =>{
    console.log(`Erro na conexao ${err}`)
})