import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns';
const COLUMN_COLLECTION_SCHEMA = Joi.object({
    boardId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),

    // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
    cardOrderIds: Joi.array()
        .items(
            Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        )
        .default([]),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data) => {
    return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
        abortEarly: false,
    });
};

// chỉ định những trường không cho phép cập nhật
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];

const createNew = async (data) => {
    try {
        // Valid dữ liệu
        const validData = await validateBeforeCreate(data);

        // Biến đổi id thành Objet ID
        const dataColumn = {
            ...validData,
            boardId: new ObjectId(validData.boardId),
        };

        // Dùng dữ liệu đã Valid và đã biến đổi để tạo vào DB
        return await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .insertOne(dataColumn);
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (id) => {
    try {
        return await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(id),
            });
    } catch (error) {
        throw new Error(error);
    }
};

// push cardId vào cuối mảng cardOrderIds
const pushCardOrderIds = async (card) => {
    try {
        const result = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(card.columnId) },
                { $push: { cardOrderIds: new ObjectId(card._id) } },
                { returnDocument: 'after' }
            );

        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// update
const update = async (columnId, updateData) => {
    try {
        // Lọc những field không cho phép cập nhật
        Object.keys(updateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName];
            }
        });

        // Xử lí dữ liệu liên quan tới ObjectId thành ObjectId
        if (updateData.cardOrderIds) {
            updateData.cardOrderIds = updateData.cardOrderIds.map(
                (_id) => new ObjectId(_id)
            );
        }

        const result = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(columnId) },
                { $set: updateData },
                { returnDocument: 'after' }
            );
    } catch (error) {
        throw new Error(error);
    }
};

const deleteOneById = async (id) => {
    try {
        const result = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .deleteOne({
                _id: new ObjectId(id),
            });
    } catch (error) {
        throw new Error(error);
    }
};

export const columnModel = {
    COLUMN_COLLECTION_NAME,
    COLUMN_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    pushCardOrderIds,
    update,
    deleteOneById,
};
