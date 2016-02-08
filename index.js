/*
 * Sinopia plugin for authenticating users hardcoded into the config file
 *
 * @author Aniket Panse <aniketpanse@gmail.com>
 */

function Auth (config, stuff) {
  if (!(this instanceof Auth)) {
      return new Auth(config, stuff);
  }
  this.logger = stuff.logger;

  this.users = {};
  for (username in config) {
    if (config.hasOwnProperty(username)) {
      var passwd = config[username];
      if (typeof passwd === 'string') {
        this.users[username] = config[username]
      }
      else {
        this.logger.warn({
          username: username,
          errMsg: 'Configured password is not a string: ' + passwd
        },
        'user: @{username}, @{errMsg}');
      }
    }
  }
}

Auth.prototype.authenticate = function (username, password, done) {
    if (this.users[username] && this.users[username] === password) {
      return done(null, [username]);
    }
    this.logger.log('Auth failed for user: ' + username);
    return done(new Error('User not found'));
};

Auth.prototype.add_user = function (username, password, done) {
    this.authenticate.apply(this, arguments);
};

module.exports = Auth;
