import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
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

    const request = require("request");

    const download = function (url, filename, callback) {
      request.head(url, function (err, res, body) {
        console.log("content-type:", res.headers["content-type"]);
        console.log("content-length:", res.headers["content-length"]);

        request(url).pipe(fs.createWriteStream(filename)).on("close", callback);
      });
    };

    console.log(download(url, "test"));

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
  },
};

export default ImageGenerate;
