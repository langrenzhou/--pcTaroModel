"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lodash_1 = require("lodash");
const util_1 = require("../util");
const chain_1 = require("../util/chain");
const base_conf_1 = require("./base.conf");
function default_1(appPath, config) {
    const chain = base_conf_1.default(appPath);
    const { alias = util_1.emptyObj, copy, entry = util_1.emptyObj, output = util_1.emptyObj, sourceRoot = '', outputRoot = 'dist', publicPath = '', staticDirectory = 'static', chunkDirectory = 'chunk', router = util_1.emptyObj, designWidth = 750, deviceRatio, enableSourceMap = false, sourceMapType, enableExtract = true, defineConstants = util_1.emptyObj, env = util_1.emptyObj, styleLoaderOption = util_1.emptyObj, cssLoaderOption = util_1.emptyObj, sassLoaderOption = util_1.emptyObj, lessLoaderOption = util_1.emptyObj, stylusLoaderOption = util_1.emptyObj, mediaUrlLoaderOption = util_1.emptyObj, fontUrlLoaderOption = util_1.emptyObj, imageUrlLoaderOption = util_1.emptyObj, miniCssExtractPluginOption = util_1.emptyObj, esnextModules = [], postcss, babel, csso, uglify } = config;
    const isMultiRouterMode = lodash_1.get(router, 'mode') === 'multi';
    const plugin = {};
    if (enableExtract) {
        plugin.miniCssExtractPlugin = chain_1.getMiniCssExtractPlugin([{
                filename: 'css/[name].css',
                chunkFilename: 'css/[name].css'
            }, miniCssExtractPluginOption]);
    }
    if (copy) {
        plugin.copyWebpackPlugin = chain_1.getCopyWebpackPlugin({ copy, appPath });
    }
    if (isMultiRouterMode) {
        lodash_1.merge(plugin, lodash_1.mapValues(entry, (filePath, entryName) => {
            return chain_1.getHtmlWebpackPlugin([{
                    filename: `${entryName}.html`,
                    template: path.join(appPath, sourceRoot, 'index.html'),
                    chunks: [entryName]
                }]);
        }));
    }
    else {
        plugin.htmlWebpackPlugin = chain_1.getHtmlWebpackPlugin([{
                filename: 'index.html',
                template: path.join(appPath, sourceRoot, 'index.html')
            }]);
    }
    plugin.definePlugin = chain_1.getDefinePlugin([chain_1.processEnvOption(env), defineConstants]);
    const isCssoEnabled = (csso && csso.enable === false)
        ? false
        : true;
    if (isCssoEnabled) {
        plugin.cssoWebpackPlugin = chain_1.getCssoWebpackPlugin([csso ? csso.config : {}]);
    }
    const mode = 'production';
    const minimizer = [];
    const isUglifyEnabled = (uglify && uglify.enable === false)
        ? false
        : true;
    if (isUglifyEnabled) {
        minimizer.push(chain_1.getUglifyPlugin([
            enableSourceMap,
            uglify ? uglify.config : {}
        ]));
    }
    chain.merge({
        mode,
        devtool: chain_1.getDevtool({ enableSourceMap, sourceMapType }),
        entry,
        output: chain_1.getOutput(appPath, [{
                outputRoot,
                publicPath: util_1.addTrailingSlash(publicPath),
                chunkDirectory
            }, output]),
        resolve: { alias },
        module: chain_1.getModule(appPath, {
            designWidth,
            deviceRatio,
            enableExtract,
            enableSourceMap,
            styleLoaderOption,
            cssLoaderOption,
            lessLoaderOption,
            sassLoaderOption,
            stylusLoaderOption,
            fontUrlLoaderOption,
            imageUrlLoaderOption,
            mediaUrlLoaderOption,
            esnextModules,
            postcss,
            babel,
            staticDirectory
        }),
        plugin,
        optimization: {
            minimizer,
            splitChunks: {
                name: false
            }
        }
    });
    return chain;
}
exports.default = default_1;
