export const options = {
    file: {
        level: 'info',
        filename: 'logs/logger.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    },
    httpFile: {
        level: 'info',
        filename: 'logs/http.log',
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    },
    frontFile: {
        level: 'info',
        filename: 'logs/front.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    }
}
