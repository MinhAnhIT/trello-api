import { slugify } from '~/utils/formatters';
import { columnModel } from '~/models/columnModel';
import { boardModel } from '~/models/boardModel';
import { cardModel } from '~/models/cardModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const createNew = async (reqBody) => {
    try {
        // Xử lý logic dữ liệu tùy vào từng đặc thù dự án
        const newColumn = {
            ...reqBody,
        };

        // Gọi tới tầng model để lưu dữ liệu vào DB
        const createdColumn = await columnModel.createNew(newColumn);

        // Lấy dữ liệu vừa tạo trong DB dựa vào id trả về từ createdColumn (tùy dự án có cần hay không)
        const getNewColumn = await columnModel.findOneById(
            createdColumn.insertedId
        );

        if (getNewColumn) {
            getNewColumn.card = [];

            // Cập nhật mảng columnOrderIds trong boardModel
            await boardModel.pushColumnOrderIds(getNewColumn);
        }

        // Trả dữ liệu về Controller
        return getNewColumn;
    } catch (error) {
        throw error;
    }
};

const update = async (columnId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now(),
        };
        // Gọi tới tầng model
        const updatedColumn = await columnModel.update(columnId, updateData);
        return updatedColumn;
    } catch (error) {
        throw error;
    }
};

const deleteItem = async (columnId) => {
    try {
        const targetColumn = await columnModel.findOneById(columnId);
        if (!targetColumn) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Column NOT FOUND!');
        }
        // Gọi tới tầng model để xóa Column
        await columnModel.deleteOneById(columnId);
        // Gọi tới tầng model để xóa các Card thuộc Column đó
        await cardModel.deleteManyByColumnId(columnId);
        // Xóa column đó ra khỏi columnOrderIds của board chứa nó
        await boardModel.pullColumnOrderIds(targetColumn);

        return { deleteResult: 'Delete Succesfully!' };
    } catch (error) {
        throw error;
    }
};

export const columnService = {
    createNew,
    update,
    deleteItem,
};
