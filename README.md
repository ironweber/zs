# ZS 
A timer to alert you to stand up so you aren't sittig all day.

# Getting Started

## Requirements
node version `>= 18 && <= 19`

```shell
git clone https://github.com/ironweber/zs
npm install
npm start
```

# Known Issues
- Building and packaging is broken right now because I'm using node-canvas to render the menu bar.
- For some reason if you run `rs` to restart the Electron main process it starts a new one without killing the previous.
- No Windows support. I haven't tested it so it may or may not work.


