import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI =
    "mongodb+srv://minhanhit:nvWoagMeWaRA93zR@cluster0-minhanhit.zzphebk.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "trello-minhanhit";

// Khởi tạo đối tượng bằng null vì chưa connect
let trelloDatabasesInstance = null;

// Khởi tạo đối tượng MongoClienInstance để connect
const MongoClienInstance = new MongoClient(MONGODB_URI, {
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
    trelloDatabasesInstance = MongoClienInstance.db(DATABASE_NAME);
};

export const GET_DB = () => {
    if (!trelloDatabasesInstance)
        throw new Error("Bạn cần kết nối Database trước!");
    return trelloDatabasesInstance;
};
