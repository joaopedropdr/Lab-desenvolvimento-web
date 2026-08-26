import mongoose from "../Db/conn.js";
const {Schema} = mongoose;
const usuarioSchema = new Schema({
    nome: {
        type: String,
        required: true,
        // Tira os espaços deixado pelo usuario
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // transforma tudo em letra minuscula 
        lowercase:true
    },
    senha: {
        type: String,
        required: true,
        // Quando for consultar o usuario no BD por padrão a senha não vem junto.
        select: false,
        trim:true,
    },
    resetToken: {
        type: String,
        select: false,
    },
    resetTokenExpiry: {
        type: Date,
        select: false,
    },
    
},{timestamps:true});
const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;