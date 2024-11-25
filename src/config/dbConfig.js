import { MongoClient } from 'mongodb';

export default async function conectarAoBanco(stringConnection) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(stringConnection);
        console.log('Conectando ao cluster do banco de dados. . . ');
        await mongoClient.connect();
        console.log('Conectado ao MongoDB Atlas com sucesso!');
        
        return mongoClient;
    } catch (erro) {
        console.error('Falha na conexão com o banco', erro);
        process.exit();
    }
}