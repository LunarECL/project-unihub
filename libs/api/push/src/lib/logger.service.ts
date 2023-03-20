import { Injectable } from '@nestjs/common';
// @ts-ignore
import colors from 'colors';

type LogLevel =
  | 'info'
  | 'debug'
  | 'success'
  | 'warning'
  | 'danger'
  | 'error'
  | 'critical';

interface Logger {
  (...messages: any[]): void;
}

const LEVEL_COLORS = {
  info: colors.green,
  debug: colors.blue,
  success: colors.green,
  warning: colors.yellow,
  danger: colors.red,
  error: colors.red,
  critical: colors.magenta,
} as const;

const getTimestamp = () => {
  const date = new Date();

  const yyyy = date.getFullYear();
  const MM = date.getMonth().toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');

  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  const aaa = date.getMilliseconds().toString().padStart(3, '0');

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}.${aaa}`;
};

const printLog = (level: LogLevel, ...messages: any[]) => {
  console.log(
    `[${getTimestamp()}]`.gray,
    `${LEVEL_COLORS[level](level.toUpperCase())}`,
    '-',
    ...messages
  );
};

@Injectable()
export class LoggerService {
  info: Logger = (...messages) => printLog('info', ...messages);
  debug: Logger = (...messages) => printLog('debug', ...messages);
  success: Logger = (...messages) => printLog('success', ...messages);
  warning: Logger = (...messages) => printLog('warning', ...messages);
  danger: Logger = (...messages) => printLog('danger', ...messages);
  error: Logger = (...messages) => printLog('error', ...messages);
  critical: Logger = (...messages) => printLog('critical', ...messages);
}
