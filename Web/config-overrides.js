const path = require('path');

module.exports = function override(config, env) {
  const wasmExtensionRegExp = /\.wasm$/;

  config.resolve.extensions.push('.wasm');

  // add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    // include: path.resolve(__dirname),
    type: 'javascript/auto',
    use: [{ loader: require.resolve('file-loader'), options: {} }]
  });

  config.module.rules.push({
    test: [/encoderWorker\.min\.js$/, /decoderWorker\.min\.js$/, /encoderWorker\.umd\.js$/, /decoderWorker\.js$/],
    include: path.resolve(__dirname),
    use: [{ loader: require.resolve('file-loader'), options: {} }]
  });

  return config;
};