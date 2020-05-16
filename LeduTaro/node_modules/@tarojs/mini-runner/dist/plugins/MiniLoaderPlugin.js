"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("querystring");
const RuleSet = require("webpack/lib/RuleSet");
const PLUGIN_NAME = 'MiniLoaderPlugin';
const NS = 'TARO';
class MiniLoaderPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        const { sourceDir, fileType } = this.options;
        compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
            const normalModuleLoader = compilation.hooks.normalModuleLoader;
            normalModuleLoader.tap(PLUGIN_NAME, loaderContext => {
                loaderContext[NS] = true;
            });
        });
        const rawRules = compiler.options.module.rules;
        const { rules } = new RuleSet(rawRules);
        const pitcher = {
            loader: require.resolve('../loaders/pitcher'),
            resourceQuery: query => {
                const parsed = qs.parse(query.slice(1));
                return parsed.taro != null;
            },
            options: {
                sourceDir,
                fileType
            }
        };
        compiler.options.module.rules = [
            pitcher,
            ...rules
        ];
    }
}
exports.default = MiniLoaderPlugin;
