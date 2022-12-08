import ImageGenerate from "../services/image-generate";
import ImageBase64Convert from "image-data-uri";
import DB from "../services/database-service";

const image = {
  async generateImage(req, res) {
    const { prompt } = req.body;
    const image = await ImageGenerate.generateImage(prompt);

    res.send(image);
  },
  async submission(req, res) {
    const { id, img } = req.body;
    await ImageBase64Convert.encodeFromURL(img)
      .then(async (response) => {
        const data = await DB.uploadImage(response);
        DB.updateData("polling", id, {
          imageURL: data.imageURL,
          createdTime: new Date().getTime(),
          votes: 0,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    res.send({
      message: "Image Successfully Uploaded.",
    });
  },
};

export default image;
