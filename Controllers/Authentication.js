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

    let status = ["is-invalid", "is-invalid", "", "is-invalid"];
    const { name, team_name, security_code, api_key } = req.body;
    let isDataCorrect = true;
    // Verify Security Code

    const users = await DB.fetchData("users");
    let id = -1;
    let error_message = {};

    users.map((user) => {
      if (user.name === name) {
        status[0] = "is-valid";
      }

      if (user.team === team_name) {
        status[1] = "is-valid";
      }

      if (user.team === team_name) {
        if (user.security_code === security_code) {
          id = user.id;
          status[3] = "is-valid";
        }
      }
    });

    if (status[1] === "is-invalid") {
      error_message = {
        message: "Team does not exist. Please register",
      };
    }

    if (status[1] === "is-valid" && status[3] === "is-invalid") {
      error_message = {
        message: "Security Code is incorrect.",
      };
    }

    // Validate API KEY
    const isValid = await ImageGenerate.generateImage(
      "test image",
      1,
      "1024x1024",
      api_key
    );

    if (isValid.error) {
      status[2] = "is-invalid";
    } else {
      status[2] = "is-valid";
    }

    status.map((data) => {
      if (data === "is-invalid") {
        isDataCorrect = false;
      }
    });

    if (!isDataCorrect) {
      res.json({
        validArray: status,
        isLoggedIn: false,
        message: "Login Failed",
      });
    }

    // Update the Security Code

    DB.updateData("users", id, {
      security_code: `${crypto.randomInt(100000, 999999)}`,
    });

    try {
      res.json({
        validArray: status,
        isLoggedIn: true,
        message: "Login Successful",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error." });
    }
  },
};

export default Authentication;
