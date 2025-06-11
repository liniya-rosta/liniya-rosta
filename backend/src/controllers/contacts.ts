import Contact from "../models/Contact";
import {NextFunction, Request, Response} from "express";

export const getContacts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const contact = await Contact.findOne();
        res.send(contact);
    } catch (e) {
        next(e);
    }
};