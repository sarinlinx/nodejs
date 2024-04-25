const http = require('http');
const fs = require('fs');
// const { default: BodyReadable } = require('undici-types/readable');

const server = http.createServer((req, res) => {

  // Store the URL in a const
  const url = req.url;
  // Store method in a const
  const method = req.method;

  // Check if the URL is ONLY a slash
  // if so, create a form
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    // Add a return statement in front of res end.
    // This is required to exit from this 'server' Anonymous FUNCTION.
    // It quits this FUNCTION and ends execution of the rest of the code below, preventing the text "Hello from my NOde.js Server!"
    return res.end();
  }


  // If URL is /message
  if (url === '/message' && method === 'POST') {

    // Create a const to work with the data
    // This is an empty Array
    const body = [];
    // Listent to the data event. This event is fired whenever a new chunk is ready to be read.
    // The 2nd arg is the function that should be executed for every data event
    // Use the param chunk to work with the data
    req.on('data', (chunk) => {
      // Push a new element into the 'body' Array
      console.log(chunk);
      body.push(chunk);
    });

    // Add the 'end' Event Listener. This is fired after the incoming data is complete.
    // The 2nd arg is the function that should be executed
    // Add return before so it gets executed before the HTML section
    return req.on('end', () => {
      // Buffer the chunks to work with them. This adds all chunks into 'body'.
      // Use the Global Buffer Object 
      // Finally use toString() to convert it to text
      const parseBody = Buffer.concat(body).toString();
      console.log(parseBody);

      // Create const to take parsedBody and split it on the equals sign
      // Then take the element with the index of 1 (which is the value on the right of the equals sign)
      const message = parseBody.split('=')[1];
      // Move this line from below so it executes within this function
      // write a new file. 2 args: TITLE, CONTENT
      // Add 'message' to store the value the was typed into the form

      // writeFile contains 3 params
      // The 3rd argument is a callback function that's executed when this is complete
      // This err function is used if an error occurs. You can then choose how to handle the error
      fs.writeFile('message.txt', message, err => {
        // How to handle an error
        // This response is only sent when you're done working with the file
        // In this case the old statusCode and setHeader references are moved into this section, an error handler is not used
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  // Tell NodeJS we're finished creating the response. The response cannot be changed after this
  res.end();
});

server.listen(3000);