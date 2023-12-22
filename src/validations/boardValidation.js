import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict(),
        description: Joi.string().required().min(3).max(256).trim().strict(),
    });

    try {
        // console.log(req.body);
        // abortEarly: không bị ngừng sớm khi dữ liệu sai
        await correctCondition.validateAsync(req.body, {
            abortEarly: false,
        });
        // next();
        res.status(StatusCodes.CREATED).json({
            message: "Post create new board OK",
        });
    } catch (error) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            errors: new Error(error).message,
        });
    }
};

export const boardValidation = {
    createNew,
};
