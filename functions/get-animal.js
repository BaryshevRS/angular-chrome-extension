const fetch = require("node-fetch");

module.exports.handler = async function (
  {httpMethod}, content
) {
  const { animal } = content["_data"].multiValueQueryStringParameters;
  const apiKey = process.env.API_KEY;

  let responseBody = '';

  try {
    let response;
    if (animal && (animal[0] === 'cat')) {
      response = await fetch(
        `https://api.thecatapi.com/v1/images/search?size=`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `x-api-key ${apiKey}`
          }
        }
      );

      const body = await response.json();
      responseBody = body[0].url;
    } else {
      response = await fetch(
        `https://dog.ceo/api/breeds/image/random`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
      );
      const body = await response.json();
      responseBody = body.message;
    }
  } catch (e) {
  }

  return {
    'headers': {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, origin',
      'Content-Type': 'application/json;charset=utf-8',
    },
    statusCode: 200,
    body: responseBody
  }
}
