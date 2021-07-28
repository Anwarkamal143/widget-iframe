const { resolve, join } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
console.log(isProd)
const config = {
  mode: isProd ? "production" : "development",
  entry: {
    app: [
      // "webpack-dev-server/client?http://0.0.0.0:9000/",
      // "webpack/hot/only-dev-server",
      "./src/code/index.tsx",
    ],

    Widget: ["./src/lib/widget.ts"],
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "build"),
    library: "[name]",
    libraryTarget: "umd",
    libraryExport: "default",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        include: [resolve("src")],
        loader: "ts-loader",
        options: {
          transpileOnly: false,
          compilerOptions: {
            module: "es2015",
          },

          configFile: require.resolve("./tsconfig-widget.json"),
        },
      },
      {
        test: /\.css?$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/code/index.html",
      hash: true,
      filename: "index.html",
      inject: "body",
      excludeChunks: ["widget"],
    }),
  ],
};

if (isProd) {
  config.optimization = {
    minimizer: [new TerserWebpackPlugin()],
  };
} else {
  config.devServer = {
    port: 9000,
    contentBase: join(__dirname, 'dist'),
    open: true,
    hot: true,
    compress: true,
    stats: "errors-only",
    overlay: true,
  };
}

module.exports = config;
