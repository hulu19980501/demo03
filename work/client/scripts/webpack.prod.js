const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    // 入口模块
    index: "./src/index.tsx",
  },

  output: {
    path: path.resolve(__dirname, "../../server/public"),
    filename: "static/js/[name].[contenthash:10].js",
    chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
    assetModuleFilename: "static/js/[hash:10][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      {
        // 使用ts-loader处理ts|tsx后缀的代码
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          compilerOptions: {
            noEmit: false,
          },
        },
      },
      {
        // 使用MiniCssExtractPlugin.loader、css-loader处理css后缀的代码
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        // 使用file-loader处理jpg|png|svg|ico格式的文件
        test: /\.(jpg|png|svg|ico)$/,
        loader: "file-loader",
        options: {
          // 输出的文件名格式
          name: "imgs/[name].[contenthash:6].[ext]",
        },
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    // 清理插件，可以在每次编译之前清空dist目录
    new CleanWebpackPlugin(),
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    //可以生成创建html入口文件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),

    new MiniCssExtractPlugin({
      //提取css文件的文件名称
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
    }),
  ],
  optimization: {
    // 压缩的操作
    minimizer: [
      //对css文件进行压缩
      new CssMinimizerPlugin(),
      //对js文件进行压缩
      new TerserWebpackPlugin(),
    ],
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
  //对文件尝试按顺序解析这些后缀名
  resolve: {
    extensions: [".tsx", ".js", ".ts", ".json"],
  },
  mode: "production",
  devtool: "source-map",
};
