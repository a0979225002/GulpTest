/**
     * @Author XIAO-LI-PIN
     * @Description 通用模板
     * @Date 2021-04-14 下午 20:24
     * @Version 1.1
     */
import OverrideComponent from "./OverrideComponent";
export default abstract class AGenericTemplate extends OverrideComponent {

        /**
         * 自訂義初始狀態
         */
        protected abstract onCreate(): void;

        /**
         * 語系設置
         */
        protected abstract languageSetting(): void;

        /**
         * 一律使用onCreate() 代替  onLoad()
         * @protected
         */
        protected onLoad(): void {
            this.onCreate();
        }

        protected start(): void {
            this.languageSetting();
        }
    }