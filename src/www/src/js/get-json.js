/** 
 * Fetch JSON file w/ AJAX.
 * 
 * @param {string} url
 * @param {function} callback
 */
export default function GetJSON(url, callback, data) {
  let request = new XMLHttpRequest();

  request.open('GET', url, true);
  
  if (data && data.headers) {
    for(let header in data.headers) {
      request.setRequestHeader(header, data.headers[header])
    }
  }

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      if (request.responseText.length === 0) {
        callback('Blank response.');
        return;
      }

      callback(JSON.parse(request.responseText))
    } else {
      callback('Server error.');
    }
  };

  request.onerror = function() {
    callback('Connection error.');
  };

  request.send();
}