// rollup.config.js
import ts from "rollup-plugin-ts";

/**
 * 打包兩個
 */
export default {
    input: ['Template/index.ts'],
    output: {
        file:'dist/Test/Test.js',
        exports: "auto",
        format:'es',
        sourcemap: true,
    },
    plugins: [
        ts({
            tsconfig: "tsconfig.json",

        }),
    ]
}


// /**
//  * 全部一起打包
//  */
// export default {
//     input: ['Template/**/*.ts'],
//     output: {
//         file: 'dist/Test/Test.js',
//         exports: 'auto',
//         format: "es"
//     },
//
//     plugins: [
//         ts({
//             tsconfig: "tsconfig.json",
//         }),
//         multi()]
// }