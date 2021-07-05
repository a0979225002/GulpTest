

/**
 * 默認構建
 */
export default function build(cb: Function) {
    console.log("建構框架\t", "buildFramework");
    console.log("建構混淆加密框架\t", "buildFramework2");
    console.log("建構模板\t", "buildTemplate");
    console.log("建構混淆加密模板\t", "buildTemplate2");
    cb()
}

export {buildTemplate, buildTemplate2} from "./template";