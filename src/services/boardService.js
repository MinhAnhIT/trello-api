import { slugify } from '~/utils/formatters';
import { boardModel } from '~/models/boardModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { cloneDeep } from 'lodash';
import { columnModel } from '~/models/columnModel';
import { cardModel } from '~/models/cardModel';

const createNew = async (reqBody) => {
    try {
        // Xử lý logic dữ liệu tùy vào từng đặc thù dự án
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title),
        };

        // Gọi tới tầng model để lưu dữ liệu vào DB
        const createdBoard = await boardModel.createNew(newBoard);

        // Lấy dữ liệu vừa tạo trong DB dựa vào id trả về từ createdBoard (tùy dự án có cần hay không)
        const getNewBoard = await boardModel.findOneById(
            createdBoard.insertedId
        );

        // Trả dữ liệu về Controller
        return getNewBoard;
    } catch (error) {
        throw error;
    }
};

const getDetails = async (boardId) => {
    try {
        // Gọi tới tầng model
        const board = await boardModel.getDetails(boardId);
        if (!boardId) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!');
        }

        // Sao chép board
        const resBoard = cloneDeep(board);

        // Thực hiện tách Card và chuyển vào Column tương ứng
        resBoard.columns.forEach((column) => {
            column.cards = resBoard.cards.filter(
                (card) => card.columnId.toString() === column._id.toString()
            );
        });

        // Xóa cards khỏi resBoard
        delete resBoard.cards;

        // Trả dữ liệu về Controller
        return resBoard;
    } catch (error) {
        throw error;
    }
};

const update = async (boardId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now(),
        };
        // Gọi tới tầng model
        const updatedBoard = await boardModel.update(boardId, updateData);
        return updatedBoard;
    } catch (error) {
        throw error;
    }
};

const moveCardToDifferentColumn = async (reqBody) => {
    try {
        // B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
        await columnModel.update(reqBody.prevColumnId, {
            cardOrderIds: reqBody.prevCardOrderIds,
            updatedAt: Date.now(),
        });

        // B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
        await columnModel.update(reqBody.nextColumnId, {
            cardOrderIds: reqBody.nextCardOrderIds,
            updatedAt: Date.now(),
        });
        // B3: Cập nhật lại trường columnId mới của cái Card đã kéo
        await cardModel.update(reqBody.currentCardId, {
            columnId: reqBody.nextColumnId,
            updatedAt: Date.now(),
        });

        return { updateResult: 'Succesfully!' };
    } catch (error) {
        throw error;
    }
};

export const boardService = {
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn,
};
