import Joi from "joi";
import ImageGenerate from "../services/image-generate";
import DB from "../services/database-service";
import { isEmpty } from "@firebase/util";
import crypto from "crypto";

const Authentication = {
  async login(req, res) {
    // Validate Request JSON
    const loginSchema = Joi.object({
      name: Joi.string().required(),
      team_name: Joi.string().required(),
      security_code: Joi.string().required(),
      api_key: Joi.string().required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.json({
        error: error.message,
      });
    }

    const { team_name, security_code, api_key } = req.body;

    // Validate API KEY
    const isValid = await ImageGenerate.generateImage(
      "test",
      1,
      "1024x1024",
      api_key
    );

    if (isValid.error) {
      return res.status(401).json({
        message: isValid.error_message,
      });
    }

    // Verify Security Code

    const users = await DB.fetchData("users");
    let id = -1;
    let error_message = {};

    users.map((user) => {
      if (user.team === team_name) {
        if (security_code === user.security_code) {
          id = user.id;
          error_message = {
            error: false,
          };
        }
      }
    });

    if (isEmpty(error_message)) {
      return res.send({
        message: "Team Does Not Exist!",
      });
    }

    // Update the Security Code

    DB.updateData("users", id, {
      security_code: `${crypto.randomInt(100000, 999999)}`,
    });

    try {
      res.json({
        message: "Successfully Logged in.",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error." });
    }
  },
};

export default Authentication;
