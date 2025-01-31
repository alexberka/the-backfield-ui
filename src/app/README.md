# The Backfield UI (v1.025.0130.1)

The Backfield UI is a React web application developed to provide an interface with [The Backfield API](https://github.com/alexberka/the-backfield), a data management system for American football statkeeping and live game tracking.

## Technologies

- React.js
- CSS
- SignalR
- Bootstrap
- Cactus UI

## v1.025.0130.1 Features and Limitations

This version of The Backfield UI allows users to:
- Log in and create a profile (Google Firebase user auth)
- View user-created teams, players, and games
- Manage a game via game-stream page (add/update/delete Plays and view current game status)
- Observe other users' games either logged in or logged out

This version of The Backfield UI lacks functionality to add/update/delete Teams, Players, and Games. This must be accomplished via direct interaction with the APIs via Postman, Swagger, database manager, etc. Feature coming soon.

## Get Started
If you have not yet, visit [The Backfield API](https://github.com/alexberka/the-backfield) and follow the instructions to get it set up on your local machine. This project must be launched in a separate port upon starting the UI.

Clone this repo and enter the following command in the project folder:

```
npm install
```

Once installation has completed, enter this command to launch the project locally:

```
npm run dev
```

If project does not open automatically in browser, click provided localhost link.

## Basic Views

<p>Landing Page</p>

![Landing Page](../../public/images/Backfield%20Landing%20Page.png)


<p>Teams</p>

![Team List](../../public/images/Backfield%20Team%20List.png)


<p>Team With Roster</p>

![Team Roster](../../public/images/Backfield%20Team%20Roster.png)


<p>Games</p>

![Game List](../../public/images/Backfield%20Game%20List.png)

## Gamestream

[Gamestream Walkthrough on YouTube](https://youtu.be/BaaFOEkmAuc)


<p>Gamestream Display</p>

![Gamestream](../../public/images/Backfield%20Gamestream.png)


<p>Field Display Collapses in Full Stats View</p>

![Gamestream Stats](../../public/images/Backfield%20Gamestream%20Open%20Stats.png)


<p>Various Play Form Elements</p>

![Play Form Open](../../public/images/Backfield%20Play%20Form.png)
![Logging a Pass](../../public/images/Backfield%20Pass%20Form.png)
![Logging a Blocked Punt](../../public/images/Backfield%20Punt%20Form%20Block.png)
![Logging a Made Field Goal](../../public/images/Backfield%20Field%20Goal%20Form%20Good.png)
![Logging a Fumble](../../public/images/Backfield%20Fumble%20Creator.png)

## Data Validation

The Backfield UI has a couple instruments of data validation when creating plays, but most of these are redundancies to avoid 400 errors being thrown by the server-side code, giving users a pre-submission warning that their plays are incomplete. As is, the rules were mostly developed around NFL play, and some of that may cause unnecessary restrictions on what information is needed to deem a play 'complete'. These restrictions will slowly be refined as the app is adapted for wider use.

## A Note From The Developer:

This project began as the final capstone for a course I took at Nashville Software School. Though not intended from the outset, it has become essentially a clone of ESPN's Gamecast (and I certainly didn't intend for 'Gamestream' to sound like such a B-movie we-can't-afford-the-rights repackaging of it). But having followed many football games through that utility rather than watching them, I had grown enamored with reverse engineering the logic and data structures behind bringing something like a Gamecast to life. And now when I am following a game in that manner and something doesn't seem quite right, I get a good chuckle from imagining the stat-entry intern choosing the wrong name from the dropdown (or what have you).

Obviously, ESPN and their contemporaries have covered the nationally-televised football market as far as statkeeping goes, but the hope is for this application to be useful at all levels of the sport, high school, rec, intermural. Deployment impending.

## The Name of the Developer:

Alex Berka (A Football Fan Without A TV)
