const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./prisma'); 

const sessionMiddleware = session({
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, 
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
  },
});

module.exports = sessionMiddleware;
