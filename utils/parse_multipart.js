// Minimal multipart/form-data parser for Lambda proxied requests.
// Not a full replacement for robust libraries but suitable for small files in dev.

function getHeaderParam(headerValue, paramName) {
  const re = new RegExp(paramName + "=\\\"?([^\\\";]+)\\\"?");
  const m = headerValue.match(re);
  return m ? m[1] : null;
}

function parseMultipart(event) {
  const headers = {};
  // normalize headers
  Object.keys(event.headers || {}).forEach(k => headers[k.toLowerCase()] = event.headers[k]);
  const contentType = headers['content-type'] || headers['Content-Type'] || '';
  const boundaryMatch = contentType.match(/boundary=(.*)$/);
  if (!boundaryMatch) throw new Error('No multipart boundary found');
  const boundary = boundaryMatch[1];

  const bodyBuffer = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : Buffer.from(event.body || '', 'binary');
  // use latin1 to preserve raw bytes when converting to string
  const body = bodyBuffer.toString('latin1');
  const parts = body.split('--' + boundary);

  const files = [];
  const fields = {};

  for (let i = 1; i < parts.length - 1; i++) {
    let part = parts[i];
    // remove leading CRLF
    if (part.startsWith('\r\n')) part = part.slice(2);
    // split headers and content
    const idx = part.indexOf('\r\n\r\n');
    if (idx === -1) continue;
    const rawHeaders = part.slice(0, idx).split('\r\n');
    let content = part.slice(idx + 4, part.length - 2); // remove trailing CRLF

    const partHeaders = {};
    rawHeaders.forEach(h => {
      const sep = h.indexOf(':');
      if (sep !== -1) {
        const hk = h.slice(0, sep).trim().toLowerCase();
        const hv = h.slice(sep + 1).trim();
        partHeaders[hk] = hv;
      }
    });

    const disposition = partHeaders['content-disposition'];
    if (!disposition) continue;
    const name = getHeaderParam(disposition, 'name');
    const filename = getHeaderParam(disposition, 'filename');

    if (filename) {
      const contentTypeHeader = partHeaders['content-type'] || 'application/octet-stream';
      // content is latin1 string representing binary data; convert to Buffer
      const fileBuffer = Buffer.from(content, 'latin1');
      files.push({ name, filename, content: fileBuffer, contentType: contentTypeHeader });
    } else {
      // field
      fields[name] = content;
    }
  }

  return { fields, files };
}

module.exports = { parseMultipart };
