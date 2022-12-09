import DB from "../services/database-service";

const fetch = {
  async leaderboard(req, res) {
    const data = await DB.fetchData("leaderboard");
    res.send(data);
  },
  async users(req, res) {
    const data = await DB.fetchData("users");
    res.send(data);
  },
  async polling(req, res) {
    const data = await DB.fetchData("polling");
    let filteredData = [];

    data.map((item) => {
      if (!("imageURL" in item)) {
        return res.send({
          message: "Polling Hasn't Started Yet",
          isPollingStarted: false,
        });
      }

      const { id, team_name, imageURL } = item;

      filteredData = [...filteredData, { id, team_name, imageURL }];
    });

    let time = [
      parseInt(data[0].createdTime),
      parseInt(data[1].createdTime),
    ].sort();
    const endTime = time[1] + 90 * 1000;
    const currTime = Date.now();

    if (currTime < endTime) {
      return res.send({
        team: filteredData,
        time: Math.round((endTime - currTime) / 1000),
        isPollingStarted: true,
      });
    } else {
      return res.send({
        message: "Polling Ended",
        isPollingStarted: false,
      });
    }
  },
  async upVote(req, res) {
    const { id } = req.body;

    const data = await DB.fetchData("polling");
    data.map((item) => {
      if (item.id == id) {
        DB.updateData("polling", id, { votes: parseInt(item.votes) + 10 });
        return res.send({
          message: `Successfully Upvoted ${item.team_name}`,
        });
      }
    });
  },
  async registerUser(req, res) {
    const { name, team_name } = req.body;
    await DB.addData("users", { name: name, team_name: team_name });
    res.send({
      Success: true,
    });
  },
};

export default fetch;
