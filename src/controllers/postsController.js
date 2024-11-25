import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js"; // Importa as funções para obter todos os posts e criar um novo post do modelo de dados.
import fs from "fs"; // Importa o módulo do sistema de arquivos para realizar operações com arquivos.
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
  // Função assíncrona para lidar com a rota GET para listar todos os posts.

  try {
    // Tenta obter todos os posts do banco de dados.
    const posts = await getTodosPosts();
    // Se a operação for bem-sucedida, envia os posts como resposta JSON com status 200 (OK).
    res.status(200).json(posts);
  } catch (error) {
    // Se ocorrer algum erro durante a obtenção dos posts, envia uma mensagem de erro e o status 500 (Erro interno do servidor).
    console.error(error.message);
    res.status(500).json({ error: "Falha ao listar os posts" });
  }
}

export async function postarNovoPost(req, res) {
  // Função assíncrona para lidar com a rota POST para criar um novo post.

  try {
    // Extrai as informações do novo post do corpo da requisição.
    const novoPost = req.body;
    // Cria um novo post no banco de dados.
    const postCriado = await criarPost(novoPost);
    // Envia o post criado como resposta JSON com status 200 (OK).
    res.status(200).json(postCriado);
  } catch (error) {
    // Se ocorrer algum erro durante a criação do post, envia uma mensagem de erro e o status 500 (Erro interno do servidor).
    console.error(error.message);
    res.status(500).json({ error: "Falha ao criar o post" });
  }
}

export async function uploadImagem(req, res) {
  // Função assíncrona para lidar com a rota POST para fazer upload de uma imagem e criar um novo post.

  try {
    // Cria um objeto com as informações do novo post, incluindo o nome original da imagem.
    const novoPost = {
      descricao: "",
      imgUrl: req.file.originalname,
      alt: ""
    };
    // Cria um novo post no banco de dados.
    const postCriado = await criarPost(novoPost);
    // Gera um novo nome para a imagem, utilizando o ID do post criado.
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Renomeia o arquivo da imagem para o novo nome.
    fs.renameSync(req.file.path, imagemAtualizada);
    // Envia o post criado como resposta JSON com status 200 (OK).
    res.status(200).json(postCriado);
  } catch (error) {
    // Se ocorrer algum erro durante o upload da imagem ou a criação do post, envia uma mensagem de erro e o status 500 (Erro interno do servidor).
    console.error(error.message);
    res.status(500).json({ error: "Falha ao fazer o upload da imagem" });
  }
}

export async function atualizaNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;

  try {
    const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imageBuffer);
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    const postAtualizado = await atualizarPost(id, post);
    res.status(200).json(postAtualizado);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Falha ao atualizar o post" });
  }
}