import { Configuration, OpenAIApi } from "openai";

const ImageGenerate = {
  async generateImage(prompt, amount, size, api_key) {
    const configuration = new Configuration({
      organization: "org-uEDvbcGG5dtIkyReNQqG2ckh",
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
};

export default ImageGenerate;
