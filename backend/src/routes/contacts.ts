import express from 'express';
import {getContacts} from "../controllers/contacts";

const contactsRouter = express.Router();

contactsRouter.get('/', getContacts);

export default contactsRouter;

