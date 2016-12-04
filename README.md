# x0x0x (server)

## federated link sharing

* no likes/faves/stars
* no public identity
* just links from servers

## installation

For local development:

    npm install
    npm start

For a local server accessible by others, set up a tunneling service like [ngrok](https://ngrok.com) and have it listen to the port you're using above (default is port 8080).

For production:

Same as above, but `npm start` would be replaced with however you choose to host your public-facing site on your server.

## client access

Fork a copy of [the sample client](https://github.com/ednapiranha/x0x0x-client) and then subscribe to the public URL set for the server.

When you share links, you are sharing it to all subscribers of that network. Duplicate links will be consolidated in your feed.

If you see a link you want to keep around for local access, you can save it and it will not share this information to the server(s). Instead, it will store it in your browser's local storage for offline access whenever you want.
