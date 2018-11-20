let {
  sequelize
} = require('./mysql');
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



const activities = sequelize.define('applet_activites', {
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
    type: Sequelize.DATEONLY,
  },
  end_day: {
    type: Sequelize.DATEONLY,
  },
  description: {
    type: Sequelize.STRING
  },
  prize_description: {
    type: Sequelize.JSON
  },
  other_description: {
    type: Sequelize.TEXT
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
  contact: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  },
  province: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  county: {
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

  open_id: {
    type: Sequelize.STRING
  },
  nick_name: {
    type: Sequelize.STRING
  },
  avatar_url: {
    type: Sequelize.STRING
  },
  activite_id: {
    type: Sequelize.INTEGER
  },
  title: {
    type: Sequelize.STRING
  },
  movie_id: {
    type: Sequelize.INTEGER
  },
  movie_name: {
    type: Sequelize.STRING
  },
  cinema_code: {
    type: Sequelize.INTEGER
  },
  cinema_name: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.INTEGER
  },
  chain: {
    type: Sequelize.INTEGER
  },
  content: {
    type: Sequelize.JSON
  },
  remark: {
    type: Sequelize.STRING
  },
  show_day: {
    type: Sequelize.DATEONLY,
    get() {
      return moment(this.getDataValue('show_day')).format('YYYY-MM-DD');
    }
  },
  manager_id: {
    type: Sequelize.INTEGER
  },
  manager_name: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.INTEGER
  },
  invalid: {
    type: Sequelize.INTEGER
  },
  is_winner: {
    type: Sequelize.INTEGER
  },
  create_time: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD');
    }
  }
}, {
  timestamps: false,
  freezeTableName: true
});

reports.sync();



const users = sequelize.define('cSessionInfo', {

  open_id: {
    type: Sequelize.STRING
  },
  nick_name: {
    type: Sequelize.STRING
  },
  gender: {
    type: Sequelize.INTEGER
  },
  country: {
    type: Sequelize.STRING
  },
  province: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  language: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.INTEGER
  },
  avatar_url: {
    type: Sequelize.STRING
  },
  invalid: {
    type: Sequelize.INTEGER
  },
  create_time: {
    type: Sequelize.DATE
  },
  last_modify: {
    type: Sequelize.DATE
  },
  address_id: {
    type: Sequelize.INTEGER
  },

}, {
  timestamps: false,
  freezeTableName: true
});

users.sync();



const winners = sequelize.define('applet_winners', {

  open_id: {
    type: Sequelize.STRING
  },
  active_id: {
    type: Sequelize.INTEGER
  },
  prize_id: {
    type: Sequelize.INTEGER
  },
  prize_name: {
    type: Sequelize.STRING
  },
  prize_image: {
    type: Sequelize.STRING
  },
  is_sure: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.INTEGER
  },
  need_delivery: {
    type: Sequelize.INTEGER
  },
  mailno: {
    type: Sequelize.STRING
  },
  orderid: {
    type: Sequelize.STRING
  },
  address_id: {
    type: Sequelize.INTEGER
  },
  address: {
    type: Sequelize.JSON
  },
  manager_id: {
    type: Sequelize.INTEGER
  },
  manager_name: {
    type: Sequelize.STRING
  },
  is_received: {
    type: Sequelize.INTEGER
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
  report_id: {
    type: Sequelize.INTEGER
  },
  nick_name: {
    type: Sequelize.STRING
  },
  avatar_url: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  movie_id: {
    type: Sequelize.INTEGER
  },
  movie_name: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false,
  freezeTableName: true
});

winners.sync()

const diqu = sequelize.define('applet_diqu', {
  code: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  post_name: {
    type: Sequelize.STRING
  },
  parent: {
    type: Sequelize.STRING
  },
  ssxz: {
    type: Sequelize.INTEGER
  },
  pinyin: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.INTEGER
  },
  display: {
    type: Sequelize.INTEGER
  },
}, {
  timestamps: false,
  freezeTableName: true
});

diqu.sync()

const movie = sequelize.define('applet_movies', {
  movie_id: {
    type: Sequelize.INTEGER
  },
  movie_name: {
    type: Sequelize.STRING
  },
  show_day: {
    type: Sequelize.DATE
  },
  playbills: {
    type: Sequelize.JSON
  }
}, {
  timestamps: false,
  freezeTableName: true
});

movie.sync()

const cities = sequelize.define('applet_cities', {
  code: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  pinyin: {
    type: Sequelize.STRING
  },
  grade: {
    type: Sequelize.INTEGER
  }
}, {
  timestamps: false,
  freezeTableName: true
})

cities.sync()

const cinemas = sequelize.define('applet_cinemas', {
  hash_code: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  chain: {
    type: Sequelize.INTEGER
  },
  regist_name: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.INTEGER
  },
  sheng: {
    type: Sequelize.INTEGER
  },
  shi: {
    type: Sequelize.INTEGER
  },
  xian: {
    type: Sequelize.INTEGER
  },
  zhen: {
    type: Sequelize.INTEGER
  },
  city: {
    type: Sequelize.INTEGER
  },
  street: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  longitude: {
    type: Sequelize.DOUBLE
  },
  latitude: {
    type: Sequelize.DOUBLE
  }
}, {
  timestamps: false,
  freezeTableName: true
})

cinemas.sync()

reports.belongsTo(activities, {
  foreignKey: 'activite_id',
  targetKey: 'id'
});

users.belongsTo(address, {
  foreignKey: 'address_id',
  targetKey: 'id',
  as: 'address'
});

module.exports = {
  'Manager': managers,
  'Address': address,
  'Msg': msgs,
  'Prize': prizes,
  'Report': reports,
  'User': users,
  'Winner': winners,
  'Diqu': diqu,
  'Movie': movie,
  'City': cities,
  'Cinema': cinemas,
  'Activity': activities
};