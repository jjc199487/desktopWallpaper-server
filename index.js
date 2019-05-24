
const ThemeOperation = require('./themeOperation');

class main {
    constructor() {
        this.init();
        this.themeOperation = null; //主题操作对象
    }
    async init() {
        this.themeOperation = new ThemeOperation();
        await this.themeOperation.addThemeList();
        console.log(222222222222222);
    }
}
new main();



