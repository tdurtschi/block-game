module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    "**/test/?(*.)+(spec|test).[jt]s?(x)"
  ],
  reporters: [
    [
      "jest-nyancat-reporter",
      {
        suppressErrorReporter: false,
      }
    ]
  ]

};