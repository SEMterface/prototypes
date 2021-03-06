# getUserMedia

## What is this?

A tiny browser module that gives us a simple API for getting access to a user's camera or microphone by wrapping the `navigator.getUserMedia` API in modern browsers.

This is important because as of right now, all browsers return errors differently. More on that below.

This lib also gracefully handles the lack of support in a browser. So you never have to check first (see error handling below).

It gives us a cleaner node.js-style, error-first API and cross-browser handling. No browser support checking necessary, lack of support is treated in the same way as when the user rejects the request: the callback gets passed an error as the first argument.

Suitable for use with browserify/CommonJS on the client. 

If you're not using browserify or you want AMD support use `getusermedia.bundle.js`. Note that if no module system is detected it simply attaches a function called `getUserMedia` to `window`.



## Installing

```
npm install getusermedia
```

## How to use it


With this helper it's clean/simple to get access to a user's camera, mic, etc.

```js
var getUserMedia = require('getusermedia');

getUserMedia(function (err, stream) {
    // if the browser doesn't support user media
    // or the user says "no" the error gets passed
    // as the first argument.
    if (err) {
       console.log('failed');
    } else {
       console.log('got a stream', stream);  
    }
});
```

Passing in options is optional. It defaults to `{video: true, audio: true}`;

```js
// optionally pass constraints as the first argument
// they just passed through.
getUserMedia({video: true, audio: false}, function (err, stream) { ... });
```


## Why? Because it's super ugly without this tool

```js
// first deal with browser prefixes
var getUserMedia = navigator.getUserMedia || 
    navigator.mozGetUserMedia || 
    navigator.webkitGetUserMedia;

// make sure it's supported and bind to navigator
if (getUserMedia) {
    getUserMedia = getUserMedia.bind(navigator);
} else {
    // have to figure out how to handle the error somehow
}

// then deal with a weird, positional error handling API
getUserMedia(
    // media constraints
    {video: true, audio: true}, 
    // success callback
    function (stream) {
        // gets stream if successful
    }, 
    // error callback
    function (error) {
        // called if failed to get media
    }
)
```


## Handling errors (summary)

All failed calls to `getusermedia` in this library will return an error object (of type `NavigatorUserMediaError`) as the first argument to the callback. All will have a `.name` attribute of one of the following strings.

- `"NOT_SUPPORTED"` (for cases where a browser doesn't support `getUserMedia`.)
- `"PERMISSION_DENIED"`
- `"CONSTRAINT_NOT_SATISFIED"`


## More about errors

As of this writing all browsers handle errors differently. Firefox calls the error callback with a string, Chrome with an error object. 

Neither follow [the spec](http://dev.w3.org/2011/webrtc/editor/getusermedia.html#navigatorusermediaerror-and-navigatorusermediaerrorcallback) which says it should be an error object with an appropriate `.name` attribute.

According to the spec all errors should be an error object of type `NavigatorUserMediaError`. With a `.name` attribute of either: 

- `"PERMISSION_DENIED"`
- `"CONSTRAINT_NOT_SATISFIED"`

Also, it sucks to have to test for capability before calling getUserMedia. This lib solves that too. So you still get an appropriate error object back with a `.name` of `"NOT_SUPPORTED_ERROR"` which is the same as what the spec says to do if a constraint is requested but not supported. For example requesting video/audio when you only have a microphone in a browser that still supports `getUserMedia`. 

In this library we add one more:

- `"NOT_SUPPORTED"` for cases where a browser doesn't support `getUserMedia`.


## License

MIT

## Created By

If you like this, follow: [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

