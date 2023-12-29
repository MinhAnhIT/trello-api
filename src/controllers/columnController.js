import { StatusCodes } from 'http-status-codes';
import { columnService } from '~/services/columnService';

const createNew = async (req, res, next) => {
    try {
        // Chuyển dữ liệu sang Service
        const createdColumn = await columnService.createNew(req.body);

        // Có kết quả từ Service thì trả về Client
        res.status(StatusCodes.CREATED).json(createdColumn);
    } catch (error) {
        next(error);
    }
};

export const columnController = {
    createNew,
};
