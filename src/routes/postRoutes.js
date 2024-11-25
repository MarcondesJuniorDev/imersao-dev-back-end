import express from "express"; // Importa o framework Express.js para criar a aplicação
import multer from "multer"; // Importa o middleware Multer para lidar com uploads de arquivos
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Importa funções do controlador de posts para lidar com as requisições HTTP
import { listarPosts, postarNovoPost, uploadImagem, atualizaNovoPost } from "../controllers/postsController.js";

// Configura o armazenamento de arquivos utilizando o Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define o diretório de destino para os arquivos enviados
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Define o nome do arquivo, mantendo o nome original para facilitar a identificação
    cb(null, file.originalname);
  }
});

// Cria uma instância do Multer utilizando a configuração de armazenamento
const upload = multer({ storage });

const routes = (app) => {
  // Habilita o middleware de análise JSON para permitir que a aplicação receba dados no formato JSON
  app.use(express.json());

  app.use(cors(corsOptions));

  // Rota para listar todos os posts
  app.get("/posts", listarPosts); // Chama a função listarPosts para tratar essa rota

  // Rota para criar um novo post
  app.post("/posts", postarNovoPost); // Chama a função postarNovoPost para tratar essa rota

  // Rota para fazer upload de uma imagem
  app.post("/upload", upload.single("imagem"), uploadImagem);
  // Utiliza o middleware Multer para lidar com o upload de um único arquivo com o nome "imagem"
  // Chama a função uploadImagem para processar o arquivo após o upload
  app.put("/upload/:id", atualizaNovoPost)
};

export default routes; // Exporta a função routes para ser utilizada em outros módulos