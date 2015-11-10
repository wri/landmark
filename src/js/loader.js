(function() {
    require(["main/Main"], function(Main) {
        document.body.parentNode.removeAttribute("lang");
        Main.init();
    });
})();
