/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

// Cái dòng này giúp Editor gợi ý được các giá trị cho dòng code config ngay phía dưới nó
// (giống như đang dùng Typescript vậy đó 😉)
/** @type {(env: any, arg: {mode: string}) => import('webpack').Configuration} **/
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const isAnalyze = Boolean(env?.analyze)
  /** @type {import('webpack').Configuration} **/
  const config = {
    // Quy định cách webpack giải quyết các file
    resolve: {
      
      // Giải quyết các file theo thứ tự ưu tiên từ trái sang phải nếu import
      // các file cùng một tên nhưng các đuôi mở rộng
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    // File đầu vào cho webpack, file này thường là file import mọi file khác
    entry: ['./src/index.tsx'],
    // Khai báo các module dùng trong webpack
    module: {
      rules: [
        {
          test: /\.tsx?$/, // duyệt các file .ts || .tsx
          exclude: /node_modules/,
          use: ['babel-loader'] // Giúp dịch code TS, React sang JS,
        },
        {
          test: /\.(s[ac]ss|css)$/, // duyệt các file sass || scss || css
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader', // dùng import 'filename.css' trong file tsx, ts
              options: { sourceMap: !isProduction } // Hiển thị sourcemap ở môi trường dev cho dễ debug
            },
            {
              loader: 'sass-loader', // biên dịch sass sang css
              options: { sourceMap: !isProduction }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/, // Dùng để import file ảnh, nếu có video/ảnh định dạng khác thì thêm vào đây
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction ? 'static/media/[name].[contenthash:6].[ext]' : '[path][name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/, // Dùng để import font
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction ? 'static/fonts/[name].[ext]' : '[path][name].[ext]'
              }
            }
          ]
        }
      ]
    },

    output: {
      filename: 'static/js/main.[contenthash:6].js', // Thêm mã hash tên file dựa vào content để tránh bị cache bởi CDN hay browser.
      path: path.resolve(__dirname, 'dist'), // Build ra thư mục dist
      publicPath: '/'
    },
    devServer: {
      hot: true, // enable Hot Module Replacement, kiểu như reload nhanh
      port: 3000, // Chạy port 3000 khi dev
      historyApiFallback: true, // Phải set true nếu không khi bạn dùng lazyload module React thì sẽ gặp lỗi không load được file.
      // Cấu hình phục vụ file html trong public
      static: {
        directory: path.resolve(__dirname, 'public', 'index.html'),
        serveIndex: true,
        watch: true // khi thay đổi content trong index.html thì cũng sẽ reload
      }
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      // Đưa css ra thành một file .css riêng biệt thay vì bỏ vào file .js
      new MiniCssExtractPlugin({
        filename: isProduction ? 'static/css/[name].[contenthash:6].css' : '[name].css'
      }),
      // Dùng biến môi trường env trong dự án
      new Dotenv(),
      // Copy mọi files trong folder public trừ file index.html
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            filter: (name) => {
              return !name.endsWith('index.html')
            }
          }
        ]
      }),

      // Plugin hỗ trợ thêm thẻ style và script vào index.html
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        filename: 'index.html'
      }),
      // Thêm eslint cho webpack
      new ESLintPlugin({
        extensions: ['.tsx', '.ts', '.js', '.jsx']
      })
    ]
  }

  //🚀 Nếu build thì sẽ thêm một số config
  if (isProduction) {
    config.plugins = [
      ...config.plugins,
      new webpack.ProgressPlugin(), // Hiển thị % khi build
      // Nén brotli css và js nhưng không hiểu sao chỉ có js được nén 🥲
      new CompressionPlugin({
        test: /\.(css|js)$/,
        algorithm: 'brotliCompress'
      }),
      new CleanWebpackPlugin() // Dọn dẹp thư mục build trước đó để chuẩn bị cho bản build hiện tại
    ]
    if (isAnalyze) {
      config.plugins = [...config.plugins, new BundleAnalyzerPlugin()]
    }
    config.optimization = {
      minimizer: [
        `...`, // Cú pháp kế thừa bộ minimizers mặc định trong webpack 5 (i.e. `terser-webpack-plugin`)
        new CssMinimizerPlugin() // minify css
      ]
    }
  }
  return config
}
