import * as tslib_1 from "tslib";
import { Vue } from 'vue-property-decorator';
var InputLockConstructor = /** @class */ (function (_super) {
    tslib_1.__extends(InputLockConstructor, _super);
    function InputLockConstructor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lockPromptText = '';
        _this.isShowPrompt = false;
        _this.currentText = '';
        _this.isShowClearCache = false;
        _this.form = { password: '' };
        return _this;
    }
    return InputLockConstructor;
}(Vue));
export { InputLockConstructor };
//# sourceMappingURL=InputLockConstructor.js.map