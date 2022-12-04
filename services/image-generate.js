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
    // const configuration = new Configuration({
    //   apiKey: api_key,
    // });
    // const openai = new OpenAIApi(configuration);
    // const response = await openai.createImageVariation(
    //   fs.createReadStream(url),
    //   3
    // );
    //   try {
    //     const response = await openai.createImageVariation({
    //       image: url,
    //       n: 3,
    //     });
    //     console.log(response);
    //     return {
    //       images: response.data,
    //     };
    //   } catch (err) {
    //     return {
    //       error: true,
    //       error_message: err,
    //     };
    //   }

    const path = Path.resolve(
      __dirname,
      "images",
      `${Crypto.randomBytes(32).toString("hex")}.png`
    );

    this.downloadImage(
      "https://oaidalleapiprodscus.blob.core.windows.net/private/org-uEDvbcGG5dtIkyReNQqG2ckh/user-hDvCrfaWvhXPKCcfkEtAY68y/img-MIBDHEGYTQDl6hFZ2gvQZurK.png?st=2022-12-04T17%3A53%3A49Z&se=2022-12-04T19%3A53%3A49Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-12-04T15%3A38%3A34Z&ske=2022-12-05T15%3A38%3A34Z&sks=b&skv=2021-08-06&sig=z2W0Wm0M7eAGApwuTF%2B9n7e6HZN2kxLTMaErh75Oh20%3D",
      path
    )
      .then((response) => {
        console.log(response);
      })
      .catch(console.error);
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
