import express from 'express';
import {getPostById, getPostBySlug, getPosts} from "../controllers/posts";

const postsRouter = express.Router();

postsRouter.get('/', getPosts);
postsRouter.get('/slug/:slug', getPostBySlug);
postsRouter.get('/:id', getPostById);


export default postsRouter;
