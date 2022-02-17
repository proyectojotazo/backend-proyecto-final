function getUserFromJwt(token) {
  if (token === null) return null;

  const base64Parts = token.split(".");
  if (base64Parts.length !== 3) return null;

  const base64Data = base64Parts[1];
  try {
    // atob() decodes a data string that has been encoded using base - 64 encoding
    const userJSON = Buffer.from(base64Data, "base64").toString("utf-8");
    const user = JSON.parse(userJSON);
    return user._id;
    // return JSON.parse(userJSON);
  } catch (error) {
    console.error("The token could not be decoded", error);
    return null;
  }
}

module.exports = getUserFromJwt;
