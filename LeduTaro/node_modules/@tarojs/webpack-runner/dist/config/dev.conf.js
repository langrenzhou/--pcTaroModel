"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lodash_1 = require("lodash");
const util_1 = require("../util");
const chain_1 = require("../util/chain");
const base_conf_1 = require("./base.conf");
const emptyObj = {};
function default_1(appPath, config) {
    const chain = base_conf_1.default(appPath);
    const { alias = emptyObj, copy, entry = emptyObj, output = emptyObj, sourceRoot = '', outputRoot, publicPath = '', staticDirectory = 'static', chunkDirectory = 'chunk', router = emptyObj, designWidth = 750, deviceRatio, enableSourceMap = true, sourceMapType, enableExtract = false, defineConstants = emptyObj, env = emptyObj, styleLoaderOption = emptyObj, cssLoaderOption = emptyObj, sassLoaderOption = emptyObj, lessLoaderOption = emptyObj, stylusLoaderOption = emptyObj, mediaUrlLoaderOption = emptyObj, fontUrlLoaderOption = emptyObj, imageUrlLoaderOption = emptyObj, miniCssExtractPluginOption = emptyObj, esnextModules = [], postcss = emptyObj, babel } = config;
    const plugin = {};
    const isMultiRouterMode = lodash_1.get(router, 'mode') === 'multi';
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
    plugin.hotModuleReplacementPlugin = chain_1.getHotModuleReplacementPlugin();
    const mode = 'development';
    chain.merge({
        mode,
        devtool: chain_1.getDevtool({ enableSourceMap, sourceMapType }),
        entry,
        output: chain_1.getOutput(appPath, [{
                outputRoot,
                publicPath: util_1.addLeadingSlash(util_1.addTrailingSlash(publicPath)),
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
            noEmitOnErrors: true
        }
    });
    return chain;
}
exports.default = default_1;
