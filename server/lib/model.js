let { sequelize } = require('./mysql');
const Sequelize = require('sequelize');





const managers = sequelize.define('applet_managers', {
  name: {
    type: Sequelize.STRING
  },
  nickName: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.INTEGER
  },
  password: {
    type: Sequelize.STRING
  },
  createTime: {
    type: Sequelize.DATE
  },
  invalid: {
    type: Sequelize.INTEGER
  }
}, {
    timestamps: false,
    freezeTableName: true
  });

managers.sync();



const activities = sequelize.define('applet_activities',{
  title:{
    type: Sequelize.STRING
  },
  playbill:{
    type: Sequelize.STRING
  },
  movieId:{
    type: Sequelize.INTEGER
  },
  movieName:{
    type: Sequelize.STRING
  },
  startDay:{
    type: Sequelize.DATE
  },
  endDay:{
    type: Sequelize.DATE
  },
  description:{
    type: Sequelize.STRING
  },
  prizeDescription:{
    type: Sequelize.JSON
  },
  otherDescription:{
    type: Sequelize.JSON
  },
  status:{
    type: Sequelize.INTEGER
  },
  managerId:{
    type: Sequelize.INTEGER
  },
  managerName:{
    type: Sequelize.STRING
  },
  createTime:{
    type: Sequelize.DATE
  },
  invalid:{
    type: Sequelize.INTEGER
  }

},{
  timestamps:false,
  freezeTableName:true
});

activities.sync();



const address = sequelize.define('applet_address',{
  openid:{
    type: Sequelize.STRING
  },
  province:{
    type: Sequelize.STRING
  },
  city:{
    type: Sequelize.STRING
  },
  address:{
    type: Sequelize.STRING
  },
  invalid:{
    type: Sequelize.INTEGER
  }
}, {
    timestamps: false,
    freezeTableName: true
});

address.sync();



const msgs = sequelize.define('applet_msgs',{
  title:{
    type: Sequelize.STRING
  },
  description:{
    type: Sequelize.STRING
  },
  content:{
    type: Sequelize.STRING
  },
  link:{
    type: Sequelize.STRING
  },
  openids:{
    type: Sequelize.JSON
  },
  managerId:{
    type: Sequelize.INTEGER
  },
  managerName:{
    type: Sequelize.STRING
  },
  createTime:{
    type: Sequelize.DATE
  },
  sendTime:{
    type: Sequelize.DATE
  },
  status:{
    type: Sequelize.INTEGER
  },
  readStatus:{
    type: Sequelize.INTEGER
  },
  invalid:{
    type: Sequelize.INTEGER
  }
},{
    timestamps: false,
    freezeTableName: true
});

msgs.sync();



const prizes = sequelize.define('applet_prizes',{

  name:{
    type: Sequelize.STRING
  },
  image:{
    type: Sequelize.STRING
  },
  num:{
    type: Sequelize.INTEGER
  },
  managerId:{
    type: Sequelize.INTEGER
  },
  managerName:{
    type: Sequelize.STRING
  },
  createTime:{
    type: Sequelize.DATE
  },
  invalid:{
    type: Sequelize.INTEGER
  }
},{
    timestamps: false,
    freezeTableName: true
});

prizes.sync();


const reports = sequelize.define('applet_reports',{

  openid:{  type: Sequelize.STRING  },
  cinemaCode:{  type: Sequelize.INTEGER },
  cinemaName:{  type: Sequelize.STRING  },
  city:{  type: Sequelize.INTEGER },
  cityName:{  type: Sequelize.STRING  },
  chain:{ type: Sequelize.INTEGER },
  chainName:{ type: Sequelize.STRING  },
  content:{ type: Sequelize.JSON  },
  remark:{  type: Sequelize.STRING  },
  showDay:{ type: Sequelize.DATE  },
  managerId:{ type: Sequelize.INTEGER  },
  managerName:{ type: Sequelize.STRING },
  status:{  type: Sequelize.INTEGER },
  invalid:{ type: Sequelize.INTEGER }
}, {
    timestamps: false,
    freezeTableName: true
});

reports.sync();



const users = sequelize.define('applet_users',{

  openid: { type: Sequelize.STRING },
  nickName: { type: Sequelize.STRING },
  gender: { type: Sequelize.INTEGER },
  country: { type: Sequelize.STRING },
  province: { type: Sequelize.STRING },
  city: { type: Sequelize.STRING },
  language: { type: Sequelize.STRING },
  phone: { type: Sequelize.INTEGER },
  avatarUrl: { type: Sequelize.STRING },
  invalid: { type: Sequelize.INTEGER },
  createTime: { type: Sequelize.DATE },
  lastModify: { type: Sequelize.DATE },
  addressId:{type: Sequelize.INTEGER},
},{
    timestamps: false,
    freezeTableName: true
});

users.sync();



const winners = sequelize.define('applet_winners', {

  openid: { type: Sequelize.STRING },
  activiteId: { type: Sequelize.INTEGER },
  prizeId: { type: Sequelize.INTEGER },
  prizeName: { type: Sequelize.STRING },
  prizeImage: { type: Sequelize.STRING },
  isSure: { type: Sequelize.INTEGER },
  status: { type: Sequelize.INTEGER },
  needDelivery: { type: Sequelize.INTEGER },
  deliveryCode: { type: Sequelize.STRING },
  addressId: { type: Sequelize.INTEGER },
  address: { type: Sequelize.STRING },
  managerId: { type: Sequelize.INTEGER },
  managerName: { type: Sequelize.STRING },
  isReceived: { type: Sequelize.INTEGER},
  createTime: { type: Sequelize.DATE },
  invalid: { type: Sequelize.INTEGER },
}, {
    timestamps: false,
    freezeTableName: true
  });

winners.sync()



module.exports = {
  'manager': managers,
  'address':address,
  'msgs': msgs,
  'prizes': prizes,
  'reports': reports,
  'users': users,
  'winners': winners
};
