// ==UserScript==
// @name         hentai-cosplays.com batch download
// @version      0.5
// @description  downloads full sets from hentai-cosplays.com and hentai-img.com
// @author       teo3300
// @include      https://hentai-cosplay-xxx.com/*
// @exclude      https://hentai-cosplay-xxx.com/*/attachment/*
// @include      https://hentai-cosplays.com/*
// @exclude      https://hentai-cosplays.com/*/attachment/*
// @include      https://hentai-img.com/*
// @exclude      https://hentai-img.com/*/attachment/*
// @include      https://porn-images-xxx.com/*
// @exclude      https://porn-images-xxx.com/*/attachment/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.6/dat.gui.min.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/src/FileSaver.js
// @permission   download
// ==/UserScript==

(function() {
    'use strict';
    var set_last;
    var remaining;

    var common_exts = ["jpg","jpeg","png","gif","webp"];

    function append(zip, folder, base_uri, number, ext, padding){
        var _URI = base_uri + '/' + number.toString().padStart(padding, '0') + "."
        var success = false;
        function reqExt(ext){
            GM_xmlhttpRequest({
                method: 'GET',
                url: _URI,
                responseType: "blob",
                onload: function(response){
                    if(response.status === 200){
                        folder.file(number + "." + ext, response.responseText, {binary: true});
                        console.log("downloading file: " + number);
                        success = true;
                        remaining--;
                    } else {
                        //console.log("ERROR: fetching file: " + number);
                        console.log("ERROR: fetching uri: " + _URI);
                    }
                    if(remaining == 0){
                        zip.generateAsync({type:"blob"}).then(function(content){
                            saveAs(content, content_group + ".zip");
                        });
                    }
                }
            });
        }
        reqExt(ext);
        if (success == false) {
            for (let i = 0; i < common_exts.length && (success == false); i++) {
                if (common_exts[i] != ext) {
                    reqExt(common_exts[i]);
                }
            }
        }
    }

    function batch_download(){
        console.log("requesting last page...");
        var last_page = document.getElementById("paginator").lastElementChild.firstElementChild
        if(last_page != null){
            last_page = last_page.href;
            GM_xmlhttpRequest({
                method: 'GET',
                url: last_page,
                onload: function(response){
                    if(response.status === 200){
                        var el = document.createElement( 'html' );
                        el.innerHTML = response.responseText;
                        console.log("retriving last image...");
                        var last_src = el.getElementsByClassName("icon-overlay");
                        last_src = last_src[last_src.length-1].firstElementChild.firstElementChild.src;
                    }
                    set_last = parseInt(last_src.split('/').pop().split('.')[0]);
                    remaining = set_last;
                    console.log("Set size: " + set_last);
                    var zip = new JSZip();
                    var folder = zip.folder(content_group);
                    console.log("beginning download");
                    for (let i = 1; i<=set_last; i++){
                        append(zip, folder, src_base_uri, i, src_ext, padding_length);
                    }
                }
            });
        } else {
            var last_src = document.getElementsByClassName("icon-overlay");
            last_src = last_src[last_src.length-1].firstElementChild.firstElementChild.src;
            set_last = parseInt(last_src.split('/').pop().split('.')[0]);
            remaining = set_last;
            console.log("Set size: " + set_last);
            var zip = new JSZip();
            var folder = zip.folder(content_group);
            console.log("beginning download");
            for (let i = 1; i<=set_last; i++){
                append(zip, folder, src_base_uri, i, src_ext, padding_length);
            }
        }
    }

    //############################ IF

    var if_box = document.createElement("div");
    var download_button = document.createElement("button");
    download_button.innerText = "Download full set";
    download_button.onclick = function (){batch_download()};
    var if_position = document.getElementById("title");
    if_position.appendChild(if_box);

    //############################

    var content_group = document.getElementById("title").innerText;
    var src_doc = document.getElementById("display_image_detail");
    if(src_doc.getElementsByClassName("icon-overlay").length != 0){
        src_doc = src_doc.getElementsByClassName("icon-overlay")[0].firstElementChild.firstElementChild.src;
    } else {
        src_doc = src_doc.firstElementChild.firstElementChild.firstElementChild.src;
    }
    var src_base_uri = src_doc.substring(0, src_doc.lastIndexOf('/'));
    var src_ext = src_doc.split('.').pop();
    var padding_length = src_doc.length - src_base_uri.length - src_ext.length - 4;
    if(/.*\/p=[0-9]+$/.test(src_base_uri)){ src_base_uri = src_base_uri.substring(0, src_base_uri.lastIndexOf('/')); } // prevent from downloading rescaled images
    console.log("Target: " + src_base_uri);

    if_box.appendChild(download_button);

})();
