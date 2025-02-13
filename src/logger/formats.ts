/* istanbul ignore file */

import moment = require('moment');
import * as winston from 'winston';

const logFormat = winston.format.printf((info: any) => {
  const timestamp = moment(info);
  return `[${timestamp.format('L') + ' ' + timestamp.format('HH:mm:ss')}][${
    info.level
  }] ${info.message}`;
});

const colorFormat = winston.format.colorize({
  level: true,
  colors: {
    INFO: 'blue',
    ERROR: 'red',
    OPERATION: 'green',
    TECHNICAL: 'cyan',
    DEBUG: 'magenta',
    WARN: 'yellow',
  },
});

export const LoggerFormats = {
  logFormat,
  colorFormat,
};
