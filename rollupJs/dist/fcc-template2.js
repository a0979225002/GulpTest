Object.defineProperty(exports, "__esModule", { value: true });
/**
     * @Author XIAO-LI-PIN
     * @Description 通用模板
     * @Date 2021-04-14 下午 20:24
     * @Version 1.1
     */
const OverrideComponent_1 = require("./OverrideComponent");
class AGenericTemplate extends OverrideComponent_1.default {
    /**
     * 一律使用onCreate() 代替  onLoad()
     * @protected
     */
    onLoad() {
        this.onCreate();
    }
    start() {
        this.languageSetting();
    }
}
exports.default = AGenericTemplate;
