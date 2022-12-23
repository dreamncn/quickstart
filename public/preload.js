const fs = require('fs');
const path=require('path');
const os = require("os");
const {shell} = require("electron");
const {exec} = require("child_process");
const travel = function (dir, depth, callback) {
    if (depth > 1) return;//大于二级目录不处理
    fs.readdirSync(dir).forEach((file) => {
        if (file.startsWith(".")) return;
        let pathname = path.join(dir, file);
        const split = utools.isWindows()?'\\':"/";
        const category = dir.substring(dir.lastIndexOf(split) + 1);
        const name = utils.replaceSuffix(file);
        const stats = fs.lstatSync(pathname);
        if (stats.isDirectory() && !pathname.endsWith(".app")) {
            travel(pathname, depth + 1, callback)
        } else {
            const images = ['png', 'jpg', 'jpeg', 'bmp', 'ico', 'gif', 'svg'];
            for (let i = 0; i < images.length; i++) {
                if (file.endsWith("." + images[i])) {
                    return//图片就不处理
                }
            }
            if (os.type() === "Darwin") {
                //判断mac替身
                if (!stats.isDirectory() && utils.isMacLink(pathname)) {
                    pathname = utils.getMacLink(pathname);
                }
            } else if (os.type() === "Windows_NT") {
                if (utils.isWindowsLink(pathname)) pathname = utils.getWindowsLink(pathname);
            } else {
                if (utils.isLinuxLink(pathname)) pathname = utils.getLinuxLink(pathname);
            }
            if (stats.isSymbolicLink()) {
                pathname = fs.readlinkSync(pathname);
            }
            callback(category, name, pathname)
        }
    })
};
const transferDirs = function (dir){
    var list = {};
    travel(dir,0,function (category,name,link) {
        let data = ['png', 'jpg', 'jpeg', 'bmp', 'ico', 'gif', 'svg'];
        let logo = utils.getBase64Ico(link);
        //如果同路径下存在同名图片则认为是路径
        for (let i = 0; i < data.length; i++) {
            const p = utils.replaceSuffix(link)+"."+data[i];
            if(fs.existsSync(p)){
                logo = utils.getBase64Ico(p);
                break;
            }
        }
        utools.db.put({
            _id: link,
            data: logo
        });
        //为了json的轻量，将图片丢到数据库
        const json = {
            "name": name,
            "link": link,
        };
        if(!list[category]){
            list[category] = [];
        }
        list[category].push(json);
    });
    return list;
}
window.selectDir=function () {
    const result = utools.showOpenDialog({
        filters: [],
        properties: ['openDirectory']
    })
    if(result===undefined)return null;
    return result[0];
}
window.addApps=function (path){
    //删除存储的数据
    const quickList = utools.db.get("quick_list");
    if(quickList!==null){
        const json = JSON.parse(quickList.data);
        for (const jsonKey in json) {
            for (const jsonKeyElement of json[jsonKey]) {
                utools.db.remove(jsonKeyElement.link);
                utools.removeFeature("quick_link:"+jsonKeyElement.link);
            }
        }
    }
    utools.db.remove("quick_list")
    const quick_list = transferDirs(path)
    utools.db.put({
        //存储的时候自动排序
        _id:"quick_list",data:JSON.stringify(quick_list)
    });
    let global_setting = {style:"",location:"left",dir:"",icon:"icon",utools:true};
    const setting = utools.db.get("setting");
    if(setting!==null)
        global_setting = JSON.parse(setting.data);
    if(global_setting.utools){
        for (const sortName in quick_list) {
            for (const listItem of quick_list[sortName]) {
                utools.setFeature({
                    code: "quick_link:"+listItem.link,
                    explain: sortName,
                    platform:['darwin' , 'win32' , 'linux'],
                    icon: utools.db.get(listItem.link).data,
                    cmds: [listItem.name]
                });
            }}
    }

}
window.openLink=function (link) {
    window.utools.hideMainWindow()
    utools.shellOpenPath(link)
    window.utools.outPlugin()
}
var utils = {
    isMacLink(path) {
        let read;
        const fd = fs.openSync(path, 'r');
        try {
            read = Buffer.alloc(16)
            fs.readSync(fd, read, 0, 16, 0)
        } finally {
            fs.closeSync(fd)
        }
        const expected = '626f6f6b000000006d61726b00000000';
        const actual = read.toString("hex");
        return (actual === expected)
    },
    isWindowsLink(path) {
        return path.toLowerCase().endsWith(".lnk");
    },
    isLinuxLink(path){
        return path.toLowerCase().endsWith(".desktop");
    },
    getMacLink(url){
        //没有完全按照结构化去构造mac alia 的数据结构，只是提取了些许特征进行匹配
        // console.log(path.basename(url))
        let p = fs.readFileSync(url)
        let start = 0, end =0,findDnib = false;
        let first = false,strEnd = false,str = "/";
        for (let i = 80; i < p.length; i++) {
            // console.log(p.subarray(i,i+4).toString(),p.subarray(i,i+4).toString("hex"))
            if(!strEnd){
                if(p.subarray(i,i+1).toString("hex").startsWith("0")){
                    first = true
                    //continue
                    // 0开头的表示不可显示的字符
                }else{
                    if(p.subarray(i,i+1).toString()==="$"||p.subarray(i,i+4).toString("hex")==="20000000") {
                        strEnd = true
                        if(str.lastIndexOf("/")+2 === str.length){
                            str = str.substring(0,str.lastIndexOf("/"))
                        }
                        //
                    }else {
                        // TODO 此处有问题，因为是按照字节转换的，所以遇到中文（双字节）会出现乱码，以后再说吧。
                        if(first){
                            first = false;

                            str+="/"+p.subarray(i,i+1).toString("utf8")
                        }else{
                            str+=p.subarray(i,i+1).toString("utf8")
                        }
                    }
                }
            }


            if(p.subarray(i,i+4).toString("hex")==="646e6962"){
                findDnib = true;
            }
            if(findDnib && p.subarray(i,i+4).toString("hex")==="66696c65"){
                start = i;
                //找到
                // console.log("找到起点",start)
                // console.log(p.subarray(i).toString(),p.subarray(i).toString("hex"))
                let find = false;
                for (let j = i; j < p.length ; j++) {
                    //  console.log(p.subarray(j,j+4).toString(),p.subarray(j,j+4).toString("hex"))
                    if(p.subarray(j,j+1).toString("hex")==="00"){
                        end = j;
                        //  console.log("------> 找到终点",end)
                        find  = true;
                        break
                    }
                }
                if(find)break
            }

            //  console.log(i,p.subarray(i,i+1).toString("hex"),p.subarray(i,i+1).toString())
        }
        if(end<=start){
            if(str==="/")return url;
            return str;
            // console.log("无法定位数据",str)
        }else{
            const data = p.subarray(start,end).toString("utf8");
            return decodeURI(data.substring("file://".length,data.lastIndexOf("/")))
        }
        //   console.log(p.toString())

    },
    getLinuxLink(filepath, key="Name"){
        return new Promise(function(resolve, reject) {
            let sh = `grep '^Exec=' ${filepath} | sed -e 's!^${key}=!!;q'`
            exec(sh, function(err, stdout, stderr) {
                resolve(stdout);
            })
        });
    },
    getWindowsLink(filepath){
        let data = filepath;
        try {
            data = shell.readShortcutLink(filepath).target;
        } catch {}
        return data;
    }
    ,replaceSuffix(t){
        if(t.lastIndexOf(".")!==-1){
            return t.substring(0,t.lastIndexOf("."));
        }
        return t
    },getBase64Ico(filepath) {
        let sourceImage, ext = path.extname(filepath).slice(1);
        if (['png', 'jpg', 'jpeg', 'bmp', 'ico', 'gif', 'svg'].includes(ext)) {
            if (ext === 'svg') ext = 'svg+xml'
            sourceImage = `data:image/${ext};base64,` + fs.readFileSync(filepath, 'base64')
        } else {
            sourceImage = utools.getFileIcon(filepath)
        }
        return sourceImage
    },//打开文件方法




}
