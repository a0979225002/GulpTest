// rollup.config.js
import ts from "rollup-plugin-ts";

/**
 * 打包兩個
 */
export default {
    input: ['Template/index.ts'],
    output: {
        dir: "dist/tcc",
        exports: "auto",
        sourcemap: true,
    },
    plugins: [
        ts({
            tsconfig: "tsconfig.json",
            declarationStats: declarationStats => console.log(declarationStats)
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