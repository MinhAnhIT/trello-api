import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { BOARD_TYPES } from '~/config/environment';
import { columnModel } from './columnModel';
import { cardModel } from './cardModel';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string()
        .valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
        .required(),

    columnOrderIds: Joi.array()
        .items(
            Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        )
        .default([]),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),

    _destroy: Joi.boolean().default(false),
});

// chỉ định những trường không cho phép cập nhật
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const validateBeforeCreate = async (data) => {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
        abortEarly: false,
    });
};

const createNew = async (data) => {
    try {
        // Valid dữ liệu
        const validData = await validateBeforeCreate(data);

        // Dùng dữ liệu đã Valid để tạo vào DB
        return await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .insertOne(validData);
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (id) => {
    try {
        return await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(id),
            });
    } catch (error) {
        throw new Error(error);
    }
};

// Lấy toàn bộ Cards và Columns thuộc về Board đó
const getDetails = async (id) => {
    try {
        const result = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                        _destroy: false,
                    },
                },
                {
                    $lookup: {
                        from: columnModel.COLUMN_COLLECTION_NAME,
                        localField: '_id',
                        foreignField: 'boardId',
                        as: 'columns',
                    },
                },
                {
                    $lookup: {
                        from: cardModel.CARD_COLLECTION_NAME,
                        localField: '_id',
                        foreignField: 'boardId',
                        as: 'cards',
                    },
                },
            ])
            .toArray();
        return result[0] || null;
    } catch (error) {
        throw new Error(error);
    }
};

// push columnId vào cuối mảng columnOrderIds
const pushColumnOrderIds = async (column) => {
    try {
        const result = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(column.boardId) },
                { $push: { columnOrderIds: new ObjectId(column._id) } },
                { returnDocument: 'after' }
            );
    } catch (error) {
        throw new Error(error);
    }
};

// update
const update = async (boardId, updateData) => {
    try {
        // Lọc những field không cho phép cập nhật
        Object.keys(updateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName];
            }
        });

        // Xử lí dữ liệu liên quan tới ObjectId thành ObjectId
        if (updateData.columnOrderIds) {
            updateData.columnOrderIds = updateData.columnOrderIds.map(
                (_id) => new ObjectId(_id)
            );
        }

        const result = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(boardId) },
                { $set: updateData },
                { returnDocument: 'after' }
            );
    } catch (error) {
        throw new Error(error);
    }
};

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    pushColumnOrderIds,
    update,
};
