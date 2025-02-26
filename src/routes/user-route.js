import express from "express";
import { list, createUser, updateUser, deleteUser } from "../controllers/user-controller.js";

const router = express.Router();

router.get("/list", list);

router.post('/create', createUser);

router.put('/update/:id', updateUser);

router.delete('/delete/:id', deleteUser);

export default router;
