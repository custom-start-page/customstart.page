# Building

Use drone.io to build.

## Building locally

You'll need to install the Drone CLI:

https://docs.drone.io/cli/install/

Then run this simple cmd in this repo root:

```
$ drone exec
[build:0] + npm install
[build:1] npm WARN react-tabs@3.1.0 requires a peer of react@^16.3.0 but none is installed. You must install peer dependencies yourself.
[build:2] npm WARN start@0.0.1 No license field.
...
```

This should create a `./dist/` folder which can be released.

Note that you'll need to run `npm install --only=prod`.

And you'll need to copy the required page files from `./pages/`.
