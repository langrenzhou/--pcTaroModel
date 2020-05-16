"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const t = require("babel-types");
const babel_traverse_1 = require("babel-traverse");
const _ = require("lodash");
const helper_1 = require("@tarojs/helper");
const constants_1 = require("./constants");
const astConvert_1 = require("./astConvert");
const babylon_1 = require("../config/babylon");
const template = require('babel-template');
const NON_WEBPACK_REQUIRE = '__non_webpack_require__';
function processAst({ ast, buildAdapter, type, designWidth, deviceRatio, sourceFilePath, sourceDir, alias, isBuildQuickapp, isUseComponentBuildPage }) {
    const taroMiniAppFramework = `@tarojs/taro-${buildAdapter}`;
    let componentClassName = '';
    let taroJsReduxConnect = '';
    let taroImportDefaultName;
    let needExportDefault = false;
    let exportTaroReduxConnected = null;
    const cannotRemoves = [helper_1.taroJsFramework, 'react', 'nervjs'];
    let hasComponentDidHide;
    let hasComponentDidShow;
    let hasComponentWillMount;
    let needSetConfigFromHooks = false;
    let configFromHooks;
    if (isBuildQuickapp) {
        cannotRemoves.push(helper_1.taroJsComponents);
    }
    const taroSelfComponents = new Set();
    const customComponents = new Set();
    babel_traverse_1.default(ast, {
        ClassDeclaration(astPath) {
            const node = astPath.node;
            let hasCreateData = false;
            if (node.superClass) {
                astPath.traverse({
                    ClassMethod(astPath) {
                        if (astPath.get('key').isIdentifier({ name: '_createData' })) {
                            hasCreateData = true;
                        }
                    }
                });
                if (hasCreateData) {
                    needExportDefault = true;
                    if (node.id === null) {
                        componentClassName = '_TaroComponentClass';
                        astPath.replaceWith(t.classDeclaration(t.identifier(componentClassName), node.superClass, node.body, node.decorators || []));
                    }
                    else if (node.id.name === 'App') {
                        componentClassName = '_App';
                        astPath.replaceWith(t.classDeclaration(t.identifier(componentClassName), node.superClass, node.body, node.decorators || []));
                    }
                    else {
                        componentClassName = node.id.name;
                    }
                }
            }
        },
        ClassExpression(astPath) {
            const node = astPath.node;
            if (node.superClass) {
                let hasCreateData = false;
                astPath.traverse({
                    ClassMethod(astPath) {
                        if (astPath.get('key').isIdentifier({ name: '_createData' })) {
                            hasCreateData = true;
                        }
                    }
                });
                if (hasCreateData) {
                    needExportDefault = true;
                    if (node.id === null) {
                        const parentNode = astPath.parentPath.node;
                        if (t.isVariableDeclarator(astPath.parentPath)) {
                            componentClassName = parentNode.id.name;
                        }
                        else {
                            componentClassName = '_TaroComponentClass';
                        }
                        astPath.replaceWith(t.classExpression(t.identifier(componentClassName), node.superClass, node.body, node.decorators || []));
                    }
                    else if (node.id.name === 'App') {
                        componentClassName = '_App';
                        astPath.replaceWith(t.classExpression(t.identifier(componentClassName), node.superClass, node.body, node.decorators || []));
                    }
                    else {
                        componentClassName = node.id.name;
                    }
                }
            }
        },
        ClassMethod(astPath) {
            const node = astPath.node;
            const keyName = astPath.get('key').node.name;
            if (node.kind === 'constructor') {
                astPath.traverse({
                    ExpressionStatement(astPath) {
                        const node = astPath.node;
                        if (node.expression &&
                            node.expression.type === 'AssignmentExpression' &&
                            node.expression.operator === '=') {
                            const left = node.expression.left;
                            if (left.type === 'MemberExpression' &&
                                left.object.type === 'ThisExpression' &&
                                left.property.type === 'Identifier' &&
                                left.property.name === 'customComponents') {
                                const right = node.expression.right;
                                if (t.isArrayExpression(right)) {
                                    right.elements.forEach(item => {
                                        if (t.isStringLiteral(item)) {
                                            customComponents.add(item.value);
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            }
            else {
                if (keyName === 'componentWillMount') {
                    hasComponentWillMount = true;
                }
                else if (keyName === 'componentDidShow') {
                    hasComponentDidShow = true;
                }
                else if (keyName === 'componentDidHide') {
                    hasComponentDidHide = true;
                }
            }
        },
        ClassProperty(astPath) {
            const node = astPath.node;
            const keyName = node.key.name;
            const valuePath = astPath.get('value');
            if (keyName === 'customComponents' && valuePath.isArrayExpression()) {
                valuePath.node.elements.forEach(item => {
                    if (t.isStringLiteral(item)) {
                        customComponents.add(item.value);
                    }
                });
            }
            else if (valuePath.isFunctionExpression() || valuePath.isArrowFunctionExpression()) {
                if (keyName === 'componentWillMount') {
                    hasComponentWillMount = true;
                }
                else if (keyName === 'componentDidShow') {
                    hasComponentDidShow = true;
                }
                else if (keyName === 'componentDidHide') {
                    hasComponentDidHide = true;
                }
            }
        },
        ImportDeclaration(astPath) {
            const node = astPath.node;
            const source = node.source;
            let value = source.value;
            const specifiers = node.specifiers;
            if (helper_1.isAliasPath(value, alias)) {
                value = helper_1.replaceAliasPath(sourceFilePath, value, alias);
            }
            if (isBuildQuickapp && helper_1.isQuickAppPkg(value)) {
                let defaultSpecifier = 'LOCAL';
                specifiers.forEach(item => {
                    if (item.type === 'ImportDefaultSpecifier') {
                        defaultSpecifier = item.local.name;
                    }
                });
                astPath.replaceWith(t.variableDeclaration('const', [
                    t.variableDeclarator(t.identifier(defaultSpecifier), t.callExpression(t.identifier(NON_WEBPACK_REQUIRE), [
                        t.stringLiteral(value)
                    ]))
                ]));
                return;
            }
            if (helper_1.isNpmPkg(value)) {
                if (value === helper_1.taroJsComponents) {
                    if (isBuildQuickapp) {
                        specifiers.forEach(specifier => {
                            const name = specifier.local.name;
                            if (!constants_1.QUICKAPP_SPECIAL_COMPONENTS.has(name)) {
                                taroSelfComponents.add(_.kebabCase(name));
                            }
                        });
                        taroSelfComponents.add('taro-page');
                    }
                    astPath.remove();
                }
                else {
                    const specifiers = node.specifiers;
                    if (value === helper_1.taroJsFramework) {
                        let defaultSpecifier = null;
                        specifiers.forEach(item => {
                            if (item.type === 'ImportDefaultSpecifier') {
                                defaultSpecifier = item.local.name;
                            }
                        });
                        if (defaultSpecifier) {
                            taroImportDefaultName = defaultSpecifier;
                        }
                        constants_1.excludeReplaceTaroFrameworkPkgs.add(taroMiniAppFramework);
                        if (!Array.from(constants_1.excludeReplaceTaroFrameworkPkgs).some(item => sourceFilePath.replace(/\\/g, '/').indexOf(item) >= 0)) {
                            value = taroMiniAppFramework;
                        }
                    }
                    else if (value === helper_1.taroJsRedux) {
                        specifiers.forEach(item => {
                            if (item.type === 'ImportSpecifier') {
                                const local = item.local;
                                if (local.type === 'Identifier' && local.name === 'connect') {
                                    taroJsReduxConnect = item.imported.name;
                                }
                            }
                        });
                    }
                    source.value = value;
                }
            }
            else {
                const extname = path.extname(value);
                if (!extname || helper_1.REG_SCRIPTS.test(value)) {
                    let vpath = helper_1.resolveScriptPath(path.resolve(sourceFilePath, '..', value));
                    if (fs.existsSync(vpath)) {
                        value = helper_1.promoteRelativePath(path.relative(sourceFilePath, vpath));
                        source.value = value.replace(path.extname(value), '');
                    }
                }
            }
        },
        CallExpression(astPath) {
            const node = astPath.node;
            const callee = node.callee;
            if (t.isMemberExpression(callee)) {
                if (taroImportDefaultName && callee.object.name === taroImportDefaultName && callee.property.name === 'render') {
                    astPath.remove();
                }
            }
            else if (callee.name === 'require') {
                const args = node.arguments;
                let value = args[0].value;
                const parentNode = astPath.parentPath.parentPath.node;
                if (helper_1.isAliasPath(value, alias)) {
                    value = helper_1.replaceAliasPath(sourceFilePath, value, alias);
                    args[0].value = value;
                }
                if (isBuildQuickapp && helper_1.isQuickAppPkg(value)) {
                    callee.name = NON_WEBPACK_REQUIRE;
                    return;
                }
                if (helper_1.isNpmPkg(value)) {
                    if (value === helper_1.taroJsComponents) {
                        if (isBuildQuickapp) {
                            if (parentNode.declarations.length === 1 && parentNode.declarations[0].init) {
                                const id = parentNode.declarations[0].id;
                                if (id.type === 'ObjectPattern') {
                                    const properties = id.properties;
                                    properties.forEach(p => {
                                        if (p.type === 'ObjectProperty' && p.value.type === 'Identifier') {
                                            taroSelfComponents.add(_.kebabCase(p.value.name));
                                        }
                                    });
                                }
                            }
                        }
                        astPath.remove();
                    }
                    else {
                        if (t.isVariableDeclaration(astPath.parentPath.parentPath)) {
                            if (parentNode.declarations.length === 1 && parentNode.declarations[0].init) {
                                const id = parentNode.declarations[0].id;
                                if (value === helper_1.taroJsFramework && id.type === 'Identifier') {
                                    taroImportDefaultName = id.name;
                                    constants_1.excludeReplaceTaroFrameworkPkgs.add(taroMiniAppFramework);
                                    if (!Array.from(constants_1.excludeReplaceTaroFrameworkPkgs).some(item => sourceFilePath.replace(/\\/g, '/').indexOf(item) >= 0)) {
                                        value = taroMiniAppFramework;
                                    }
                                }
                                else if (value === helper_1.taroJsRedux) {
                                    const declarations = parentNode.declarations;
                                    declarations.forEach(item => {
                                        const id = item.id;
                                        if (id.type === 'ObjectPattern') {
                                            const properties = id.properties;
                                            properties.forEach(p => {
                                                if (p.type === 'ObjectProperty') {
                                                    if (p.value.type === 'Identifier' && p.value.name === 'connect') {
                                                        taroJsReduxConnect = p.key.name;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                        args[0].value = value;
                    }
                }
                else {
                    const extname = path.extname(value);
                    let vpath = helper_1.resolveScriptPath(path.resolve(sourceFilePath, '..', value));
                    if (!extname || helper_1.REG_SCRIPTS.test(value)) {
                        if (fs.existsSync(vpath)) {
                            value = helper_1.promoteRelativePath(path.relative(sourceFilePath, vpath));
                            args[0].value = value.replace(path.extname(value), '');
                        }
                    }
                }
            }
        },
        ExportDefaultDeclaration(astPath) {
            const node = astPath.node;
            const declaration = node.declaration;
            needExportDefault = false;
            if (declaration &&
                (declaration.type === 'ClassDeclaration' || declaration.type === 'ClassExpression')) {
                const superClass = declaration.superClass;
                if (superClass) {
                    let hasCreateData = false;
                    astPath.traverse({
                        ClassMethod(astPath) {
                            if (astPath.get('key').isIdentifier({ name: '_createData' })) {
                                hasCreateData = true;
                            }
                        }
                    });
                    if (hasCreateData) {
                        needExportDefault = true;
                        if (declaration.id === null) {
                            componentClassName = '_TaroComponentClass';
                        }
                        else if (declaration.id.name === 'App') {
                            componentClassName = '_App';
                        }
                        else {
                            componentClassName = declaration.id.name;
                        }
                        const isClassDcl = declaration.type === 'ClassDeclaration';
                        const classDclProps = [t.identifier(componentClassName), superClass, declaration.body, declaration.decorators || []];
                        astPath.replaceWith(isClassDcl ? t.classDeclaration.apply(null, classDclProps) : t.classExpression.apply(null, classDclProps));
                    }
                }
            }
            else if (declaration.type === 'CallExpression') {
                const callee = declaration.callee;
                if (callee && callee.type === 'CallExpression') {
                    const subCallee = callee.callee;
                    if (subCallee.type === 'Identifier' && subCallee.name === taroJsReduxConnect) {
                        const args = declaration.arguments;
                        if (args.length === 1 && args[0].name === componentClassName) {
                            needExportDefault = true;
                            exportTaroReduxConnected = `${componentClassName}__Connected`;
                            astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(`${componentClassName}__Connected`), t.callExpression(declaration.callee, declaration.arguments))]));
                        }
                    }
                }
            }
            else if (declaration.type === 'Identifier') {
                const name = declaration.name;
                if (name === componentClassName || name === exportTaroReduxConnected) {
                    needExportDefault = true;
                    astPath.remove();
                }
            }
        },
        AssignmentExpression(astPath) {
            const node = astPath.node;
            const left = node.left;
            if (t.isMemberExpression(left) && t.isIdentifier(left.object)) {
                if (left.object.name === componentClassName
                    && t.isIdentifier(left.property)
                    && left.property.name === 'config') {
                    needSetConfigFromHooks = true;
                    configFromHooks = node.right;
                }
            }
        },
        Program: {
            exit(astPath) {
                astPath.traverse({
                    ClassBody(astPath) {
                        if (isBuildQuickapp) {
                            const node = astPath.node;
                            if (!hasComponentWillMount) {
                                node.body.push(t.classMethod('method', t.identifier('componentWillMount'), [], t.blockStatement([]), false, false));
                            }
                            if (!hasComponentDidShow) {
                                node.body.push(t.classMethod('method', t.identifier('componentDidShow'), [], t.blockStatement([]), false, false));
                            }
                            if (!hasComponentDidHide) {
                                node.body.push(t.classMethod('method', t.identifier('componentDidHide'), [], t.blockStatement([]), false, false));
                            }
                            node.body.push(t.classMethod('method', t.identifier('__listenToSetNavigationBarEvent'), [], t.blockStatement([astConvert_1.convertSourceStringToAstExpression(`if (!Taro.eventCenter.callbacks['TaroEvent:setNavigationBar']) {
                    Taro.eventCenter.on('TaroEvent:setNavigationBar', params => {
                      if (params.title) {
                        this.$scope.$page.setTitleBar({ text: params.title })
                      }
                      if (params.frontColor) {
                        this.$scope.$page.setTitleBar({ textColor: params.frontColor })
                      }
                      if (params.backgroundColor) {
                        this.$scope.$page.setTitleBar({ backgroundColor: params.backgroundColor })
                      }
                    })
                  }`)]), false, false));
                            node.body.push(t.classMethod('method', t.identifier('__offListenToSetNavigationBarEvent'), [], t.blockStatement([astConvert_1.convertSourceStringToAstExpression(`Taro.eventCenter.off('TaroEvent:setNavigationBar')`)]), false, false));
                        }
                        if (needSetConfigFromHooks) {
                            const classPath = astPath.findParent((p) => p.isClassExpression() || p.isClassDeclaration());
                            classPath.node.body.body.unshift(t.classProperty(t.identifier('config'), configFromHooks));
                        }
                    },
                    ClassMethod(astPath) {
                        if (isBuildQuickapp) {
                            const node = astPath.node;
                            const keyName = node.key.name;
                            if (keyName === 'componentDidShow' || keyName === 'componentWillMount') {
                                node.body.body.unshift(astConvert_1.convertSourceStringToAstExpression(`this.__listenToSetNavigationBarEvent()`));
                            }
                            else if (keyName === 'componentDidHide') {
                                node.body.body.unshift(astConvert_1.convertSourceStringToAstExpression(`this.__offListenToSetNavigationBarEvent()`));
                            }
                        }
                    },
                    ImportDeclaration(astPath) {
                        const node = astPath.node;
                        const specifiers = node.specifiers;
                        let needRemove = false;
                        specifiers.forEach(item => {
                            if (customComponents.has(item.local.name)) {
                                needRemove = true;
                            }
                        });
                        if (needRemove) {
                            astPath.remove();
                        }
                    },
                    CallExpression(astPath) {
                        const node = astPath.node;
                        const callee = node.callee;
                        if (callee.name === 'require') {
                            const parentNode = astPath.parentPath.node;
                            let needRemove = false;
                            const id = parentNode.id;
                            if (t.isObjectPattern(id)) {
                                const properties = id.properties;
                                properties.forEach(property => {
                                    if (t.isObjectProperty(property) && customComponents.has(property.value.name)) {
                                        needRemove = true;
                                    }
                                });
                            }
                            else if (t.isIdentifier(id) && customComponents.has(id.name)) {
                                needRemove = true;
                            }
                            if (needRemove) {
                                astPath.parentPath.parentPath.remove();
                            }
                        }
                    }
                });
                const node = astPath.node;
                const exportVariableName = exportTaroReduxConnected || componentClassName;
                if (needExportDefault && !isBuildQuickapp) {
                    const exportDefault = template(`export default ${exportVariableName}`, babylon_1.default)();
                    node.body.push(exportDefault);
                }
                switch (type) {
                    case helper_1.PARSE_AST_TYPE.ENTRY:
                        const pxTransformConfig = {
                            designWidth: designWidth || 750
                        };
                        if (deviceRatio) {
                            pxTransformConfig['deviceRatio'] = deviceRatio;
                        }
                        if (isBuildQuickapp) {
                            if (!taroImportDefaultName) {
                                node.body.unshift(template(`import Taro from '${taroMiniAppFramework}'`, babylon_1.default)());
                            }
                            node.body.push(template(`exportRes = require('${taroMiniAppFramework}').default.createApp(${exportVariableName})`, babylon_1.default)());
                            node.body.push(template(`export default exportRes`, babylon_1.default)());
                        }
                        else {
                            node.body.push(template(`App(require('${taroMiniAppFramework}').default.createApp(${exportVariableName}))`, babylon_1.default)());
                        }
                        node.body.push(template(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`, babylon_1.default)());
                        break;
                    case helper_1.PARSE_AST_TYPE.PAGE:
                        if (isUseComponentBuildPage) {
                            node.body.push(template(`Component(require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}, true))`, babylon_1.default)());
                        }
                        else if (isBuildQuickapp) {
                            const pagePath = sourceFilePath.replace(sourceDir, '').replace(/\\/g, '/').replace(path.extname(sourceFilePath), '');
                            if (!taroImportDefaultName) {
                                node.body.unshift(template(`import Taro from '${taroMiniAppFramework}'`, babylon_1.default)());
                            }
                            node.body.push(template(`exportRes = require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}, '${pagePath}')`, babylon_1.default)());
                            node.body.push(template(`export default exportRes`, babylon_1.default)());
                        }
                        else {
                            node.body.push(template(`Page(require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}, true))`, babylon_1.default)());
                        }
                        break;
                    case helper_1.PARSE_AST_TYPE.COMPONENT:
                        if (isBuildQuickapp) {
                            if (!taroImportDefaultName) {
                                node.body.unshift(template(`import Taro from '${taroMiniAppFramework}'`, babylon_1.default)());
                            }
                            node.body.push(template(`exportRes = require('${taroMiniAppFramework}').default.createComponent(${exportVariableName})`, babylon_1.default)());
                            node.body.push(template(`export default exportRes`, babylon_1.default)());
                        }
                        else {
                            node.body.push(template(`Component(require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}))`, babylon_1.default)());
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    });
    return ast;
}
exports.default = processAst;
