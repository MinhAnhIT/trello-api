import express from "express";
import { CONNECT_DB, GET_DB } from "~/config/mongodb";

const SERVER_START = () => {
    const app = express();

    const hostname = "localhost";
    const port = 5503;

    app.get("/", async (req, res) => {
        res.json(await GET_DB().listCollections().toArray());
    });

    app.listen(port, hostname, () => {
        // eslint-disable-next-line no-console
        console.log(
            `Hello Minh Anh, I am running at http://${hostname}:${port}`
        );
    });
};

// Khi kết nối database thành công thì mới SERVER_START
CONNECT_DB()
    .then(() => console.log("Kết nối database thành công!"))
    .then(() => SERVER_START())
    .catch((error) => {
        console.log(error);
        process.exit(0);
    });
