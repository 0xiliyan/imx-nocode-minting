import fs from 'fs';
import util from 'util';
import mysql from "mysql";
import config from "../config.js";

export const logConsoleOutputToFile = (logFile) => {
    var logFile = fs.createWriteStream(logFile, { flags: 'a' });
    // Or 'w' to truncate the file every time the process starts.
    var logStdout = process.stdout;

    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + '\n');
        logStdout.write(util.format.apply(null, arguments) + '\n');
    }
    console.error = console.log;
}

export const sleep = (delay) => {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export const getHash = (str) => {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

