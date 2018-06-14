let { remote, ipcRenderer } = require('electron');
let url = (remote.getCurrentWindow() as any).YoutubeURL;
let iframe: HTMLIFrameElement = document.getElementById('target') as HTMLIFrameElement;
let last_id: string;
let youtubeWindow: Window;
iframe.src = 'default.html';
ipcRenderer.on('asynchronous-reply', function (event, arg: string) {
    if (arg.startsWith('https://youtu.be/')) {
        let id = arg.replace('https://youtu.be/', '');
        if (iframe && last_id != id) {
            if(youtubeWindow) youtubeWindow.close();
            last_id = id;
            iframe.src = `https://www.youtube.com/embed/${id}`;

        }
    }
});
setInterval(() => {
    ipcRenderer.send('asynchronous-message', 'get-clipboard');
}, 1000)
window.addEventListener('contextmenu',(e)=>{
    youtubeWindow = window.open('https://www.youtube.com/results?search_query=');
    return false;
})