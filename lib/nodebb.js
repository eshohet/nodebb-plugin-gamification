const adminSockets = require.main.require('./src/socket.io/admin').plugins;
const db = require.main.require('./src/database');
const meta = require.main.require('./src/meta');
const pluginSockets = require.main.require('./src/socket.io/plugins');
const postTools = require.main.require('./src/posts/tools');
const settings = require.main.require('./src/settings');
const socketIndex = require.main.require('./src/socket.io/index');
const topics = require.main.require('./src/topics');
const user = require.main.require('./src/user');
const nconf = require.main.require('nconf');

module.exports = {
  adminSockets,
  db,
  meta,
  pluginSockets,
  postTools,
  settings,
  socketIndex,
  topics,
  user,
  nconf
};