const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/index.js"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "src/assets", to: "assets" }],
    }),
    new HtmlWebpackPlugin({
      title: "Index",
      filename: "index.html",
      template: path.join(__dirname, "src/index.html"),
      templateParameters: {},
      inject: true,
      mobile: true,
      lang: "th-TH",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
    }),
    new HtmlWebpackPlugin({
      title: "BANNER",
      filename: "banner.html",
      template: path.join(__dirname, "src/banner.html"),
      templateParameters: {},
      inject: true,
      mobile: true,
      lang: "th-TH",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
    }),
    new HtmlWebpackPlugin({
      title: "HOME",
      filename: "home.html",
      template: path.join(__dirname, "src/home.html"),
      templateParameters: {},
      inject: true,
      mobile: true,
      lang: "th-TH",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
    }),
    new HtmlWebpackPlugin({
      title: "DASHBOARD",
      filename: "dashboard.html",
      template: path.join(__dirname, "src/dashboard.html"),
      templateParameters: {},
      inject: true,
      mobile: true,
      lang: "th-TH",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
    }),
    new HtmlWebpackPlugin({
      title: "REGISTER",
      filename: "register.html",
      template: path.join(__dirname, "src/register.html"),
      templateParameters: {},
      inject: true,
      mobile: true,
      lang: "th-TH",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
    }),
    new HtmlWebpackPlugin({
      title: "AFTER_REGISTER",
      filename: "after_register.html",
      template: path.join(__dirname, "src/after_register.html"),
      templateParameters: {},
      inject: true,
      mobile: true,
      lang: "th-TH",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
    }),
    new HtmlWebpackPlugin({
      title: "EDIT",
      filename: "edit.html",
      template: path.join(__dirname, "src/edit.html"),
      templateParameters: {},
      inject: true,
      mobile: true,
      lang: "th-TH",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  output: {
    clean: true,
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
