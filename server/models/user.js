var	mongoose = require('mongoose'),
	crypto = require('bcrypt'),
	SALT_WORK_FACTOR = 10,
	MAX_LOGIN_ATTEMPTS = 5,
	LOCK_TIME = 2 * 60 * 60 * 1000;

mongoose.connect('mongodb://localhost/tydlyn');
mongoose.set('debug, true');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB: connection error:'));
db.once('open', function callback () {
	console.log("MongoDB: Database successfully opened");
});

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	}
}, {collection: 'users', strict: true});

UserSchema.pre = {
	save: function() {
		var user = this;

		// only hash the password if it has been modified (or is new)
		if (!user.isModified('password')) return next();

		// generate a salt
		crypto.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) return next(err);

			// hash the password using our new salt
			crypto.hash(user.password, salt, function(err, hash) {
				if (err) return next(err);

				// override the cleartext password with the hashed one
				user.password = hash;
				next();
			});
		});
	}
}

/**
 * Methods
 */

UserSchema.methods = {
	comparePassword: function(candidatePassword, done) {
		crypto.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) return done(err);
			done(null, isMatch);
		});
	},
	findByUsername: function(username, done) {
		for (var i = 0, len = users.length; i < len; i++) {
			var user = users[i];
			if (user.username === username) {
				return done(null, user);
			}
		}
		return done(null, null);
	}
};

/**
 * Statics
 */

var reasons = UserSchema.statics.failedLogin = {
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
	MAX_ATTEMPTS: 2
};

UserSchema.statics = {
	authenticate: function(email, password, cb) {
		console.log('Authenticating: ' + email);
		this.find({ email: email }, function(err, user) {
			if (err) return cb(err);

			// make sure the user exists
			if (!user) {
				return cb(null, null, reasons.NOT_FOUND);
			}

			// test for a matching password
			user.comparePassword(password, function(err, isMatch) {
				if (err) return cb(err);

				// check if the password was a match
				if (isMatch) {
					// if there's no lock or failed attempts, just return the user
					if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
					// reset attempts and lock info
					var updates = {
						$set: { loginAttempts: 0 },
						$unset: { lockUntil: 1 }
					};
					return user.update(updates, function(err) {
						if (err) return cb(err);
						return cb(null, user);
					});
				}

				// password is incorrect, so increment login attempts before responding
				user.incLoginAttempts(function(err) {
					if (err) return cb(err);
					return cb(null, null, reasons.PASSWORD_INCORRECT);
				});
			})
		})
	},
	list: function (options, cb) {
		var criteria = options.criteria || {};

		this.find(criteria)
			.limit(options.perPage)
			.skip(options.perPage * options.page)
			.exec(cb)
	}
};

// Create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);