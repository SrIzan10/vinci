# vinci v2

Vinci v2 is a rewrite of my first JS project. It aims to improve the code quality of the primary codebase, full of bugs and spaghetti code.

It is written, as always, under the [sern](https://sern.dev) framework.

It is 85% done, with hardest commands implemented.

This is a bot submission for [Converge](https://converge.hackclub.com) and [Summer of Making](https://summer.hackclub.com).

## New features
- More fun games
- Modern typescript and discord.js
- SQLite + Prisma instead of MongoDB + Mongoose
- Less API queries by using local datasets (like the Spanish dictionary)

## Development setup
1. Clone the repository
2. Run `bun install`
3. Install the sern cli: `npm install -g @sern/cli`
4. Create a copy of `.env.example` and rename it to `.env`
5. Fill in the file
6. Run `bun dev`