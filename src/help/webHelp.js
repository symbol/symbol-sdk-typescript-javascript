import * as tslib_1 from "tslib";
import request from 'request';
var WebClient = /** @class */ (function () {
    function WebClient() {
    }
    ;
    WebClient.request = function (content, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contentBuf;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contentBuf = new Buffer(content);
                        if (!options.headers) {
                            options.headers = {};
                        }
                        options.headers['Content-Length'] = contentBuf.byteLength;
                        return [4 /*yield*/, WebClient.httpRequest(contentBuf, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    WebClient.httpRequest = function (content, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isCalled;
            return tslib_1.__generator(this, function (_a) {
                isCalled = false;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var req = request(options, function (err, res, body) {
                            if (isCalled) {
                                return console.error(null, "Multiple requests");
                            }
                            isCalled = true;
                            if (err) {
                                reject(err);
                            }
                            resolve(body);
                        });
                        req.write(content);
                        req.end();
                    })];
            });
        });
    };
    return WebClient;
}());
export { WebClient };
//# sourceMappingURL=webHelp.js.map