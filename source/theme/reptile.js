
document.addEventListener("DOMContentLoaded", function () {
    // bug-fix: issue only add caption to image under article > p
    Fluid.plugins.imageCaption(".markdown-body a.fancybox:not(.markdown-body > p > a.fancybox)");
    // extension:  toc-btn on left bottom of mobile
    const toc = document.getElementById("toc");
    if (toc) {
        const toc_header = document.querySelector("#toc .toc-header");
        const sidebar = toc.parentElement;
        const tocBtn = document.createElement("a");
        tocBtn.className = "toc";
        tocBtn.href = "javascript:void(0);";
        tocBtn.role = "button";
        tocBtn.innerHTML = '<i class="iconfont icon-list"></i>';
        tocBtn.addEventListener("click", function () { });
        document.body.querySelector("main").appendChild(tocBtn);
        let isMobile = false;
        const onresize = function () {
            isMobile = sidebar.offsetWidth === 0;
            if (isMobile) {
                tocBtn.style.display = "";
            } else {
                tocBtn.style.display = "none";
                toc.parentNode.removeChild(toc);
                sidebar.appendChild(toc);
                toc.classList.remove("toc-mobile");
            }
        };
        window.addEventListener("resize", onresize);
        tocBtn.addEventListener("click", function () {
            if (!isMobile) return;
            toc.parentNode.removeChild(toc);
            document.body.querySelector("main").appendChild(toc);
            toc.classList.add("toc-mobile");
            tocBtn.style.display = "none";
        });
        toc_header.addEventListener("click", function () {
            if (!isMobile) return;
            toc.classList.remove("toc-mobile");
            tocBtn.style.display = "";
        });
        onresize();
        window.setTimeout(() => {
            if (!document.querySelector(".toc-body ol")) {
                tocBtn.style.display = "none";
            }
        }, 50);
    }

    // extension:  ![](/img.png?size=300x)
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        const url = img.src;
        const params = new URLSearchParams(url.substring(url.indexOf('?') + 1));
        const sizeParam = params ? params.get('size') : null;
        if (sizeParam) {
            const [width, height] = sizeParam.split('x');
            if (width || height) {
                if (width) img.width = width;
                if (height) img.height = height;
                img.style.maxWidth = "100%";
            }
        }
    });


    // extension: toggle language en/zh-CN between two sites
    const mappings = [
        // domain
        ["//wxyhly.github.io", "//wxyhly-en.github.io"],
        // categories
        ["/四维空间系列/", "/4D-Space-Series/"],
        ["/四维世界系列/", "/4D-World-Series/"],
        ["/奇特世界系列/", "/Strange-World-Series/"],
        ["/Tesserxel系列/", "/Tesserxel-Series/"],
        ["/四维计算机图形学/", "/4D-Computer-Graphics/"],
        // tags
        ["/四维/", "/4D/"],
        ["/数学/", "/Mathematics/"],
        ["/物理/", "/Physics/"],
        ["/几何/", "/Geometry/"],
        ["/奇特想象/", "/Peculiar-Imagination/"],
        ["/拓扑学/", "/Topology/"],
    ];
    window.toggleLang = () => {
        let url = window.location.href;
        const p = window.location.port;
        if (p === "4000") url = url.replace(":4000", ":8001");
        else if (p === "8001") url = url.replace(":8001", ":4000");
        for (let [a, b] of mappings) {
            a = encodeURI(a);
            url = url.includes(a) ? url.replace(a, b) : url.includes(b) ? url.replace(b, a) : url;
        }
        window.location.href = url;
    }
});