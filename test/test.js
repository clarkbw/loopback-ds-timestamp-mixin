var test = require('tap').test;

var path = require('path');
var SIMPLE_APP = path.join(__dirname, 'fixtures', 'simple-app');
var app = require(path.join(SIMPLE_APP, 'server/server.js'));

test('loopback datasource timestamps', function(tap) {
  'use strict';

  var Widget = app.models.Widget;

  tap.test('createdAt', function(t) {

    t.test('should exist on create', function(tt) {
      Widget.destroyAll(function() {
        Widget.create({name: 'book 1', type: 'fiction'}, function(err, book) {
          tt.error(err);
          tt.ok(book.createdAt);
          tt.type(book.createdAt, Date);
          tt.end();
        });
      });
    });

    t.test('should not change on save', function(tt) {
      Widget.destroyAll(function() {
        Widget.create({name:'book 1', type:'fiction'}, function(err, book) {
          tt.error(err);
          tt.ok(book.createdAt);
          book.name = 'book inf';
          book.save(function(err, b) {
            tt.equal(book.createdAt, b.createdAt);
            tt.end();
          });
        });
      });
    });

    t.test('should not change on update', function(tt) {
      Widget.destroyAll(function() {
        Widget.create({name:'book 1', type:'fiction'}, function(err, book) {
          tt.error(err);
          tt.ok(book.createdAt);
          book.updateAttributes({ name:'book inf' }, function(err, b) {
            tt.error(err);
            tt.equal(book.createdAt, b.createdAt);
            tt.end();
          });
        });
      });
    });

    t.test('should not change on upsert', function(tt) {
      Widget.destroyAll(function() {
        Widget.create({name:'book 1', type:'fiction'}, function(err, book) {
          tt.error(err);
          tt.ok(book.createdAt);
          Widget.upsert({id: book.id, name:'book inf'}, function(err, b) {
            tt.error(err);
            tt.equal(book.createdAt.getTime(), b.createdAt.getTime());
            tt.end();
          });
        });
      });
    });

    t.test('should not change with bulk updates', function(tt) {
      var createdAt;
      Widget.destroyAll(function() {
        Widget.create({name:'book 1', type:'fiction'}, function(err, book) {
          tt.error(err);
          tt.ok(book.createdAt);
          Widget.updateAll({ type:'fiction' }, { type:'non-fiction' }, function(err) {
            tt.error(err);
            Widget.findById(book.id, function(err, b) {
              tt.error(err);
              tt.equal(book.createdAt.getTime(), b.createdAt.getTime());
              tt.end();
            });
          });
        });
      });
    });

    t.end();

  });

  tap.test('updatedAt', function(t) {

    t.test('should exist on create', function(tt) {
      Widget.destroyAll(function() {
        Widget.create({name:'book 1', type:'fiction'}, function(err, book) {
          tt.error(err);
          tt.ok(book.updatedAt);
          tt.type(book.updatedAt, Date);
          tt.end();
        });
      });
    });

    t.test('should be updated via updateAttributes', function(tt) {
      var updatedAt;
      Widget.destroyAll(function() {
        Widget.create({name:'book 1', type:'fiction'}, function(err, book) {
          tt.error(err);
          tt.ok(book.updatedAt);
          updatedAt = book.updatedAt;

          // ensure we give enough time for the updatedAt value to be different
          setTimeout(function pause() {
            book.updateAttributes({ type:'historical-fiction' }, function(err, b) {
              tt.error(err);
              tt.ok(b.updatedAt);
              tt.ok(b.updatedAt.getTime() > updatedAt.getTime());
              tt.end();
            });
          }, 1);
        });
      });
    });

    t.test('should update bulk model updates at once', function(tt) {
      var createdAt1, createdAt2, updatedAt1, updatedAt2;
      Widget.destroyAll(function() {
        Widget.create({name:'book 1', type:'fiction'}, function(err, book1) {
          tt.error(err);
          createdAt1 = book1.createdAt;
          updatedAt1 = book1.updatedAt;
          setTimeout(function pause1() {
            Widget.create({name:'book 2', type:'fiction'}, function(err, book2) {
              tt.error(err);
              createdAt2 = book2.createdAt;
              updatedAt2 = book2.updatedAt;
              tt.ok(updatedAt2.getTime() > updatedAt1.getTime());
              setTimeout(function pause2() {
                Widget.updateAll({ type:'fiction' }, { type:'romance' }, function(err, count) {
                  tt.error(err);
                  tt.equal(createdAt1.getTime(), book1.createdAt.getTime());
                  tt.equal(createdAt2.getTime(), book2.createdAt.getTime());
                  Widget.find({ type:'romance' }, function(err, books) {
                    tt.error(err);
                    tt.equal(books.length, 2);
                    books.forEach(function(book) {
                      // because both books were updated in the updateAll call
                      // our updatedAt1 and updatedAt2 dates have to be less than the current
                      tt.ok(updatedAt1.getTime() < book.updatedAt.getTime());
                      tt.ok(updatedAt2.getTime() < book.updatedAt.getTime());
                    });
                    tt.end();
                  });
                });
              }, 1);
            });
          }, 1);
        });
      });
    });

    t.end();

  });

  tap.test('boot options', function(t) {

    var dataSource = app.models.Widget.getDataSource();

    t.test('should use createdOn and updatedOn instead', function(tt) {

      var Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: { createdAt:'createdOn', updatedAt:'updatedOn' } } }
      );
      Book.destroyAll(function() {
        Book.create({name:'book 1', type:'fiction'}, function(err, book) {
          tt.error(err);

          tt.type(book.createdAt, 'undefined');
          tt.type(book.updatedAt, 'undefined');

          tt.ok(book.createdOn);
          tt.type(book.createdOn, Date);

          tt.ok(book.updatedOn);
          tt.type(book.updatedOn, Date);

          tt.end();
        });
      });
    });

    t.test('should default required on createdAt and updatedAt ', function(tt) {
      var Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: true } }
      );
      tt.equal(Book.definition.properties.createdAt.required, true);
      tt.equal(Book.definition.properties.updatedAt.required, true);
      tt.end();
    });

    t.test('should have optional createdAt and updatedAt', function(tt) {
      var Book = dataSource.createModel('Book',
        { name: String, type: String },
        { mixins: {  TimeStamp: { required: false } } }
      );
      tt.equal(Book.definition.properties.createdAt.required, false);
      tt.equal(Book.definition.properties.updatedAt.required, false);
      tt.end();
    });

    t.end();

  });

  tap.test('operation hook options', function(t) {

    t.test('should skip changing updatedAt when option passed', function(tt) {
      Widget.destroyAll(function() {
        Widget.create({name:'book 1', type:'fiction'}, function(err, book1) {
          tt.error(err);

          tt.ok(book1.updatedAt);

          var book = {id: book1.id, name:'book 2'};

          Widget.updateOrCreate(book, {skipUpdatedAt: true}, function(err, book2) {
            tt.error(err);

            tt.ok(book2.updatedAt);
            tt.equal(book1.updatedAt.getTime(), book2.updatedAt.getTime());
            tt.end();
          });

        });
      });
    });

    t.end();

  });

  tap.end();

});
