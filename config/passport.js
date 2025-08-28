const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await prisma.user.findUnique({ where: { username } });
			if (!user) return done(null, false, { message: 'User Not Found' });

			const match = await bcrypt.compare(password, user.password);
			if (!match) return done(null, false, { message: 'Incorrect password' });

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } });
		if (!user) return done(null, false);
		return done(null, user);
	} catch (err) {
		return done(err);
	}
});

module.exports = passport;
