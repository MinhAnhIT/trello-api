import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { boardService } from '~/services/boardService';

const createNew = async (req, res, next) => {
    try {
        // Chuyển dữ liệu sang Service
        const createdBoard = await boardService.createNew(req.body);

        // Có kết quả từ Service thì trả về Client
        res.status(StatusCodes.CREATED).json(createdBoard);
    } catch (error) {
        next(error);
    }
};

const getDetails = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        // Chuyển dữ liệu sang Service
        const board = await boardService.getDetails(boardId);

        // Có kết quả từ Service thì trả về Client
        res.status(StatusCodes.OK).json(board);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        // Chuyển dữ liệu sang Service
        const updatedBoard = await boardService.update(boardId, req.body);

        // Có kết quả từ Service thì trả về Client
        res.status(StatusCodes.OK).json(updatedBoard);
    } catch (error) {
        next(error);
    }
};

const moveCardToDifferentColumn = async (req, res, next) => {
    try {
        // Chuyển dữ liệu sang Service
        const result = await boardService.moveCardToDifferentColumn(req.body);

        // Có kết quả từ Service thì trả về Client
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

export const boardController = {
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn,
};
