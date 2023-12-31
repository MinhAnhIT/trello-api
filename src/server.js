import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { APIs_V1 } from './routes/v1';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';

const SERVER_START = () => {
    const app = express();

    // Dùng cors để Font end có thể lấy dữ liệu
    app.use(cors(corsOptions));

    // Cho phép json
    app.use(express.json());

    // Dùng api v1
    app.use('/v1', APIs_V1);

    // Middlewares xử lí lỗi tập trung
    app.use(errorHandlingMiddleware);

    if (env.BUILD_MODE === 'production') {
        app.listen(process.env.PORT, () => {
            // eslint-disable-next-line no-console
            console.log(
                `Hello ${env.AUTHOR}, Back-End Server running at port:${process.env.PORT}`
            );
        });
    } else {
        app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
            // eslint-disable-next-line no-console
            console.log(
                `Hello ${env.AUTHOR}, Back-End Server running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}`
            );
        });
    }
    exitHook(() => {
        CLOSE_DB();
        console.log('Đã đóng kết nối database!');
    });
};

// Khi kết nối database thành công thì mới SERVER_START
CONNECT_DB()
    .then(() => console.log('Kết nối database thành công!'))
    .then(() => SERVER_START())
    .catch((error) => {
        console.log(error);
        process.exit(0);
    });
