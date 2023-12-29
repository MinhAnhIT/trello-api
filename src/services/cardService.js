import { slugify } from '~/utils/formatters';
import { cardModel } from '~/models/cardModel';
import { columnModel } from '~/models/columnModel';

const createNew = async (reqBody) => {
    try {
        // Xử lý logic dữ liệu tùy vào từng đặc thù dự án
        const newCard = {
            ...reqBody,
        };

        // Gọi tới tầng model để lưu dữ liệu vào DB
        const createdCard = await cardModel.createNew(newCard);

        // Lấy dữ liệu vừa tạo trong DB dựa vào id trả về từ createdCard (tùy dự án có cần hay không)
        const getNewCard = await cardModel.findOneById(createdCard.insertedId);

        if (getNewCard) {
            // Cập nhật mảng cardOrderIds trong columnModel
            await columnModel.pushCardOrderIds(getNewCard);
        }

        // Trả dữ liệu về Controller
        return getNewCard;
    } catch (error) {
        throw error;
    }
};

export const cardService = {
    createNew,
};
