import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.string()
            .required()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().required().min(3).max(50).trim().strict(),
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
        // boardId: Joi.string()
        //     .pattern(OBJECT_ID_RULE)
        //     .message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().min(3).max(50).trim().strict(),
        cardOrderIds: Joi.array().items(
            Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        ),
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

export const columnValidation = {
    createNew,
    update,
};