import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import Path from "path";
import https from "https";
import Crypto from "crypto";

const ImageGenerate = {
  async generateImage(prompt, amount, size, api_key) {
    const configuration = new Configuration({
      apiKey: api_key,
    });

    const openai = new OpenAIApi(configuration);

    try {
      const response = await openai.createImage({
        prompt: prompt,
        n: amount,
        size: size,
      });
      return {
        images: response.data,
      };
    } catch (err) {
      return {
        error: true,
        error_message: err.response.data.error.code,
      };
    }
  },
  async generateVariation(url, api_key) {
    const configuration = new Configuration({
      apiKey: api_key,
    });

    const openai = new OpenAIApi(configuration);

    const path = Path.resolve(
      __dirname,
      "images",
      `${Crypto.randomBytes(32).toString("hex")}.png`
    );

    const imagePath = await this.downloadImage(url, path).catch(console.error);
    if (imagePath === undefined) {
      return {
        message: "Invalid URL",
      };
    }
    try {
      const response = await openai.createImageVariation(
        fs.createReadStream(imagePath),
        3
      );

      fs.unlinkSync(imagePath);

      return {
        data: response.data,
      };
    } catch (err) {
      console.log(err.data);
    }
  },

  async downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          res
            .pipe(fs.createWriteStream(filepath))
            .on("error", reject)
            .once("close", () => resolve(filepath));
        } else {
          // Consume response data to free up memory
          res.resume();
          reject(
            new Error(`Request Failed With a Status Code: ${res.statusCode}`)
          );
        }
      });
    });
  },
};

export default ImageGenerate;
