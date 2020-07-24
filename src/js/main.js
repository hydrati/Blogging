/*
 * Bloging 0.114514
 * Open Sources With MIT License
 * Author: 186526
 * Build with Love & bug
 */
function getpar(r) {
    for (
        var n = window.location.search.substring(1).split("&"), t = 0;
        t < n.length;
        t++
    ) {
        var i = n[t].split("=");
        if (i[0] == r && null == i[1]) return !0;
        if (i[0] == r) return i[1];
    }
    return !1;
}
if (!getpar("p")) {
    if (!getpar("url")) {
        if (!getpar("page")) {
            window.location.search = "?page=home"; //check if user didn't give a param
        }
        else {
            var settings = { par : "page" };
        }
    } else {
        var settings = { par: "url" };
    }
} else {
    var settings = { par: "p" };
}
settings.domain = window.location.protocol + "//" + window.location.host;
var config, mdcontent;
fetch("config.json")
    .then((res) => {
        if (res.status >= 200 && res.status < 300) {
            return res;
        } else {
            document.all[0].innerHTML =
                "<h1>Error fetch config.json<br>Status Code=" + res.status + "</h1>";
            console.log(res.status);
        }
    })
    .then((res) => res.json())
    .then(function (resconfig) {
        config = resconfig;
        settings.themeUrl =
            settings.domain + "/" + config.file.theme + config.theme + "/";
        settings.post = settings.domain + "/" + config.file.post;
    })
    .then(function () {
        if (settings.par === "url") {
            settings.content = { url: decodeURIComponent(getpar(settings.par)) };
            fetch(settings.content.url)
                .then((res) => {
                    settings.content.status = res.status;
                    settings.date = new Date();
                    if (res.status >= 200 && res.status < 300) {
                        return res;
                    } else {
                        fetch(settings.themeUrl + "html/" + "404.html")
                            .then((response) => response.text())
                            .then(function (text) {
                                settings.content.success = false;
                                settings.content.preview = {
                                    response: null,
                                    mdcontent: null,
                                };
                                document.write(text);
                            });
                    }
                })
                .then((res) => res.text())
                .then((content) => {
                    settings.content.preview = {
                        response: content,
                    };
                    settings.content.preview.mdcontent = marked(content);
                    return marked(content);
                })
                .then((mdcontent) => {
                    fetch(settings.themeUrl + "html/" + "200.html")
                        .then((response) => response.text())
                        .then(function (text) {
                            settings.content.success = true;
                            document.write(text);
                        });
                })
                .catch(function (t) {
                    settings.content.preview.mdcontent = t.message;
                    document.write(t.message);
                    return t.message;
                });
        } else if (settings.par === "p") {
            settings.content = {
                url: decodeURIComponent(settings.post + getpar(settings.par) + ".md"),
            };
            fetch(settings.content.url)
                .then((res) => {
                    settings.content.status = res.status;
                    settings.date = new Date();
                    if (res.status >= 200 && res.status < 300) {
                        return res;
                    } else {
                        fetch(settings.themeUrl + "html/" + "404.html")
                            .then((response) => response.text())
                            .then(function (text) {
                                settings.content.success = false;
                                settings.content.preview = {
                                    response: null,
                                    mdcontent: null,
                                };
                                document.write(text);
                            });
                    }
                })
                .then((res) => res.text())
                .then((content) => {
                    settings.content.preview = {
                        response: content,
                    };
                    settings.content.preview.mdcontent = marked(content);
                    return marked(content);
                })
                .then((mdcontent) => {
                    fetch(settings.themeUrl + "html/" + "200.html")
                        .then((response) => response.text())
                        .then(function (text) {
                            settings.content.success = true;
                            document.write(text);
                        });
                })
                .catch(function (t) {
                    settings.content.preview.mdcontent = t.message;
                    document.write(t.message);
                    return t.message;
                });
        } else if (settings.par === "page") {
            settings.content={url:settings.themeUrl+"html/"+getpar(settings.par)+".html"};
            fetch(settings.content.url)
            .then((res) => {
                settings.content.status = res.status;
                settings.date = new Date();
                if (res.status >= 200 && res.status < 300) {
                    return res;
                } else {
                    fetch (settings.themeUrl + "html/" + "404.html")
                    .then((response) => response.text())
                    .then(function (text){
                        settings.content.success = false;
                        settings.content.preview = {
                            response: null,
                            mdcontent: null,
                        };
                        document.write(text);
                    });
                }
            }).then((content) => content.text())
            .then(content =>{
                settings.content.success = true;
                settings.content.preview = {
                    response: content,
                };
                document.write(content);
            });
        }
    });
console.log(settings);
