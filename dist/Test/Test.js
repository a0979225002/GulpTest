/**
 * @Author XIAO-LI-PIN
 * @Description (Override)擴展cc.Component
 * @Date 2021-05-28 上午 10:11
 * @Version 1.0
 */
class OverrideComponent extends cc.Component {
    constructor() {
        super();
        this.scheduleTag = new Array();
    }
    /**
     * 獲取當前使用中的計時器
     * @returns {Array<Function>}
     */
    getScheduleTag() {
        return this.scheduleTag;
    }
    /**
     * 獲取當前還尚未釋放的計時器數量
     * @returns {number}
     */
    getScheduleAmount() {
        return this.scheduleTag.length;
    }
    /**
     * 可選循環次數計時器,額外新增增加保存使用中的計時器方法,與原版cocos使用上並無差別
     * @param {Function} callback - 返回方法
     * @param {number} interval - 間格時間
     * @param {number} repeat - 重複次數
     * @param {number} delay - 延遲時間
     */
    schedule(callback, interval, repeat, delay) {
        super.schedule(this.checkScheduleRepeat(callback, repeat), interval, repeat, delay);
        this.scheduleTag.push(callback);
    }
    /**
     * 確認當前計時器是否有使用重複次數
     * @protected
     */
    checkScheduleRepeat(callback, repeat) {
        if (repeat > 0) {
            callback.prototype = () => {
                repeat--;
                if (repeat < 0)
                    this.unschedule(callback);
                callback.apply(this);
            };
        }
        else {
            return callback;
        }
        return callback.prototype;
    }
    /**
     * 單次計時器,額外新增增加保存使用中的計時器方法,與原版cocos使用上並無差別
     * @param {Function} callback - 返回方法
     * @param {number} delay - 延遲時間
     */
    scheduleOnce(callback, delay) {
        callback.prototype = () => {
            this.unschedule(callback.prototype);
            callback.apply(this);
        };
        this.schedule(callback.prototype, 0, 0, delay);
    }
    /**
     * 清除單個計時器方法,額外新增刪除使用中的計時器紀錄,與原版cocos使用上並無差別
     * @param {Function} callback - 當初綁定的方法
     */
    unschedule(callback) {
        super.unschedule(this.checkScheduleTag(callback));
        let index = this.checkScheduleCallFunIndex(callback);
        if (index > -1) {
            this.scheduleTag.splice(index, 1);
        }
    }
    /**
     * 判斷當前方法是否正在等待計時器callback中
     * @param {Function} callback - 原本綁定該計時器的方法
     * @returns {number} - 返回當前this.getScheduleTag[]執行中的index位置,如果該陣列內無該方法,返回-1
     * @protected
     */
    checkScheduleCallFunIndex(callback) {
        let index;
        if (this.getScheduleTag().indexOf(callback) != -1) {
            index = this.scheduleTag.indexOf(callback);
        }
        else if (this.getScheduleTag().indexOf(callback.prototype) != -1) {
            index = this.scheduleTag.indexOf(callback.prototype);
        }
        else {
            return -1;
        }
        return index;
    }
    /**
     * 確認當前該方法以甚麼形式執行的,原型鏈 or 基礎方法
     * @param {Function} callback - 原本綁定該計時器的方法
     * @returns {Function} - 返回當前this.getScheduleTag[]內的該方法,如果該陣列內無該方法,返回undefined
     * @protected
     */
    checkScheduleTag(callback) {
        let fun = undefined;
        let index = this.checkScheduleCallFunIndex(callback);
        if (index > -1) {
            fun = this.scheduleTag[index];
        }
        return fun;
    }
    /**
     * 清除當前所有使用中的計時器,額外新增清空計時器數量方法,與原版cocos使用上並無差別
     */
    unscheduleAllCallbacks() {
        super.unscheduleAllCallbacks();
        this.scheduleTag.length = 0;
    }
}

/**
     * @Author XIAO-LI-PIN
     * @Description 通用模板
     * @Date 2021-04-14 下午 20:24
     * @Version 1.1
     */
class AGenericTemplate extends OverrideComponent {
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

export { AGenericTemplate, OverrideComponent };
//# sourceMappingURL=Test.js.map
