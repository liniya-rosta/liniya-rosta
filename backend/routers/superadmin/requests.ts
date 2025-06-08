import express from "express";
import RequestFromClient from "../../models/Request";

const requestAdminRouter = express.Router();

requestAdminRouter.get('/', async (req, res, next) => {
 try {
     const requests = await RequestFromClient.find();
     if (!requests) {
         res.status(404).send("Заявки не найдены");
         return;
     }
     res.send(requests);
 } catch(e) {
     next(e)
 }
});

requestAdminRouter.get('/:id', async(req, res, next) => {
    try {
        const request = await RequestFromClient.findOne({_id: req.params.id});
        if (!request) {
            res.status(404).send("Заявка не найдена");
            return;
        }
        res.send(request);
    } catch(e) {
        next(e)
    }
});

requestAdminRouter.put('/:id', async (req, res, next) => {
    try {
        const {name, phoneNumber, status, commentOfManager} = req.body;

        if (!name || !phoneNumber || !name.trim()  || !phoneNumber.trim()) {
            res.status(400).send({error: "Поля имя и номер должны быть заполнены"});
            return;
        }

        const updated = await RequestFromClient.findByIdAndUpdate(
            req.params.id,
            { name, phoneNumber, status, commentOfManager },
            { new: true }
        );

        if (!updated) {
            res.status(404).send("Заявка не найдена");
            return;
        }

        res.send({ message: "Заявка обновлена", request: updated });
    } catch(e) {
        next(e)
    }
});

requestAdminRouter.delete('/:id', async (req, res, next) => {
    try {
        const request = await RequestFromClient.findOneAndDelete({_id: req.params.id});

        if (!request) {
            res.status(404).send("Заявка не найдена");
            return
        }

        res.send({message: "Заявка удалена"});
    } catch(e) {
        next(e)
    }
});

export default requestAdminRouter;