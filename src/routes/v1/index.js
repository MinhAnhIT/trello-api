import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRoute } from "./boardRoute";

const Router = express.Router();

// Check APIs status
Router.get("/status", (req, res) => {
    res.status(StatusCodes.OK).json({
        message: "OK",
    });
});

// Boards APIs
Router.use("/boards", boardRoute);

export const APIs_V1 = Router;
