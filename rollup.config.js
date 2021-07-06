// rollup.config.js
import multi from '@rollup/plugin-multi-entry';
import typescript from '@rollup/plugin-typescript';
import sourceMaps from "rollup-plugin-sourcemaps";
import multiInput from 'rollup-plugin-multi-input';
import ts from "rollup-plugin-ts";

/**
 * 打包兩個
 */
// export default [
//     {
//         input : ['Template/BaseTemplate/OverrideComponent.ts'],
//         output:{
//             dir:"dist/tcc",
//             sourcemap:true,
//             exports:"auto"
//         },
//         plugins:[
//             ts({
//                 declarationStats: declarationStats => console.log(declarationStats)
//             }),
//         ]
//     },
//     {
//         input : ['Template/BaseTemplate/AGenericTemplate.ts'],
//         output:{
//             dir:"dist/tcc",
//             exports:"auto",
//             sourcemap:true,
//         },
//         plugins:[
//             ts({
//                 tsconfig:"tsconfig.json",
//                 declarationStats: declarationStats => console.log(declarationStats)
//             }),
//         ]
//     }
// ]

/**
 * 全部一起打包
 */
export default {
    input : {
       include : 'Template/**/*.ts',
    },
    output:{
        file:'dist/Test/Test.js',
        exports: 'auto',
        format:"es"
    },

    plugins:[
        ts({
            tsconfig:"tsconfig.json",
        }),
        multi()]
}