const path = require('node:path');
const express = require('express');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const sessionMiddleware = require('./config/session');
const passport = require('./config/passport');
const expressLayouts = require('express-ejs-layouts');

require('dotenv').config();
const { body, validationResult } = require('express-validator');
const { fileRouter } = require('./routers/fileRouter');
const folderRouter = require('./routers/folderRouter');
const dashboardRouter = require('./routers/dashboardRouter');

const app = express();
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(sessionMiddleware);

app.use(methodOverride('_method'));
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

app.use(passport.initialize());
app.use(passport.session());

app.get('/log-in', (req, res) => {
	res.render('log-in');
});

app.use('/dashboard', dashboardRouter);

app.post(
	'/log-in',
	passport.authenticate('local', {
		successRedirect: 'dashboard',
		failureRedirect: '/log-in',
		failureFlash: true,
	})
);
app.use('/dashboard/files', fileRouter);
app.use('/dashboard/folders', folderRouter);

app.listen(3000, () => console.log('app listening on port 3000!'));
app.post('/logout', (req, res) => {
	req.logout(() => {
		req.session.destroy(() => {
			res.redirect('/log-in');
		});
	});
});
