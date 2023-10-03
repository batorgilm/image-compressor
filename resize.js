const fs = require("fs");
const sharp = require("sharp");
const sizeOf = require("image-size");

const testFolder = "./temp/";

async function resize() {
  fs.readdirSync(testFolder).forEach(async (file) => {
    if (file.split(".")[1] === "jpg") {
      try {
        const dim = sizeOf(`./temp/${file}`);

        const desiredWidth = Math.ceil(dim.width / 5);
        const desiredHeight = Math.ceil(dim.height / 6);

        await sharp(`./temp/${file}`, { limitInputPixels: false })
          .resize(desiredWidth, desiredHeight, { position: "top" })
          .webp({ quality: 80 })
          .toFile(`./output/${file}.jpg`);

        fs.rmSync(`./temp/${file}`, {
          force: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
}
resize();
