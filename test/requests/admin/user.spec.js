var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;

var app = require('../../../app')
var helpers = require('../../../_helpers');
const db = require('../../../models')

// admin 使用者相關功能測試
// 1. 如果一般 user 進入，就要回到 user root path
// 2. 如果是 admin 進入，就可以看到所有 User 資料
describe('# Admin::User request', () => {

  context('go to admin user page', () => {
    describe('if normal user log in', () => {
      before(async() => {
        // 模擬登入資料
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({name: 'User1'})
      })

      // 如果一般 user 進入，就要回到 user root path
      it('should redirect to root path', (done) => {
        request(app)
          .get('/admin/users')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      after(async () => {
        // 清除登入及測試資料庫資料 
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
      })
    })
    
    describe('if admin user log in', () => {
      before(async() => {
        // 模擬登入資料  
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'admin'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({name: 'User1'})
      })

      // 如果是 admin 進入，就可以看到所有 User 資料
      it('should see all user list', (done) => {
        request(app)
          .get('/admin/users')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否有 User1 資料
            res.text.should.include('User1')
            done();
          });
      })

      after(async () => {
        // 清除登入及測試資料庫資料
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
      })
    })
  })
});