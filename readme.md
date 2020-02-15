# customstart.page

... is where you start your browsing experience. Use an existing start page and customise it to your needs.

## Screenshots

### Homepage

![Homepage](/.github/assets/2020-01-12/index.jpg)

### Edit page

![Edit](/.github/assets/2020-01-12/edit.png)

## Domain ideas

- customstart.page

- st.art
- customst.art

- customstartpage.*
- start.ninja (15EUR)
- startpage.club (16EUR)
- quickstart.*
- launchpad.*
- springboard.*

## Inspiration

- https://startpages.github.io/

## Competition

### Customisable start pages

- https://start.me/
- http://start.io/
- https://mystartpage.net/
- https://www.mystart.com/

### Just a search

- Built in browser start page
- https://www.google.co.uk/
- https://www.startpage.com/

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
