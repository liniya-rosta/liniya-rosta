import express from 'express';
import Post from "../models/Post";
import {getPostById, getPosts} from "../controllers/posts";

const postsRouter = express.Router();

postsRouter.get('/', getPosts);
postsRouter.get('/:id', getPostById);

export default postsRouter;
