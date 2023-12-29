import { StatusCodes } from 'http-status-codes';
import { cardService } from '~/services/cardService';

const createNew = async (req, res, next) => {
    try {
        // Chuyển dữ liệu sang Service
        const createdCard = await cardService.createNew(req.body);

        // Có kết quả từ Service thì trả về Client
        res.status(StatusCodes.CREATED).json(createdCard);
    } catch (error) {
        next(error);
    }
};

export const cardController = {
    createNew,
};
