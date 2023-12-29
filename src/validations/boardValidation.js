import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { BOARD_TYPES } from '~/config/environment';

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict(),
        description: Joi.string().required().min(3).max(256).trim().strict(),
        type: Joi.string()
            .valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
            .required(),
    });

    try {
        // abortEarly: không bị ngừng sớm khi dữ liệu sai
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        // Validate xong thì đi tiếp xong Controller
        next();
    } catch (error) {
        next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                new Error(error).message
            )
        );
    }
};

const update = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().min(3).max(50).trim().strict(),
        description: Joi.string().min(3).max(256).trim().strict(),
        type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    });

    try {
        // abortEarly: không bị ngừng sớm khi dữ liệu sai
        await correctCondition.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true,
        });

        // Validate xong thì đi tiếp xong Controller
        next();
    } catch (error) {
        next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                new Error(error).message
            )
        );
    }
};

export const boardValidation = {
    createNew,
    update,
};
