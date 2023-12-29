import { slugify } from '~/utils/formatters';
import { columnModel } from '~/models/columnModel';
import { boardModel } from '~/models/boardModel';

const createNew = async (reqBody) => {
    try {
        // Xử lý logic dữ liệu tùy vào từng đặc thù dự án
        const newColumn = {
            ...reqBody,
        };

        // Gọi tới tầng model để lưu dữ liệu vào DB
        const createdColumn = await columnModel.createNew(newColumn);

        // Lấy dữ liệu vừa tạo trong DB dựa vào id trả về từ createdColumn (tùy dự án có cần hay không)
        const getNewColumn = await columnModel.findOneById(createdColumn.insertedId);

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

export const columnService = {
    createNew,
};
