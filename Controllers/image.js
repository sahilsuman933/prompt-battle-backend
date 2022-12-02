import Joi from "joi";
import ImageGenerate from "../services/image-generate";

const image = {
  async generateImage(req, res) {
    const imageSchema = Joi.object({
      api_key: Joi.string().required(),
      prompt: Joi.string().required(),
      amount: Joi.number().required(),
      size: Joi.string().required(),
    });

    const { error } = imageSchema.validate(req.body);

    if (error) {
      return res.json({
        error: error.message,
      });
    }

    const { api_key, prompt, amount, size } = req.body;

    const images = await ImageGenerate.generateImage(
      prompt,
      amount,
      size,
      api_key
    );

    res.json(images);
  },
};

export default image;
