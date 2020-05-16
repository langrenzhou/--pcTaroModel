"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TaroNormalModule_1 = require("./TaroNormalModule");
const TaroSingleEntryDependency_1 = require("../dependencies/TaroSingleEntryDependency");
const PLUGIN_NAME = 'TaroNormalModulesPlugin';
class TaroNormalModulesPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
            normalModuleFactory.hooks.createModule.tap(PLUGIN_NAME, data => {
                const dependency = data.dependencies[0];
                if (dependency.constructor === TaroSingleEntryDependency_1.default) {
                    return new TaroNormalModule_1.default(Object.assign(data, { miniType: dependency.miniType, name: dependency.name }));
                }
            });
        });
    }
}
exports.default = TaroNormalModulesPlugin;
