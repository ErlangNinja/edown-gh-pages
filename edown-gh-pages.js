if (!window.console) {
    window.console = {
        log: function (msg) {
        }
    };
}

var edown_gh_pages = function (options) {

    var opts = $.extend({
        sidebar_id: "#sidebar",
        content_id: "#content",
        base_url: "",
        start_page: "README.md",
        on_load: function(element) { }
    }, options);

    function hashChange() {
        if (location.hash.indexOf("#!") == 0) {
            loadContent(location.hash.slice(2));
        }
    }

    function loadContent(URL) {
        $.get(URL, function (markdown) {
            marked(markdown, function (err, content) {
                if (err) throw err
                $(opts.content_id).html(content);
                contentLoaded();
            });
        });
    }
    
    function contentLoaded() {
        var element = $(opts.content_id).get();
        $('pre code', element).each(function(i, block) {
            if (block.className.indexOf("lang-") < 0) {
                $(block).addClass("lang-erlang");
            }
        });
        opts.on_load(element);
    }

    function extractModules() {
        $(opts.sidebar_id).append("<li><strong>Modules</strong></li>");
        $(opts.content_id).find("table[summary='list of modules'] a").each(function (i, module) {
            var href = "#!" + opts.base_url + $(module).attr("href");
            $(opts.sidebar_id).append("<li><a href=\"" + href + "\">" + $(module).text() + "</a></li>");
            $(module).attr("href", href);
        });
    }

    function loadStartPage() {
        $.get(opts.base_url + opts.start_page, function (markdown) {
            marked(markdown, function (err, html) {
                if (err) throw err;
                $(opts.sidebar_id).append("<li><strong><a href=\"#!" + opts.base_url + opts.start_page + "\">Home</a></strong></li>");
                $(opts.content_id).html(html);
                contentLoaded();
                document.title = $(opts.content_id).find("h1").text();
                extractModules();
                $(window).on("hashchange", hashChange);
                hashChange();
            });
        });
    }

    $(function () {
        loadStartPage();
    });

};
