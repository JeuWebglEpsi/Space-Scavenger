var sizeMainFrame = function () {
    console.log("resizing");
    var win = $(window);
    var mainFrame = $('#mainContainer canvas');
    mainFrame.height(win.height());
    mainFrame.width(win.width());
}
window.addEventListener("resize", sizeMainFrame);
