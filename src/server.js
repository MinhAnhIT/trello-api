import express from "express";
import exitHook from "async-exit-hook";
import { CONNECT_DB, GET_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { APIs_V1 } from "./routes/v1";

const SERVER_START = () => {
    const app = express();

    app.use("/v1", APIs_V1);

    app.listen(env.APP_PORT, env.APP_HOST, () => {
        // eslint-disable-next-line no-console
        console.log(
            `Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}`
        );
    });

    exitHook(() => {
        CLOSE_DB();
        console.log("Đã đóng kết nối database!");
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
