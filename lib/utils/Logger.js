import LOGGER_MESSAGES from './LoggerMessages';

export default class Logger {
  constructor(namespace, defaultReplacers) {
    this.namespace = namespace;
    this.defaultReplacers = defaultReplacers;
  }

  log(firstArg, ...args) {
    // disable logs based on constructor
    if (this.namespace === Logger.NO_LOG_CLAUSE) return;

    let logFn = console.log;
    let isClaused = true;

    switch (firstArg) {
      case Logger.ERROR_LOG_CLAUSE:
        logFn = console.error;
        break;
      case Logger.INFO_LOG_CLAUSE:
        logFn = console.info;
        break;
      case Logger.WARN_LOG_CLAUSE:
        logFn = console.warn;
        break;
      case Logger.TABLE_LOG_CLAUSE:
        logFn = console.table;
        break;
      default:
        isClaused = false;
    }

    const string = isClaused ? args[0] : firstArg;
    const others = isClaused ? args.slice(2) : args.slice(1);
    const replacers = Object.assign(
      {},
      this.defaultReplacers,
      isClaused ? args[1] : args[0],
      others
    );

    const message = Logger.transformLogWithReplacers(
      LOGGER_MESSAGES[string] || string,
      replacers
    );

    const namespace = this.namespace
      ? this.namespace + `(${replacers.name || '-'}): `
      : '';

    logFn(`${namespace}${message}`, ...others);
  }

  error(...args) {
    this.log(Logger.ERROR_LOG_CLAUSE, ...args);
  }
  warn(...args) {
    this.log(Logger.WARN_LOG_CLAUSE, ...args);
  }
  info(...args) {
    this.log(Logger.INFO_LOG_CLAUSE, ...args);
  }
  table(...args) {
    this.log(Logger.TABLE_LOG_CLAUSE, ...args);
  }

  static transformLogWithReplacers = function (string, replacers) {
    if (!['string', 'number'].includes(typeof string)) return string;
    return string
      .replace(/(?<=[^$]|^)\$\.[^\s]+/g, (v) => replacers[v.substr(2)] || v)
      .replace(/\$\$+/, (v) => v.substr(1));
  };

  /** CLAUSES For Console dispaly type */
  static ERROR_LOG_CLAUSE = Symbol();
  static WARN_LOG_CLAUSE = Symbol();
  static INFO_LOG_CLAUSE = Symbol();
  static TABLE_LOG_CLAUSE = Symbol();

  /** Disabled Clause for Looger */
  static NO_LOG_CLAUSE = Symbol();
}
