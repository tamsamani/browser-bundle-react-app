export const RESOLVED_AS_URL = Symbol();
export const RESOLVED_AS_PATH = Symbol();
export const RESOLVED_AS_UNKOWN = Symbol();

export function resolveModules(modulesConfig) {
  const configs = Object.assign(
    {
      importsBaseUrl: '.',
      imports: {},
    },
    modulesConfig
  );

  const resolvedModules = {};

  // resolve modules based to sources
  Object.entries(modulesConfig.imports).forEach(([moduleName, modulePath]) => {
    let resolvedModulePath;
    switch (checkReslovePath(modulePath)) {
      case RESOLVED_AS_URL:
        resolvedModulePath = modulePath;
      case RESOLVED_AS_PATH:
        resolvedModulePath = mergePaths('..', modulePath);
        break;
      default:
        resolvedModulePath = mergePaths(configs.importsBaseUrl, modulePath);
    }

    resolvedModules[moduleName] = resolvedModulePath;
  });

  // return the modular List
  return resolvedModules;
}

export function checkReslovePath(pathString) {
  // test if its url
  if (/^https?\:/.test(pathString)) return RESOLVED_AS_URL;
  if (/^\.\/?/.test(pathString)) return RESOLVED_AS_PATH;
  return RESOLVED_AS_UNKOWN;
}

export function mergePaths(...pathStrings) {
  return pathStrings
    .map((v) => v.replace(/\/$/, ''))
    .filter((v) => v)
    .join('/');
}
