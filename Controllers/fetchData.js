import DB from "../services/database-service";
const fetch = {
  async leaderboard(req, res) {
    const data = await DB.fetchData("leaderboard");
    res.send(data);
  },
};

export default fetch;
