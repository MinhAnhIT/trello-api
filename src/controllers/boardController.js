import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
    try {
        res.status(StatusCodes.CREATED).json({
            message: "Post create new from boardController OK",
        });
    } catch (error) {
        next(error);
    }
};

export const boardController = {
    createNew,
};
