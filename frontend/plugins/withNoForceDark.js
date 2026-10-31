// Stops Android (Samsung, Xiaomi, etc.) from auto-darkening the app when the phone is in dark mode.
const { withAndroidStyles, AndroidConfig } = require("@expo/config-plugins");

module.exports = function withNoForceDark(config) {
  return withAndroidStyles(config, (config) => {
    const appTheme = config.modResults.resources.style.find(
      (style) => style.$.name === "AppTheme",
    );
    if (appTheme) {
      AndroidConfig.Styles.assignStylesValue(config.modResults, {
        add: true,
        parent: appTheme.$,
        name: "android:forceDarkAllowed",
        value: "false",
      });
    }
    return config;
  });
};
