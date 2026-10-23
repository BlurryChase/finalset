
# NodeFGC - An FGC-oriented broadcast package using NodeCG!
## Graphics (HTML/CSS) Edition

NodeFGC is a broadcast graphics package built using NodeCG to allow for flexible creation and execution of a broadcast housed within the FGC!

## Purpose of the Project

This project is made to make setting up and generate graphics easier for FGC tournament streamers and TOs. As someone who has run broadcasts from small weeklies to major events, I have used a variety of software from StreamControl to proprietary tools, and I wanted to create something that was easy to follow and setup for everyone.

This Project is Open-Source, it would make me tremendously happy to see this used!

If you are using this app, please email me or discord message me with a stream link so I can try and watch it!

## Graphics are served by...

HTML & CSS! If you want a version served with image examples, check out the below link!

- [Graphics served with Images](https://www.github.com/BlurryChase/nodeFGC-graphics-images)
- [Dashboards for Overlays](https://www.github.com/BlurryChase/nodeFGC-dash)

#### Lock-on Power!

There is an additional lock-on dashboard for NodeFGC - StartGGLockOn! This allows you pull matches using startGG's API, allowing for seamless and quick updates to matches-including the ability to filter down by what stream you're running!

[StartGGLockOn](https://www.github.com/BlurryChase/nodeFGC-startGGLockOn)

I may have more ideas for more lock-ons in the future — stay tuned!

## Features

- Calls data structures from NodeFGC-dash!
- Game-specific layouts!
    - Graphics examples include layouts compatible with Street Fighter 6, Tekken 8, and Super Smash Bros. Ultimate
- Control Visiblity with included button layouts, complete with animations powered by GSAP!
    - (I'm considering adding bitfocus companion compatiblity with `ws` down the line, but that will not be a part of 1.0.0)
- Change the color of the background & text!
    -Uses colorpicker for colors, but you can also put in Hex Codes for unlimited colors.

## Installation (Standard)

Per [NodeCG's Install Guide](https://www.nodecg.dev/docs/installing):
1. Install [Node.JS (version 22)](https://nodejs.org/en)
2. Install [Git](https://git-scm.com/)
3. Install NodeCG-CLI: `npm install --global nodecg@latest`
4. Create a directory for NodeCG: `mkdir nodecg && cd nodecg`
5. Install NodeCG: `nodecg setup`
6. Install NodeFGC's dashboards: `nodecg install BlurryChase/nodeFGC-dash`
7. Install NodeFGC's graphics: `nodecg install BlurryChase/nodeFGC-graphics` or `nodecg install BlurryChase/nodeFGC-graphics-images`
8. Run NodeGC by running `nodecg start` where you installed NodeCG
9. Access the dashboard at `http://localhost:9090` in your favorite browser!

## Installation (Experimental)

NodeCG has a [new and experimental install](https://www.nodecg.dev/docs/installing-new) guide, where NodeCG is installed as a dependancy of the project:

1. Install [Node.JS (version 22)](https://nodejs.org/en)
2. Install [Git](https://git-scm.com/)
3. Download nodeFGC-dash, doing either:
    1. Download this repo as .zip and extract
    2. Clone the dashboard repo: `git init && git clone https://www.github.com/BlurryChase/nodeFGC-dash.git`
4. Install NodeCG in project root: `npm install nodecg`
5. Create a `bundles` folder in project root 
6. Download nodeFGC-graphics and place in `bundles`, doing either:
    1. Download directory as .zip and extract
    2. Clone the dashboard repo: `git init && git clone https://www.github.com/BlurryChase/nodeFGC-graphics.git` or `git init && git clone https://www.github.com/BlurryChase/nodeFGC-graphics-images.git`
7. Run NodeGC by running `npx nodecg start` in the dashboard directory
8. Access the dashboard at `http://localhost:9090` in your favorite browser!


## Replicant Documentation

Documentation is specific for each branch of the project, please see [NodeFGC-dash](https://github.com/BlurryChase/nodeFGC-dash) for full documentation on their schema.

Replicant Schemes are stored in the `schemas` directory.

Reference: [NodeCG's Replicants](https://www.nodecg.dev/docs/classes/replicant)

**Visiblity Replicant**

Schema: `visibility.json`

Controls Visibility for the graphics.

Standard Access: `visibilityRep.value`

| Syntax | Type |  Description |
| --- | ------ | ---- |
| scoreVisibility | boolean | Controls Visibility of scoreboard.html |
| casterVisibility | boolean | Controls Visibility of casters.html |
| lowerThirdVisibility | boolean | Controls Visibility of lowerthird.html |

**Color Replicant**

Schema: `colorwheel.json`

Controls Color information to assist in serving HTMl & CSS. Information stored as string because of Hex values.

Standard Access: `colorRep.value`

| Syntax | Type |  Description |
| --- | ------ | ---- |
| mainColor | string | Main Color Background for layouts |
| textColor | string | Text Color for layouts |

**Game Replicant**

Schema: `eventgame.json`

Stores the game information to be used in scoreboard.

css for game-specific layouts are stored in :`graphics/assets/games`

Extra: Variety of applications you can use for this.
- You can apply it to load logos in a break screen, like Texas Showdown does.
- You can also add an event value if you want, then you will be able to drive further iteration by allowing you to house multiple events in the same bundle.
    - Out of scope for this project, but it can be done! (This was done for our weeklies)

Standard Access: `eventgame.value`

| Syntax | Type |  Description |
| --- | ------ | ---- |
| gameName | string | Name of the Game you are playing |

### Events using NodeFGC
These are some of the events I have made layouts for:
* Dream Convention Gaming Stage 2023-2025
* Low Tide City 2024
* Low Tier City 2023
* Texas Showdown 2024-2025 (ported from streamcontrol for my teams use)
* Attack on Texas
* Region Warefare
* Unc Frozen's Icebox
* Texas Melee League
* Texas Weeklies: Ultimate Shockwave, Monday Night Melee, SUPLEX

### Special Thanks

- My roommate & director Hunter, for pushing me to make this app
- My crewmates Jake and Mads, for using the app and providing feedback/fixes
- My friend cglitcher, for programming advice and insight
- You, for making it down this far lmao 

### Contact
Email: `tec.chaser95@gmail.com`
Discord: `blurrychase`