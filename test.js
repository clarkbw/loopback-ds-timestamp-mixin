/*global describe:true,it:true,beforeEach:true*/

var assert = require('assert');

var app = require('loopback');

var dataSource = app.createDataSource({
  connector: app.Memory
});

// import our TimeStamp mixin
require('./')(app);

var Book;

describe('loopback datasource timestamps', function () {
  'use strict';

  describe('createdAt', function () {

    beforeEach(function (done) {
      Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: true } }
        );
      Book.destroyAll(done);
    });

    it('should exist on create', function (done) {
      Book.create({name : 'book 1', type : 'fiction'}, function (err, book) {
        assert.ok(book.createdAt);
        assert.equal(typeof book.createdAt, 'object');
        assert.ok(book.createdAt instanceof Date);
        done();
      });
    });

    it('should not change on save', function (done) {
      var createdAt;
      Book.create({name : 'book 1', type : 'fiction'}, function (err, book) {
        assert.ok(book.createdAt);
        createdAt = book.createdAt;
        book.name = 'book inf';
        book.save(function (err) {
          assert.equal(createdAt, book.createdAt);
          done();
        });
      });
    });

    it('should not change on update', function (done) {
      var createdAt;
      Book.create({name : 'book 1', type : 'fiction'}, function (err, book) {
        assert.ok(book.createdAt);
        createdAt = book.createdAt;
        book.updateAttributes({ name : 'book inf' }, function (err) {
          assert.equal(createdAt, book.createdAt);
          done();
        });
      });
    });

    it('should not change with bulk updates', function (done) {
      var createdAt;
      Book.create({name : 'book 1', type : 'fiction'}, function (err, book) {
        assert.ok(book.createdAt);
        createdAt = book.createdAt;
        Book.updateAll({ type : 'fiction' }, { type : 'non-fiction' }, function (err, count) {
          assert.equal(createdAt, book.createdAt);
          done();
        });
      });
    });

  });

  describe('updatedAt', function () {

    beforeEach(function (done) {
      Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: true } }
        );
      Book.destroyAll(done);
    });

    it('should exist on create', function (done) {
      Book.create({name : 'book 1', type : 'fiction'}, function (err, book) {
        assert.ok(book.updatedAt);
        assert.equal(typeof book.updatedAt, 'object');
        assert.ok(book.updatedAt instanceof Date);
        done();
      });
    });

    it('should be updated via updateAttributes', function (done) {
      var updatedAt;
      Book.create({name : 'book 1', type : 'fiction'}, function (err, book) {
        assert.ifError(err);
        updatedAt = book.updatedAt;
        // ensure we give enough time for the updatedAt value to be different
        setTimeout(function pause() {
          book.updateAttributes({ type : 'historical-fiction' }, function (err, book) {
            assert.ifError(err);
            assert.ok(book.updatedAt);
            assert.ok(book.updatedAt.getTime() > updatedAt.getTime());
            done();
          });
        }, 1);
      });
    });

    it('should update bulk model updates at once', function (done) {
      var updatedAt1, updatedAt2;
      Book.create({name : 'book 1', type : 'fiction'}, function (err, book) {
        assert.ifError(err);
        updatedAt1 = book.updatedAt;
        setTimeout(function pause1() {
          Book.create({name : 'book 2', type : 'fiction'}, function (err, book) {
            assert.ifError(err);
            updatedAt2 = book.updatedAt;
            assert.ok(updatedAt2.getTime() > updatedAt1.getTime());
            setTimeout(function pause2() {
              Book.updateAll({ type : 'fiction' }, { type : 'romance' }, function (err, count) {
                assert.ifError(err);
                Book.find({ type : 'romance' }, function (err, books) {
                  assert.ifError(err);
                  assert.equal(books.length, 2);
                  books.forEach(function (book) {
                    assert.ok(updatedAt1.getTime() < book.updatedAt.getTime());
                    assert.ok(updatedAt2.getTime() < book.updatedAt.getTime());
                  });
                  // assert.ok(updatedAt1.getTime() > updatedAt2.getTime());
                  done();
                });
              });
            }, 1);

          });
        }, 1);
      });
    });

  });

  describe('options', function () {

    beforeEach(function (done) {
      Book.destroyAll(done);
    });

    it('should use createdOn and updatedOn instead', function (done) {
      Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: { createdAt : 'createdOn', updatedAt : 'updatedOn' } } }
        );
      Book.create({name : 'book 1', type : 'fiction'}, function (err, book) {
        assert.ok(book.createdAt === undefined);
        assert.ok(book.updatedAt === undefined);

        assert.ok(book.createdOn);
        assert.equal(typeof book.createdOn, 'object');
        assert.ok(book.createdOn instanceof Date);

        assert.ok(book.updatedOn);
        assert.equal(typeof book.updatedOn, 'object');
        assert.ok(book.updatedOn instanceof Date);
        done();
      });
    });

  });

});
