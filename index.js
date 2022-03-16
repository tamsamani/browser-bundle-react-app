async function main() {
  const { AppCore } = await import('./lib/index.js');
  const AppConfigs = (await import('../app.config.js')).default;

  const App = new AppCore('MyApp', AppConfigs);
}

main();
