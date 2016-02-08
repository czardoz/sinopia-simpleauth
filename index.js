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
    this.logger.info('SimpleAuth failed for user: ' + username);
    return done(null, false);
};

Auth.prototype.add_user = function (username, password, done) {
    this.authenticate.apply(this, arguments); // registration just authentication
};

Auth.prototype.adduser = Auth.prototype.add_user; // Backwards compat.

module.exports = Auth;
