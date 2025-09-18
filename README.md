# hentai-cosplays.com_batch_downloader

## Purpose
This script allows batch download from [hentai-cosplays.com](https://hentai-cosplays.com/) and [hentai-img.com](https://hentai-img.com/), requires an userscript executor, such as [tampermonkey](https://www.tampermonkey.net/) or [greasemonkey](https://www.greasespot.net/)

## Use
When opening a set adds a button with the label `Download full set` under the set title

## Installation
You can install this script by using [this](https://github.com/teo3300/hentai-cosplays.com_batch_downloader/raw/main/hentai-cosplays.com_batch_downloader.user.js)

Requires an userscript executor

## Troubleshooting
- **The button does not appear under the title set**: make sure that the script has permissions to run for the specified domain (from the userscript executor extension)

Also make sure that you opened a link without the `/attachment/<number>` suffix, to fix this remove the last part of the URL
  
  ```https://hentai-cosplays.com/image/*/attachment/<number>```
  
  vvv
  
  ```https://hentai-cosplays.com/image/*```
  
This is necessary since the first page does not contain information about other pages' images
  
- **How do I know that the program is working?**: pres `F12` (or open your brower inspector) to check if the script is working: the script outputs on the browser console (I'm lazy, didn't want to implement an HTML interface)

## The script does async archive generation and download
The script fetches all the images and save 'em as a `.zip` file, the file appears on the download tab onche the fetch is fully completed (and thus the images have already beend downloaded)
