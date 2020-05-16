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
const sax = require("sax");
const loader_utils_1 = require("loader-utils");
function miniTemplateLoader(source) {
    this.cacheable && this.cacheable();
    const parser = sax.parser(false, { lowercase: true });
    const requests = new Set();
    const callback = this.async();
    const loadModule = request => new Promise((resolve, reject) => {
        this.addDependency(request);
        this.loadModule(request, (err, src) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(src);
            }
        });
    });
    parser.onattribute = ({ name, value }) => {
        if (value && name === 'src' && loader_utils_1.isUrlRequest(value)) {
            const request = loader_utils_1.urlToRequest(value);
            requests.add(request);
        }
    };
    parser.onend = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const requestsArray = Array.from(requests);
            if (requestsArray.length) {
                for (let i = 0; i < requestsArray.length; i++) {
                    yield loadModule(requestsArray[i]);
                }
            }
            callback(null, source);
        }
        catch (error) {
            callback(error, source);
        }
    });
    parser.write(source).close();
}
exports.default = miniTemplateLoader;
