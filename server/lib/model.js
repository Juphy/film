let { sequelize } = require('./mysql');
const Sequelize = require('sequelize');
const moment = require('moment');




const managers = sequelize.define('applet_managers', {
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
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  invalid: {
    type: Sequelize.INTEGER
  },
  account: {
    type: Sequelize.STRING
  }
}, {
    timestamps: false,
    freezeTableName: true
  });

managers.sync();



const activities = sequelize.define('applet_activities', {
  title: {
    type: Sequelize.STRING
  },
  playbill: {
    type: Sequelize.STRING
  },
  movie_id: {
    type: Sequelize.INTEGER
  },
  movie_name: {
    type: Sequelize.STRING
  },
  start_day: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('start_day')).format('YYYY-MM-DD');
    }
  },
  end_day: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('end_day')).format('YYYY-MM-DD');
    }
  },
  description: {
    type: Sequelize.STRING
  },
  prize_description: {
    type: Sequelize.JSON
  },
  other_description: {
    type: Sequelize.JSON
  },
  status: {
    type: Sequelize.INTEGER
  },
  manager_id: {
    type: Sequelize.INTEGER
  },
  manager_name: {
    type: Sequelize.STRING
  },
  create_time: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  invalid: {
    type: Sequelize.INTEGER
  }

}, {
    timestamps: false,
    freezeTableName: true
  });

activities.sync();



const address = sequelize.define('applet_address', {
  open_id: {
    type: Sequelize.STRING
  },
  province: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  invalid: {
    type: Sequelize.INTEGER
  }
}, {
    timestamps: false,
    freezeTableName: true
  });

address.sync();



const msgs = sequelize.define('applet_msgs', {
  title: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.STRING
  },
  link: {
    type: Sequelize.STRING
  },
  open_ids: {
    type: Sequelize.JSON
  },
  manager_id: {
    type: Sequelize.INTEGER
  },
  manager_name: {
    type: Sequelize.STRING
  },
  create_time: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  send_time: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('send_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  status: {
    type: Sequelize.INTEGER
  },
  read_status: {
    type: Sequelize.INTEGER
  },
  invalid: {
    type: Sequelize.INTEGER
  }
}, {
    timestamps: false,
    freezeTableName: true
  });

msgs.sync();



const prizes = sequelize.define('applet_prizes', {

  name: {
    type: Sequelize.STRING
  },
  image: {
    type: Sequelize.STRING
  },
  num: {
    type: Sequelize.INTEGER
  },
  manager_id: {
    type: Sequelize.INTEGER
  },
  manager_name: {
    type: Sequelize.STRING
  },
  create_time: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  invalid: {
    type: Sequelize.INTEGER
  }
}, {
    timestamps: false,
    freezeTableName: true
  });

prizes.sync();


const reports = sequelize.define('applet_reports', {

  open_id: { type: Sequelize.STRING },
  cinemaCode: { type: Sequelize.INTEGER },
  cinema_name: { type: Sequelize.STRING },
  city: { type: Sequelize.INTEGER },
  city_name: { type: Sequelize.STRING },
  chain: { type: Sequelize.INTEGER },
  chain_name: { type: Sequelize.STRING },
  content: { type: Sequelize.JSON },
  remark: { type: Sequelize.STRING },
  show_day: {
    type: Sequelize.DATE, get() {
      return moment(this.getDataValue('show_day')).format('YYYY-MM-DD');
    }
  },
  manager_id: { type: Sequelize.INTEGER },
  manager_name: { type: Sequelize.STRING },
  status: { type: Sequelize.INTEGER },
  invalid: { type: Sequelize.INTEGER }
}, {
    timestamps: false,
    freezeTableName: true
  });

reports.sync();



const users = sequelize.define('cSessionInfo', {

  open_id: { type: Sequelize.STRING },
  nick_name: { type: Sequelize.STRING },
  gender: { type: Sequelize.INTEGER },
  country: { type: Sequelize.STRING },
  province: { type: Sequelize.STRING },
  city: { type: Sequelize.STRING },
  language: { type: Sequelize.STRING },
  phone: { type: Sequelize.INTEGER },
  avatar_url: { type: Sequelize.STRING },
  invalid: { type: Sequelize.INTEGER },
  create_time: {
    type: Sequelize.DATE, get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  last_modify: {
    type: Sequelize.DATE, get() {
      return moment(this.getDataValue('last_modify')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  address_id: { type: Sequelize.INTEGER },

}, {
    timestamps: false,
    freezeTableName: true
  });

users.sync();



const winners = sequelize.define('applet_winners', {

  openid: { type: Sequelize.STRING },
  activite_id: { type: Sequelize.INTEGER },
  prizeId: { type: Sequelize.INTEGER },
  prize_name: { type: Sequelize.STRING },
  prize_image: { type: Sequelize.STRING },
  isSure: { type: Sequelize.INTEGER },
  status: { type: Sequelize.INTEGER },
  need_delivery: { type: Sequelize.INTEGER },
  delivery_code: { type: Sequelize.STRING },
  address_id: { type: Sequelize.INTEGER },
  address: { type: Sequelize.STRING },
  manager_id: { type: Sequelize.INTEGER },
  manager_name: { type: Sequelize.STRING },
  is_received: { type: Sequelize.INTEGER },
  create_time: {
    type: Sequelize.DATE, get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  invalid: { type: Sequelize.INTEGER },
}, {
    timestamps: false,
    freezeTableName: true
  });

winners.sync()



module.exports = {
  'manager': managers,
  'address': address,
  'msg': msgs,
  'prize': prizes,
  'report': reports,
  'user': users,
  'winner': winners
};
