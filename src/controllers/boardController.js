import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
    try {
        // Chuyển dữ liệu sang Service
        const createBoard = await boardService.createNew(req.body);

        // Có kết quả từ Service thì trả về Client
        res.status(StatusCodes.CREATED).json(createBoard);
    } catch (error) {
        next(error);
    }
};

export const boardController = {
    createNew,
};
