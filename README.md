# Plata: Serving up prices, wherever you are 

<p align="center">
    <img src="./src/icons/Hero.webp" alt="Hero Title" width="256" height="256">
</p>


Plata is a browser extension for quickly checking [Warframe Market](https://warframe.market) prices whilst navigating wikis, with more online spaces planned.   

> [!IMPORTANT]
> This extension is in no way affiliated, endorsed by, or created by Digital Extremes or Warframe Market. Made purely for the learning experience.
> 
> My own personal use cases were the only ones taken into consideration. This project is not currently suitable for general use.


## Installation 

Plata is not currently published on either the **CWS** or **AMO**, as such "installing" requires manual building. Github releases will also be created and setup soon.

### Build 
Plata uses [Nix](https://www.nixos.org) to build and package itself. 

```bash
nix build
```

<details>
<summary>Non-Nix</summary>

As the only "build" step involved with **Plata** is the creation of the icon images, building without nix is straightforward.

From the `root` directory running these commands will result in the same output just under a different location (`web-ext-artifacts`).
**Requirements:** `inkscape` `web-ext`

1. 
    ```bash
    for size in 32 48 96 128; do 
        inkscape --export-type=png --export-width=$size --export-filename=src/icons/plata-$size.png src/icons/Plata.svg 
    done
    ```

2. `web-ext build `

</details>


> [!WARNING] 
> Non-Permanent Installation - The following steps are for a temporary installation. This means once a new session is started, the extension will need to be reinstalled.

### Firefox 
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select the output `.zip` found under the nix `result`

### Chromium 
1. Unpack the resulting `.zip` to a location of your preference 
2. Go to `chrome://extensions` (or your browser's equivalent if you're not redirected)
3. Toggle **Developer mode** on, in the top right 
4. Click **Load unpacked** and select the folder from step 1 extraction.




## Development 
Even though there are practically no dependencies for this extension a Nix devshell is still provided, containing Mozilla's `web-ext` tool.

## TODO 
- [ ] Better build and release system 
- [ ] Additional Auto-scrape targets  


### UI / UX 
- [ ] Styles
- [ ] Outbound Links 
- [ ] Order staleness 


## Resources
- [warframe.market API Docs](https://docs.warframe.market/docs/intro)
