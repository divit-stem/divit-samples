const axios = require("axios");

const genOrderID = () => {
  let result = "";
  const characters = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 5) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return String(new Date().getTime()) + result;
};

const restClient = async (apiKey, host, path, p) => {
  try {
    let instance = axios.create({
      baseURL: host,
      timeout: 10000,
      headers: {
        "Api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
    const response = await instance.post(path, p);

    let data = response?.data;

    console.log("body:", data.data);

    return data?.data;
  } catch (error) {
    console.error("Error:", error.response?.data);
    throw error; // Re-throw for proper error handling in calling code
  }
};

module.exports = {
  genOrderID,
  restClient,
};
