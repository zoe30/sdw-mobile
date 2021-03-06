/**
 * Created by CHEN-BAO-DENG on 2017/2/23.
 */

var path = require('path');
var BASE_CONFIG = require('../../webpack-base');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var BUILD_PATH = path.resolve(__dirname, '../../../v2/mobile/index/');

var bases = BASE_CONFIG({
    dirname: __dirname,
    buildPath: BUILD_PATH,
    entry: {
        index: './index2.js',
        // cigarette: './index.js'
    }
});


// console.log(process.env.argv);

// 配置模板文件
bases.plugins.push(new HtmlWebpackPlugin({
        title: '闪电玩',
        time: +new Date(),
        template: path.resolve(__dirname, 'index2.html'), // 源模板文件
        filename: 'index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
        minify: {
            // removeAttributeQuotes: false,
            removeComments: true,
            removeEmptyAttributes: true,
            removeTagWhitespace: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
        },
        hash: true
        // showErrors: true,
        // inject: 'body',
        // chunks: ["index"]
    })
);

// bases.plugins.push(new HtmlWebpackPlugin({
//         title: '闪电玩',
//         template: path.resolve(__dirname, 'cigarette.html'), // 源模板文件
//         filename: 'cigarette.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
//         minify: {
//             // removeAttributeQuotes: false,
//             removeComments: true,
//             removeEmptyAttributes: true,
//             removeTagWhitespace: true,
//             collapseWhitespace: true,
//             minifyCSS: true,
//             minifyJS: true,
//         },
//         // showErrors: true,
//         // inject: 'body',
//         chunks: ["cigarette"]
//     })
// );

// 进行图像文件拷贝
bases.plugins.push(
    new CopyWebpackPlugin([{
        from: __dirname + '/images/',
        to: BUILD_PATH + '/images/'
    }])
);

module.exports = bases;