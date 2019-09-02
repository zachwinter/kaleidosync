export function createXMLHttpRequest (type, url, async, headers) {
  const request = new XMLHttpRequest
  request.open(type, url, async)
  for (var header in headers) {
    request.setRequestHeader(header, headers[header])
  }
  return request
}

export function createResponse (request) {
  return {
    request,
    status: request.status,
    data: (function () {
      try {
        const json = JSON.parse(request.responseText)
        return json
      } catch (e) {
        return request.responseText
      }
    })()
  }
}

export function get (url, {
  async = true,
  headers = {}
} = {}) {
  return new Promise((resolve, reject) => {
    const request = createXMLHttpRequest('GET', url, async, headers)

    const error = () => {
      const response = createResponse(request)
      response.success = false
      response.error = request.responseText
      reject(response)
    }

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const response = createResponse(request)
        response.success = true
        resolve(response)
      }

      if (request.status >= 400) error(request)
    }

    request.onerror = () => error(request)

    request.send()
  })
}