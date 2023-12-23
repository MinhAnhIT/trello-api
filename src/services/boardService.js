import { slugify } from "~/utils/formatters";

const createNew = async (reqBody) => {
    try {
        // Xử lý logic dữ liệu tùy vào từng đặc thù dự án
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title),
        };

        // Gọi tới tầng model để lưu dữ liệu vào DB

        // Trả dữ liệu về Controller
        return newBoard;
    } catch (error) {
        throw error;
    }
};

export const boardService = {
    createNew,
};
