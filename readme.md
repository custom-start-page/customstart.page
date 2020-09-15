# https://customstart.page

> Choose a start page and start customising! These start pages were provided by the community and can be personalised to fit you best.

## Screenshots

### Homepage

![Homepage](/.github/assets/2020-01-12/index.jpg)

### Edit page

![Edit](/.github/assets/2020-01-12/edit.png)

## About

This project aims to solve a problem - **how can start pages be hosted and configured in a unified and friendly way?**

Many people provide source code to their custom start pages but don't provide hosting or an intuitive way to customise the start page. Custom Start Page aims to solve that.

I built this project in my spare time and hope to continue supporting it, but updates are likely to be rare.

## Features

- a gallery of available start pages
- hosting of start pages
- using a form, customise the start page to your needs, things such as:
    - links
    - the background image
    - your name
    - the rss feed

## Technology used

- NodeJS
- [React JSON Schema Form](https://github.com/rjsf-team/react-jsonschema-form)

## Getting started

You can check the `./Dockerfile` for better information about running this application.

1. Configure your hosts file to look something like this:
    ```
    127.0.0.1 customstart.local
    127.0.0.1 minimum-viable-startpage.customstart.local
    ```
- Edit the `server/config.json` file to have the domain name you chose in the hosts file
- Run `npm start` in the base directory
- Navigate to the domain you chose in the hosts file

## Releasing/building

Read [build.md](build.md).

## Issues

### Embedding the startpage with control from the outside

I want to be able to control certain parts of the startpage so I can:

- control page meta information (title and meta description)
- insert HTML messages for the user
- track pageviews
- allow editing from the startpage view?

Solutions:

#### Embed as iframe

- when the location of the iframe changes, the parent doesn't and causes XSS issues (can be sort of solved with https://stackoverflow.com/questions/24428476/target-blank-in-all-link/24428525#24428525 but this only helps with anchors and not JS location changes)

#### Embed as custom element

- HTML and JS works but can't seem to get CSS to work

#### Embed normally but with custom JS

- requires startpage to include my JS (or maybe I can dynamically insert?)
- CSS could collide with mine
