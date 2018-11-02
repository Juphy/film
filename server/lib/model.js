let { sequelize } = require('./mysql');
const Sequelize = require('sequelize');
const user = sequelize.define('users', {
  name: {
    type: Sequelize.STRING
  },
  nick_name: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.INTEGER
  },
  password: {
    type: Sequelize.STRING
  },
  create_time: {
    type: Sequelize.DATE
  },
  invalid: {
    type: Sequelize.INTEGER
  }
}, {
    timestamps: false,
    tableName: 'applet_managers',
    freezeTableName: true
  });

user.sync();

module.exports = {
  'manager': user
};
