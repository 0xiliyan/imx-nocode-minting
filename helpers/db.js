import mysql from "serverless-mysql";
import config from "../config";

export const connection = mysql({
    config: {
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        port: 3306,
        multipleStatements: true
    },
});