"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const runner_utils_1 = require("@tarojs/runner-utils");
const helper_1 = require("@tarojs/helper");
const logHelper_1 = require("./utils/logHelper");
const build_conf_1 = require("./webpack/build.conf");
const customizeChain = (chain, modifyWebpackChainFunc, customizeFunc) => __awaiter(void 0, void 0, void 0, function* () {
    if (modifyWebpackChainFunc instanceof Function) {
        yield modifyWebpackChainFunc(chain, webpack);
    }
    if (customizeFunc instanceof Function) {
        customizeFunc(chain, webpack, helper_1.PARSE_AST_TYPE);
    }
});
const makeConfig = (buildConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const sassLoaderOption = yield runner_utils_1.getSassLoaderOption(buildConfig);
    return Object.assign(Object.assign({}, buildConfig), { sassLoaderOption });
});
function build(appPath, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const mode = config.mode;
        const newConfig = yield makeConfig(config);
        const webpackChain = build_conf_1.default(appPath, mode, newConfig);
        yield customizeChain(webpackChain, newConfig.modifyWebpackChain, newConfig.webpackChain);
        const webpackConfig = webpackChain.toConfig();
        const onBuildFinish = config.onBuildFinish;
        const compiler = webpack(webpackConfig);
        return new Promise((resolve, reject) => {
            if (newConfig.isWatch) {
                logHelper_1.bindDevLogger(compiler);
                compiler.watch({
                    aggregateTimeout: 300,
                    poll: true
                }, (err, stats) => {
                    if (err) {
                        logHelper_1.printBuildError(err);
                        if (typeof onBuildFinish === 'function') {
                            onBuildFinish({
                                error: err,
                                stats: null,
                                isWatch: true
                            });
                        }
                        return reject(err);
                    }
                    if (typeof onBuildFinish === 'function') {
                        onBuildFinish({
                            error: null,
                            stats,
                            isWatch: true
                        });
                    }
                    resolve();
                });
            }
            else {
                logHelper_1.bindProdLogger(compiler);
                compiler.run((err, stats) => {
                    if (err) {
                        logHelper_1.printBuildError(err);
                        if (typeof onBuildFinish === 'function') {
                            onBuildFinish({
                                error: err,
                                stats: null,
                                isWatch: false
                            });
                        }
                        return reject(err);
                    }
                    if (typeof onBuildFinish === 'function') {
                        onBuildFinish({
                            error: null,
                            stats,
                            isWatch: false
                        });
                    }
                    resolve();
                });
            }
        });
    });
}
exports.default = build;
