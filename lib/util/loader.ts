import Logger from "./logger";

const fs = require("fs");
const {resolve} = require("path");

/**
 * Loader 加载器， 用于加载Service、Controller、Middleware等
 */
export default class Loader {

    /**
     * 加载指定的文件
     */
    public static loadFile(path: string) {
        if (!fs.existsSync(path) || !fs.statSync(path).isFile()) {
            return null;
        }
        return require(path).default;
    }

    /**
     * 检查文件是否存在
     */
    public static existFile(path: string) {
        return fs.existsSync(path) && fs.statSync(path).isFile();
    }

    /**
     * 加载指定目录的default导出
     * @param path
     */
    public static load(path: string) {
        const exist = fs.existsSync(path);
        const modules: Map<string, Function> = new Map<string, Function>();
        if (!exist) {
            throw new Error(`${path} is not exist`);
        }

        // 文件夹...
        if (fs.statSync(path).isDirectory()) {
            const files = fs.readdirSync(path);
            files.forEach(name => {
                const entries = Loader.load(resolve(path, name)).entries();
                let next = entries.next();
                while (!next.done) {
                    modules.set(next.value[0], next.value[1]);
                    next = entries.next();
                }
            });
            return modules;
        }

        const controller = require(path);
        if (!controller.default) {
            Logger.warning(`NOT LOAD ${path}`);
        } else {
            Logger.info(`LOAD -> ${path}`);
            modules.set(path, controller.default);
        }
        return modules;
    }


}
