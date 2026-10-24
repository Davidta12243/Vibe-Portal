import "server-only";
import mongoose, { connect, isValidObjectId, connection } from "mongoose";
import dataModels from "./models";
import { Types } from "mongoose";

mongoose.set('bufferCommands', false);

export async function connectToDB() {
  if (connection.readyState === 0) {
    try {
      if (process.env.MONGODB_URI) {
        await connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 300,
          bufferCommands: false
        });
      }
    } catch (e) {
      // Offline preview mode
    }
  }
}

async function countDocs(modelName = "User", filter = {}) {
  if (connection.readyState !== 1 || !dataModels[modelName]) {
    return 0;
  }
  try {
    return await dataModels[modelName].countDocuments(filter);
  } catch (e) {
    return 0;
  }
}

function stringifyObjectIdFromObj(object) {
  if (object === null || typeof object !== "object") return object;
  if (Array.isArray(object)) return object.map(stringifyObjectIdFromObj);

  const newObj = {};
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (isValidObjectId(object[key]) || object[key] instanceof Types.ObjectId) {
        newObj[key] = object[key].toString();
      } else if (typeof object[key] === "object" && object[key] !== null) {
        newObj[key] = stringifyObjectIdFromObj(object[key]);
      } else {
        newObj[key] = object[key];
      }
    }
  }
  return newObj;
}

export function strToObjectId(id) {
  return isValidObjectId(id) ? new Types.ObjectId(id) : id;
}

export { countDocs, stringifyObjectIdFromObj, connection };
