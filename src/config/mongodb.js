import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment";

// Khởi tạo đối tượng bằng null vì chưa connect
let trelloDatabasesInstance = null;

// Khởi tạo đối tượng MongoClienInstance để connect
const MongoClienInstance = new MongoClient(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Kết nối với database
export const CONNECT_DB = async () => {
    // Gọi kết nối với MongoDB với URI đã khai báo
    await MongoClienInstance.connect();

    // Kết nối thành công thì ra database theo tên và gán nó vào trelloDatabasesInstance
    trelloDatabasesInstance = MongoClienInstance.db(env.DATABASE_NAME);
};

// Đóng kết nối với database khi cần
export const CLOSE_DB = async () => {
    await MongoClienInstance.close();
};

export const GET_DB = () => {
    if (!trelloDatabasesInstance)
        throw new Error("Bạn cần kết nối Database trước!");
    return trelloDatabasesInstance;
};
