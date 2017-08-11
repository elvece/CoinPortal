/* eslint-disable no-undef */
//^allows params to be undefined?
function search(query, cb) {
  return fetch(`sanity-check`, {
    accept: "application/json"
  })
    .then(checkStatus)
    .then(parseJSON)
    // .then(cb);
    .then(logData);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function logData(response){
  console.log(response);
}

const Client = { search };
export default Client;