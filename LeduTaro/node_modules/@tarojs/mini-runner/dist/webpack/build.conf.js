"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const helper_1 = require("@tarojs/helper");
const chain_1 = require("./chain");
const base_conf_1 = require("./base.conf");
const MiniPlugin_1 = require("../plugins/MiniPlugin");
const emptyObj = {};
exports.default = (appPath, mode, config) => {
    const chain = base_conf_1.default(appPath);
    const { buildAdapter, fileType = {
        style: '.wxss',
        config: '.json',
        script: '.js',
        templ: '.wxml'
    }, globalObject = 'wx', alias = emptyObj, entry = emptyObj, output = emptyObj, outputRoot = 'dist', sourceRoot = 'src', designWidth = 750, deviceRatio, enableSourceMap = false, defineConstants = emptyObj, env = emptyObj, cssLoaderOption = emptyObj, sassLoaderOption = emptyObj, lessLoaderOption = emptyObj, stylusLoaderOption = emptyObj, mediaUrlLoaderOption = emptyObj, fontUrlLoaderOption = emptyObj, imageUrlLoaderOption = emptyObj, miniCssExtractPluginOption = emptyObj, compile = emptyObj, postcss = emptyObj, nodeModulesPath, quickappJSON, isBuildQuickapp = false, isUseComponentBuildPage = false, babel, csso, uglify, commonChunks, addChunkPages, modifyBuildAssets, modifyBuildTempFileContent } = config;
    let { copy } = config;
    const plugin = {};
    const minimizer = [];
    const sourceDir = path.join(appPath, sourceRoot);
    const outputDir = path.join(appPath, outputRoot);
    if (config.isBuildPlugin) {
        const patterns = copy ? copy.patterns : [];
        patterns.push({
            from: path.join(sourceRoot, 'plugin', 'doc'),
            to: path.join(outputRoot, 'doc')
        });
        patterns.push({
            from: path.join(sourceRoot, 'plugin', 'plugin.json'),
            to: path.join(outputRoot, 'plugin', 'plugin.json')
        });
        copy = Object.assign({}, copy, { patterns });
    }
    if (copy) {
        plugin.copyWebpackPlugin = chain_1.getCopyWebpackPlugin({ copy, appPath });
    }
    const constantsReplaceList = chain_1.mergeOption([chain_1.processEnvOption(env), defineConstants]);
    const entryRes = chain_1.getEntry({
        sourceDir,
        entry,
        isBuildPlugin: config.isBuildPlugin
    });
    plugin.definePlugin = chain_1.getDefinePlugin([constantsReplaceList]);
    const defaultCommonChunks = !!config.isBuildPlugin
        ? ['plugin/runtime', 'plugin/vendors', 'plugin/taro', 'plugin/common']
        : ['runtime', 'vendors', 'taro', 'common'];
    let customCommonChunks = defaultCommonChunks;
    if (typeof commonChunks === 'function') {
        customCommonChunks = commonChunks(defaultCommonChunks.concat()) || defaultCommonChunks;
    }
    else if (Array.isArray(commonChunks) && commonChunks.length) {
        customCommonChunks = commonChunks;
    }
    plugin.miniPlugin = chain_1.getMiniPlugin({
        sourceDir,
        outputDir,
        buildAdapter,
        constantsReplaceList,
        nodeModulesPath,
        quickappJSON,
        isBuildQuickapp,
        designWidth,
        pluginConfig: entryRes.pluginConfig,
        pluginMainEntry: entryRes.pluginMainEntry,
        isBuildPlugin: !!config.isBuildPlugin,
        commonChunks: customCommonChunks,
        addChunkPages,
        alias,
        fileType,
        modifyBuildAssets,
        modifyBuildTempFileContent
    });
    plugin.miniCssExtractPlugin = chain_1.getMiniCssExtractPlugin([{
            filename: `[name]${fileType.style}`,
            chunkFilename: `[name]${fileType.style}`
        }, miniCssExtractPluginOption]);
    const isCssoEnabled = (csso && csso.enable === false)
        ? false
        : true;
    const isUglifyEnabled = (uglify && uglify.enable === false)
        ? false
        : true;
    if (mode === 'production') {
        if (isUglifyEnabled) {
            minimizer.push(chain_1.getUglifyPlugin([
                enableSourceMap,
                uglify ? uglify.config : {}
            ]));
        }
        if (isCssoEnabled) {
            const cssoConfig = csso ? csso.config : {};
            plugin.cssoWebpackPlugin = chain_1.getCssoWebpackPlugin([cssoConfig]);
        }
    }
    const taroBaseReg = new RegExp(`@tarojs[\\/]taro|@tarojs[\\/]${buildAdapter}`);
    chain.merge({
        mode,
        devtool: chain_1.getDevtool(enableSourceMap),
        watch: mode === 'development',
        entry: entryRes.entry,
        output: chain_1.getOutput(appPath, [{
                outputRoot,
                publicPath: '/',
                globalObject
            }, output]),
        target: MiniPlugin_1.createTarget[buildAdapter],
        resolve: { alias },
        module: chain_1.getModule(appPath, {
            sourceDir,
            fileType,
            isBuildQuickapp,
            isUseComponentBuildPage,
            buildAdapter,
            constantsReplaceList,
            designWidth,
            deviceRatio,
            enableSourceMap,
            cssLoaderOption,
            lessLoaderOption,
            sassLoaderOption,
            stylusLoaderOption,
            fontUrlLoaderOption,
            imageUrlLoaderOption,
            mediaUrlLoaderOption,
            postcss,
            compile,
            babel,
            alias,
            nodeModulesPath
        }),
        plugin,
        optimization: {
            minimizer,
            runtimeChunk: {
                name: !!config.isBuildPlugin ? 'plugin/runtime' : 'runtime'
            },
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    common: {
                        name: !!config.isBuildPlugin ? 'plugin/common' : 'common',
                        minChunks: 2,
                        priority: 1
                    },
                    vendors: {
                        name: !!config.isBuildPlugin ? 'plugin/vendors' : 'vendors',
                        minChunks: 2,
                        test: module => {
                            return /[\\/]node_modules[\\/]/.test(module.resource) && module.miniType !== helper_1.PARSE_AST_TYPE.COMPONENT;
                        },
                        priority: 10
                    },
                    taro: {
                        name: !!config.isBuildPlugin ? 'plugin/taro' : 'taro',
                        test: module => {
                            return taroBaseReg.test(module.context);
                        },
                        priority: 100
                    }
                }
            }
        }
    });
    return chain;
};
