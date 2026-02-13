module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@database': './src/database',
          '@services': './src/services',
          '@theme': './src/theme',
          '@types': './src/types',
        },
      },
    ],
  ],
};
