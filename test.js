/* jshint mocha: true */

var assert = require('assert');

var app = require('loopback');

// https://github.com/strongloop/loopback-boot/blob/master/lib/executor.js#L57-L71
// the loopback-boot module patches in the loopback attribute so we can assume the same
app.loopback = require('loopback');

var dataSource = app.createDataSource({
  connector: app.Memory
});

// import our TimeStamp mixin
require('./')(app);

var Book;

describe('loopback datasource timestamps', function() {
  'use strict';

  describe('createdAt', function() {

    beforeEach(function(done) {
      Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: true } }
        );
      Book.destroyAll(done);
    });

    it('should exist on create', function(done) {
      Book.create({name: 'book 1', type: 'fiction'}, function(err, book) {
        assert.ifError(err);
        assert.ok(book.createdAt);
        assert.equal(typeof book.createdAt, 'object');
        assert.ok(book.createdAt instanceof Date);
        done();
      });
    });

    it('should not change on save', function(done) {
      var createdAt;
      Book.create({name:'book 1', type:'fiction'}, function(err, book) {
        assert.ifError(err);
        assert.ok(book.createdAt);
        createdAt = book.createdAt;
        book.name = 'book inf';
        book.save(function(err, b) {
          assert.equal(book.createdAt, b.createdAt);
          done();
        });
      });
    });

    it('should not change on update', function(done) {
      var createdAt;
      Book.create({name:'book 1', type:'fiction'}, function(err, book) {
        assert.ifError(err);
        assert.ok(book.createdAt);
        book.updateAttributes({ name:'book inf' }, function(err, b) {
          assert.ifError(err);
          assert.equal(book.createdAt, b.createdAt);
          done();
        });
      });
    });

    it('should not change with bulk updates', function(done) {
      var createdAt;
      Book.create({name:'book 1', type:'fiction'}, function(err, book) {
        assert.ifError(err);
        assert.ok(book.createdAt);
        Book.updateAll({ type:'fiction' }, { type:'non-fiction' }, function(err) {
          assert.ifError(err);
          Book.findById(book.id, function(err, b) {
            assert.equal(book.createdAt.getTime(), b.createdAt.getTime());
            done();
          });
        });
      });
    });

  });

  describe('updatedAt', function() {

    beforeEach(function(done) {
      Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: true } }
        );
      Book.destroyAll(done);
    });

    it('should exist on create', function(done) {
      Book.create({name:'book 1', type:'fiction'}, function(err, book) {
        assert.ifError(err);
        assert.ok(book.updatedAt);
        assert.equal(typeof book.updatedAt, 'object');
        assert.ok(book.updatedAt instanceof Date);
        done();
      });
    });

    it('should be updated via updateAttributes', function(done) {
      var updatedAt;
      Book.create({name:'book 1', type:'fiction'}, function(err, book) {
        assert.ifError(err);
        assert.ok(book.updatedAt);
        updatedAt = book.updatedAt;

        // ensure we give enough time for the updatedAt value to be different
        setTimeout(function pause() {
          book.updateAttributes({ type:'historical-fiction' }, function(err, b) {
            assert.ifError(err);
            assert.ok(b.updatedAt);
            assert.ok(b.updatedAt.getTime() > updatedAt.getTime());
            done();
          });
        }, 1);
      });
    });

    it('should update bulk model updates at once', function(done) {
      var createdAt1, createdAt2, updatedAt1, updatedAt2;
      Book.create({name:'book 1', type:'fiction'}, function(err, book1) {
        assert.ifError(err);
        createdAt1 = book1.createdAt;
        updatedAt1 = book1.updatedAt;
        setTimeout(function pause1() {
          Book.create({name:'book 2', type:'fiction'}, function(err, book2) {
            assert.ifError(err);
            createdAt2 = book2.createdAt;
            updatedAt2 = book2.updatedAt;
            assert.ok(updatedAt2.getTime() > updatedAt1.getTime());
            setTimeout(function pause2() {
              Book.updateAll({ type:'fiction' }, { type:'romance' }, function(err, count) {
                assert.ifError(err);
                assert.equal(createdAt1.getTime(), book1.createdAt.getTime());
                assert.equal(createdAt2.getTime(), book2.createdAt.getTime());
                Book.find({ type:'romance' }, function(err, books) {
                  assert.ifError(err);
                  assert.equal(books.length, 2);
                  books.forEach(function(book) {
                    // because both books were updated in the updateAll call
                    // our updatedAt1 and updatedAt2 dates have to be less than the current
                    assert.ok(updatedAt1.getTime() < book.updatedAt.getTime());
                    assert.ok(updatedAt2.getTime() < book.updatedAt.getTime());
                  });
                  done();
                });
              });
            }, 1);

          });
        }, 1);
      });
    });

  });

  describe('boot options', function() {

    beforeEach(function(done) {
      Book.destroyAll(done);
    });

    it('should use createdOn and updatedOn instead', function(done) {
      Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: { createdAt:'createdOn', updatedAt:'updatedOn' } } }
        );
      Book.create({name:'book 1', type:'fiction'}, function(err, book) {
        assert.ifError(err);

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

    it('should default required on createdAt and updatedAt ', function(done) {
      Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: true } }
        );
      assert.equal(Book.definition.properties.createdAt.required, true);
      assert.equal(Book.definition.properties.updatedAt.required, true);
      done();
    });

    it('should have optional createdAt and updatedAt', function(done) {
      Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: { required: false } } }
        );
      assert.equal(Book.definition.properties.createdAt.required, false);
      assert.equal(Book.definition.properties.updatedAt.required, false);
      done();
    });
    
  });

  describe('operation hook options', function() {

    beforeEach(function() {
      Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: true } }
        );
    });

    afterEach(function(done) {
      Book.destroyAll(done);
    });

    it('should skip changing updatedAt when option passed', function(done) {
      var updated, book;
      Book.create({name:'book 1', type:'fiction'}, function(err, book1) {
        assert.ifError(err);

        assert.ok(book1.updatedAt);

        updated = book1.updatedAt;
        book = book1.toObject();
        book.name = 'book 2';

        Book.updateOrCreate(book, {skipUpdatedAt: true}, function(err, book2) {
          assert.ifError(err);

          assert.ok(book2.updatedAt);
          assert.equal(updated.getTime(), book2.updatedAt.getTime());
          done();
        });

      });
    });

  });

});
