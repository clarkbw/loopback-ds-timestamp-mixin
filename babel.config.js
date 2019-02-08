const presets = [
  [
    "@babel/env",
    {
      targets: {
        node: true
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };
