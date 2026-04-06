const { getDefaultConfig } = require('expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = withUniwindConfig(getDefaultConfig(__dirname), {
	cssEntryFile: './global.css',
});

module.exports = wrapWithReanimatedMetroConfig(config);
