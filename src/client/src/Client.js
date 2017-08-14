/* eslint-disable no-undef */
//^allows params to be undefined?
function getStuff(url, cb) {
  return fetch(url, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb)
    .then(logData);
}

function postStuff(url, data, cb){
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(checkStatus)
    .then(parseJSON)
    .then(logData)
    .then(cb);
}

function putStuff(url, data, cb){
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb)
    .then(logData)
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

const Client = { getStuff, postStuff, putStuff};
export default Client;