import Logger from './utils/Logger.js';
import { resolveModules } from './utils/LoadModules';

export default class AppCore {
  configs = AppCore.defaultConfigs;
  name = 'app';
  logger = () => void 0;

  constructor(name, configs) {
    this.name = name ?? this.name;
    Object.assign(this.configs, configs ?? {});

    // initialize the app core
    try {
      this.#init();
      this.logger.log('INIT_APP_DONE');
    } catch (error) {
      console.warn('AppCore Error: ', error);
    }
  }

  /**
   * initialization
   * the app core init various supported helpers like logger and tests
   * and others services reccomended and based to app.configs
   */
  #init() {
    // init logger for dev
    if (this.configs.isDev) {
      this.logger = new Logger('AppCore', { name: this.name, ...this.configs });
    } else {
      this.logger = new Logger(Logger.NO_LOG_CLAUSE);
    }

    // start install
    try {
      this.logger.log('INIT_APP_START');
      if (this.configs.autoInstall) this.install();
    } catch (error) {
      this.logger.error('INIT_APP_ERROR', { error });
      throw error;
    }
  }

  /**
   * private preparation of install
   * intall modules and prepare everything needed for execute src folder
   */
  async #prepareInstall() {
    // prepare installation

    // setup html page info

    // install imports as modules
    const modulesPaths = resolveModules(this.configs);

    const modules = {};

    await Promise.all(
      Object.entries(modulesPaths).map(async ([modulesName, modulePath]) => {
        modules[modulesName] = await import(modulePath);
      })
    );

    this.modules = modules;
    if (this.configs.globalImports) Object.assign(globalThis, this.modules);

    console.log(modules);
  }

  async install() {
    try {
      this.logger.log('INSTALL_APP_START');
      this.#prepareInstall();
      this.logger.log('INSTALL_APP_DONE');
    } catch (error) {
      this.logger.error('INSTALL_APP_ERROR', { error });
      throw error;
    }
  }

  static defaultConfigs = {
    autoInstall: true,
    isDev: true,
    globalImports: true,
    importsBaseUrl: '.',
    imports: {},
  };
}
