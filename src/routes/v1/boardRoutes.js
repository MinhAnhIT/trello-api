import express from "express";
import { StatusCodes } from "http-status-codes";

const Router = express.Router();

Router.route("/")
    .get((req, res) => {
        res.status(StatusCodes.OK).json({
            message: "boardRoutes get OK",
        });
    })
    .post((req, res) => {
        res.status(StatusCodes.CREATED).json({
            message: "boardRoutes post OK",
        });
    });

export const boardRoutes = Router;
