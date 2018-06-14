let { remote, ipcRenderer } = require('electron');
let url = remote.getCurrentWindow().YoutubeURL;
let iframe = document.getElementById('target');
let last_id;
let youtubeWindow;
iframe.src = 'default.html';
ipcRenderer.on('asynchronous-reply', function (event, arg) {
    if (arg.startsWith('https://youtu.be/')) {
        let id = arg.replace('https://youtu.be/', '');
        if (iframe && last_id != id) {
            if (youtubeWindow)
                youtubeWindow.close();
            last_id = id;
            iframe.src = `https://www.youtube.com/embed/${id}`;
        }
    }
});
setInterval(() => {
    ipcRenderer.send('asynchronous-message', 'get-clipboard');
}, 1000);
window.addEventListener('contextmenu', (e) => {
    youtubeWindow = window.open('https://www.youtube.com/results?search_query=');
    return false;
});
//# sourceMappingURL=app.js.map