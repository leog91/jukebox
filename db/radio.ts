export type Radio = {
    name: string;
    src: string[];
    // src: `https${string}`[];
};



//add flags svg/icon
export const radioList: Radio[] = [
    {
        name: "Balearica Music Selections",
        src: ["https://control.streaming-pro.com:8040/live.mp3"],
    },
    {
        name: "RT2 FM - 🇮🇪",
        src: ["https://www.liveradio.es/http://icecast.rte.ie/ie2fm"],
    },
    {
        name: "HAURAKI - 🇳🇿",
        src: ["https://ais-nzme.streamguys1.com/nz_009_aac"],
    },
    {
        name: "Antenne 80s - 🇩🇪",
        src: ["http://s6-webradio.antenne.de/80er-kulthits"],
    },
    {
        name: "The Rock - 🇳🇿",
        src: ["https://tunein-icecast.mediaworks.nz/rock_128kbps"],
    },

    {
        name: "CADENA 3 FM - 🇦🇷",
        src: ["https://26373.live.streamtheworld.com/CADENA3.mp3"],
    },
    {
        name: "Radio NOVA 100 FM - 🇮🇪",
        src: ["https://stream.audioxi.com/NOVA"],
    },

    {
        name: "VERONICA - 🇳🇱",
        src: ["https://22543.live.streamtheworld.com/VERONICA.mp3"],
    },
    {
        name: "The Breeze Auckland - 🇳🇿",
        src: ["http://tunein-icecast.mediaworks.nz/breeze_128kbps"],
    },
];
