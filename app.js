const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const pool = require('./config/pool');
require('dotenv').config();
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { uploadRouter } = require('./routers/uploadRouter.js');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());

const prisma = new PrismaClient();

const sessionStore = new PrismaSessionStore(prisma, {
	checkPeriod: 2 * 60 * 1000, //ms
	dbRecordIdIsSessionId: true,
	dbRecordIdFunction: undefined,
});

app.use(
	session({
		store: sessionStore,
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 1000 * 60 * 60 * 24, // 1 day
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.errorMessages = req.flash('error');
	res.locals.successMessages = req.flash('success');
	next();
});

app.get('/', async (req, res) => {
	res.render('index');
});

app.get('/sign-up', (req, res) => {
	const errors = req.session.formErrors || null;
	const data = req.session.formData || {};

	req.session.formErrors = null;
	req.session.formData = null;
	res.render('sign-up', { errors, data });
});

app.post(
	'/sign-up',
	[
		body('username')
			.trim()
			.escape()
			.isLength({ min: 3 })
			.withMessage('Username must be at least 3 characters')
			.custom(async (value) => {
				// const { rows } = await pool.query(
				// 	'SELECT 1 FROM users WHERE username = $1',
				// 	[value]
				// );
				const user = await prisma.user.findUnique({
					where: {
						username: value,
					},
				});
				if (user) {
					throw new Error('Username is already taken');
				}
				return true;
			}),
		body('password')
			.trim()
			.isLength({ min: 4 })
			.withMessage('Password must be at least 4 characters'),
		body('passwordConfirmation')
			.custom((value, { req }) => value === req.body.password)
			.withMessage('Passwords must match.'),
	],
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.session.formErrors = errors.mapped();
			req.session.formData = req.body;
			return res.redirect(303, '/sign-up');
		}
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			// await pool.query(
			// 	'INSERT INTO users (username, password) VALUES ($1, $2)',
			// 	[req.body.username, hashedPassword]
			// );
			await prisma.user.create({
				data: {
					username: req.body.username,
					password: hashedPassword,
				},
			});
			res.render('log-in');
		} catch (err) {
			return next(err);
		}
	}
);

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			// const { rows } = await pool.query(
			// 	'SELECT * FROM users WHERE username = $1',
			// 	[username]
			// );
			// const user = rows[0];

			const user = await prisma.user.findUnique({
				where: {
					username: username,
				},
			});

			if (!user) {
				return done(null, false, { message: 'Incorrect username' });
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, { message: 'Incorrect password' });
			}
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		// const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
		// 	id,
		// ]);
		const user = await prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		if (!user) return done(null, false);
		return done(null, user);
	} catch (err) {
		return done(err);
	}
});

app.get('/log-in', (req, res) => {
	res.render('log-in');
});

app.get('/dashboard', (req, res) => res.render('dashboard'));

app.post(
	'/log-in',
	passport.authenticate('local', {
		successRedirect: 'dashboard',
		failureRedirect: '/log-in',
		failureFlash: true,
	})
);

app.use('/upload', uploadRouter);

app.listen(3000, () => console.log('app listening on port 3000!'));
