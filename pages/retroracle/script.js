//code from w3schools

//Make the DIV element draggagle:
dragElement(document.getElementById(("wrap")));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function setup(data) {
	const windowInner = document.querySelector(".cont-2");

	function createInfoBox(linkGroup) {
		const infoBox = document.createElement("div");
		infoBox.classList.add("info-box");

		const h3 = document.createElement("h3");

		const title = document.createElement("span");
        title.classList.add("title");
        title.innerHTML = '&#91;' + linkGroup.name + '&#93;';

        h3.appendChild(title);

		const content = document.createElement('div');
		content.classList.add('cont4');

		for (let link of linkGroup.links) {
			const anchor = document.createElement('a');
			anchor.setAttribute('href', link.url);

			anchor.innerHTML = '&nbsp;' + link.name;

            content.appendChild(anchor);
            content.append(' ');
		}

		infoBox.appendChild(h3);
		infoBox.appendChild(content)

		return infoBox;
	}

	for (let linkGroup of data.linkGroups) {
		const infoBox = createInfoBox(linkGroup);

		windowInner.appendChild(infoBox);
    }

    // Background
    {
        const body = document.querySelector("body");
        body.style.backgroundImage = `url('${data.backgroundUrl}')`;
    }

    // Image window
    {
        const imageWindow = document.querySelector('.image-window');

        // Image
        {
            const img = document.createElement('img');
            img.width = 260;
            img.src = data.imageWindowImageUrl;

            imageWindow.prepend(img);
        }

        // User information
        {
            for (let item of data.userInformation) {
                const h3 = document.createElement('h3');

                const prompt = document.createElement('span');
                prompt.classList.add('prompt');
                prompt.innerHTML = item.key;

                const value = document.createElement('span');
                if (item.key === 'User') {
                    value.classList.add('user');
                }
                value.innerHTML = item.value;

                h3.appendChild(prompt);
                h3.append(' ');
                h3.appendChild(value);

                imageWindow.appendChild(document.createElement('hr'));
                imageWindow.appendChild(h3);
            }
        }
    }
}

var data =
{
 "linkGroups": [
  {
   "name": "social",
   "links": [
    {
     "name": "discord",
     "url": "https://discordapp.com/"
    },
    {
     "url": "https://arisuchan.jp/",
     "name": "arisuchan"
    },
    {
     "name": "lainchan",
     "url": "https://lainchan.org/"
    },
    {
     "name": "twitter",
     "url": "https://twitter.com/"
    }
   ]
  },
  {
   "name": "entertainment",
   "links": [
    {
     "url": "https://www.youtube.com",
     "name": "youtube"
    },
    {
     "url": "https://www.twitch.tv",
     "name": "twitch"
    },
    {
     "url": "https://www.plex.com",
     "name": "plex"
    },
    {
     "url": "https://www.netflix.com",
     "name": "netflix"
    },
    {
     "url": "https://www.nreboot.com/",
     "name": "nreboot"
    }
   ]
  },
  {
   "name": "code",
   "links": [
    {
     "url": "https://www.github.com/",
     "name": "github"
    },
    {
     "url": "https://www.codepen.io/",
     "name": "codepen"
    },
    {
     "name": "mozilla dev",
     "url": "https://developer.mozilla.org/"
    },
    {
     "name": "devdocs",
     "url": "http://devdocs.io/"
    }
   ]
  }
 ],
 "userInformation": [
    {
     "key": "User",
     "value": "orion"
    },
    {
     "key": "Account Created",
     "value": "Aug 1998"
    },
    {
     "key": "Bio",
     "value": "what is good"
    }
 ],
 "backgroundUrl": "https://images.unsplash.com/photo-1492627223639-6e980361988c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80",
 "imageWindowImageUrl": "https://pbs.twimg.com/media/DJeR25oXoAIhkVq.jpg"
}

new CustomStartStorage().get()
    .then(data => {
		setup(data);
    });

