const {createLogger, format, transports} = require('winston');

const logFormatConsole = format.combine(
	format.timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
	format.colorize(),
	format.splat(),
	format.json(),
	format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
);

const logger = createLogger({
	transports: [
		new transports.Console({
			format: logFormatConsole,
			level: 'debug',
		})
	]
});


module.exports = logger