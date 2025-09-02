File Uploader App

This project is essentially stripped-down version of Google Drive. I built a file uploader app with authentication, database migrations, and cloud storage in order to practice full-stack concepts.

Features

User authentication with Passport.js

File uploads stored in Cloudinary

File URLs and user info mapped in a PostgreSQL database

Prisma as the ORM for managing schema and migrations

What I Learned

How to integrate Prisma with an existing codebase to handle database migrations more smoothly

Setting up user authentication flows with Passport

Designing a database schema that maps files to users and stores Cloudinary URLs

Thinking about app structure and separating out config vs. feature logic

Handling a bigger project from start to finish and seeing how all the pieces (auth, db, storage, UI) tie together

Tech Stack

Node.js / Express

PostgreSQL

Prisma

Passport.js

Cloudinary

Future Improvements

Add folder nesting (subdirectories)

Better UI for file previews

Sharing permissions between users
