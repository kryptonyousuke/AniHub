
<h1 align="center">
<img src="build-icon/icons/png/512x512.png" style="
width: 100px;
margin-inline: auto;
position: absolute;
top: -110px;
left: calc(50% - 50px);
">
<p style="margin-top: 120px;">AniHub (Alpha)</p>

<p style="font-size: 1.2rem;">Your favorite streaming app.</p>
</h1>

![last](https://img.shields.io/github/last-commit/kryptonyousuke/Anihub?style=for-the-badge&color=red) ![GitHub contributors](https://img.shields.io/github/contributors/kryptonyousuke/AniHub?style=for-the-badge&labelColor=941fd3&color=white) ![GitHub Created At](https://img.shields.io/github/created-at/kryptonyousuke/AniHub?style=for-the-badge&labelColor=1fd37f&color=grey)


## **Anihub** is a open-source streaming app that allows you to watch/read your favorite anime and manga online by using plugins. 

Anyone can make a plugin for this application and distribute it to the community. Plugins may optionally provide ads alongside content for monetization. This app is intended to be a way to unify the anime and manga streaming experience into a single platform, enhancing the user experience and providing a more seamless way to access their favorite content.

## Plugin System (WIP)

AniHub does not provide any content by default.

All anime and manga sources are delivered through external plugins.
Currently supported:
- Python plugins (executed as external processes)

Planned:
- JavaScript / TypeScript plugins
- Native binaries
- > ⚠️ Plugins are responsible for content sources, legality and ads delivery.
> AniHub does not host or distribute any media content.



## Features

- **Anime Streaming**: Does support modern streaming protocols, such as HLS and DASH + simple video files.
- **Manga Reader**: We have a simple manga reader (still under development, but it works).
- **Plugin Support**: currently supports only python plugins (under devolpment, but works). Future versions will support JS/TS and compiled binaries.


# How to build

## Install the pnpm package.

On linux distros that have apt:
```bash
    sudo apt install pnpm -y
```
For Arch based distros:
```bash
    sudo pacman -S pnpm --noconfirm
```
You can install pnpm on windows following the instructions from the oficial website [here.](https://pnpm.io/installation)

## Build the project
Clone this repository:
```bash
    git clone https://github.com/kryptonyousuke/AniHub
    cd AniHub
```

And run:
```bash
    pnpm install # install the projects dependencies
    pnpm run build # builds the project
```

This will make the correct build for your system.
If you want to build for an specific system:
```bash
    # Windows build (portable & installer): 
    pnpm run build --win
    
    # Linux build (AppImage, deb, pacman, .tar.gz, .tar.xz, rpm, flatpak):
    pnpm run build --linux
    
    # Specific format:
    pnpm run build --linux flatpak
```


# Testing
If you don't want to compile the entire project, you can just test it in a electron instance by running:
```bash
    pnpm run dev
```

# For developers

## Architecture Overview

AniHub is composed of three main layers:

- **Renderer (React + Vite)**  
  Responsible for UI, navigation, video playback and manga reader.

- **Electron (Main + Preload)**  
  Handles native APIs, filesystem access and plugin execution.

- **Plugins (External)**  
  Providers written in Python (currently) that fetch metadata and streaming sources.

## Roadmap (Alpha)

- [x] HLS / DASH playback
- [x] Manga reader (basic)
- [x] Python plugin execution
- [ ] Plugin API documentation
- [ ] JS/TS plugins
- [ ] Better error handling
- [ ] UI polish
