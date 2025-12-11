# Favourite Players
This project showcases the combination of using information retrieved throu the soccer API https://www.api-football.com with our own backend API. The app allows users to mark Third Party data (players) as 'favourites' by storing them in MongoDB.

## Local Setup
- Open the terminal and run the command `npm install` to setup `express` and `prisma` libraries 
- NOTE: `postinstall` will run `prisma generate` automatically to create the Prisma Client based on `./prisma/schema.prisma` 
- Add a `.env` file to the root of your project containing the variable `DATABASE_URL` with a MongoDB connection String as the value.

## Deploying to Vercel
This project is compatible with [Vercel](https://vercel.com/docs/frameworks/backend/express). Connect your Git Repo to vercel, and add the `DATABASE_URL` as an environment variable during deployment.
