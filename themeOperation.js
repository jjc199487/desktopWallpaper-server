const request = require("request");
const cheerio = require('cheerio');
const zlib = require('zlib');
const fs = require("fs");
var iconv = require('iconv-lite');  

// 添加主题
class ThemeOperation {
    constructor() {
        this.themeHost = 'http://desk.zol.com.cn'
        this.themePage = 1;
        this.themeUrl = `${this.themeHost}/26/${this.themePage}.html`;
        this.themeList = []; // 主题列表
    }
    // 添加主题信息
    async addThemeList() {

        return new Promise((resolve, reject) => {
            console.log('爬取主题网页', this.themeUrl)
            const req = request.get({
                url: this.themeUrl,
                encoding: null, // 此处要显式为null，不然内部会默认进行toString，toString参数没有的情况下，默认格式为utf8
                // proxy: ip,
                // headers: {
                //     'User-Agent': userAgent,
                //     accept: '*/*',
                //     'Origin':'https://www.imooc.com',
                //     'Referer':'https://www.imooc.com',
                //     'Host':'www.imooc.com',
                //     'Connection':'keep-alive',
                //     'Cookie': 'UM_distinctid=162f1d130d21ce-03800955807383-336c7b05-13c680-162f1d130d32d1; CNZZDATA1261110065=1500861835-1524473432-https%253A%252F%252Fwww.baidu.com%252F%7C1524473432; imooc_uuid=2a3b905e-ee72-4e57-bd30-1e913806335e; imooc_isnew_ct=1524475442; imooc_isnew=2; IMCDNS=0; PHPSESSID=ppb2ulka03gingrd146go1ool2; loginstate=1; apsid=IwZmM3NTVmNGJlM2E4YmVmNTA2OGFmOWU1MTkxMDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANDAzNjE0MQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxMTY5MTcwMTY1QHFxLmNvbQAAAAAAAAAAAAAAAAAAADY1Y2U0N2NiYWVkZDUwYzU3NDU0Yzg1YTY4YTJlYjcxjW1DW41tQ1s%3DZj; last_login_username=1169170165%40qq.com; Hm_lvt_fb538fdd5bd62072b6a984ddbc658a16=1531364486,1531374595,1531377700,1531393846; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1531364486,1531374595,1531377700,1531393846; Hm_lpvt_fb538fdd5bd62072b6a984ddbc658a16=1531393855; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1531393855; cvde=5b436d5ef259b-605',

                // },
            }, (error, response, body) => {
                if (error) {
                    console.log('抓取主题网页错误');
                    reject(error);
                    return null;
                }
                const doc = iconv.decode(body, 'gb2312').toString();
                const $ = cheerio.load(doc);
                let picList2 = $('.pic-list2');
                const that = this;
                picList2.find('li').each(function(i,v) {
                    let picDom = $(this).find('.pic')
                    let imaUrl = picDom.attr('href');
                    let title = picDom.find('img').attr('title');
                    let time = $(this).find('ins').text();
                    that.themeList.push({
                        imaUrl,
                        title,
                        time,
                    })
                });
                // 判断是否是最后一页
                let page= $('.page');
                // console.log(page.children().last().attr("class"));
                // console.log("路",this.themeUrl)
                if (picList2.html()) {
                    this.themePage += 1;
                    this.themeUrl = `${this.themeHost}/26/${this.themePage}.html`;
                    if(page.children().last().attr("class")!="next"){
                        fs.writeFileSync('./data.html', JSON.stringify(this.themeList));
                        // console.log(that.themeList)
                        reject();
                    }else{
                        this.addThemeList();
                    }
                } else {
                    // 爬取图片结束
                    fs.writeFileSync('./data.html', this.themeList);
                    console.log(that.themeList)
                    reject();
                }
            });
        });
    }
    // 添加主题对应的图片资源
    /** 
     * url 图片资源网址
     * index 对应父级主题索引
    */
    async addThemeSubImg(url, index) {
        return new Promise((resolve, reject) => {
            console.log('爬取主题图片网页', this.url)
            const req = request.get({
                url: url,
                encoding: null, // 此处要显式为null，不然内部会默认进行toString，toString参数没有的情况下，默认格式为utf8
            }, (error, response, body) => {
                if (error) {
                    console.log('抓取主题图片错误');
                    reject(error);
                }
                const doc = iconv.decode(body, 'gb2312').toString();
                const $ = cheerio.load(doc);
                let downInnerDom = $('.down-inner li');
                const that = this;
                picList2.find('li').each(function() {
                    let picDom = $(this).find('.pic')
                    let imaUrl = picDom.attr('href');
                    let title = picDom.find('img').attr('title');
                    let time = $(this).find('ins').text();
                    that.themeList.push({
                        imaUrl,
                        title,
                        time,
                    })
                });
                if (picList2.html()) {
                    this.page += 1;
                    this.url = `http://desk.zol.com.cn/26/${this.page}.html`;
                    this.addThemeList();
                } else {
                    // 爬取图片结束
                    fs.writeFileSync('./data.html', this.themeList);
                    reject();
                }
            });
        });
    }
}
module.exports = ThemeOperation;