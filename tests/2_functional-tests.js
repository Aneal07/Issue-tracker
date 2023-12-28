const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

//CREATE
// Create an issue with every field: POST request to /api/issues/{project}
    suite('POST /api/issues/tests => ', function() {
      var testID
      test('Create an issue with every field(valid input)', function(done) {
       chai.request(server)
        .post('/api/issues/tests')
        .send(
          {issue_title: 'all fields',
          issue_text: 'full valid test',
          created_by: 'functional test',
          assigned_to: 'mocha chai',
          status_text: 'in progress'
          })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.issue_title, 'all fields');
          assert.equal(res.body.issue_text, 'full valid test');
          assert.equal(res.body.created_by, 'functional test');
          assert.equal(res.body.assigned_to, 'mocha chai');
          assert.equal(res.body.status_text, 'in progress');
          assert.isNumber(Date.parse(res.body.created_on));
          assert.isNumber(Date.parse(res.body.updated_on));
          assert.equal(res.body.open, true);
          testID = res.body._id
          done();
        });
      });

// Create an issue with only required fields: POST request to /api/issues/{project}
      test('Create an issue with only required fields(valid input)', function(done) {
       chai.request(server)
          .keepOpen()
        .post('/api/issues/tests')
        .send(
          {issue_title: 'all fields',
          issue_text: 'full valid test',
          created_by: 'functional test',
          })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.issue_title, 'all fields');
          assert.equal(res.body.issue_text, 'full valid test');
          assert.equal(res.body.created_by, 'functional test');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.isNumber(Date.parse(res.body.created_on));
          assert.isNumber(Date.parse(res.body.updated_on));
          assert.equal(res.body.open, true);
          done();
        });
      });

// Create an issue with missing required fields: POST request to /api/issues/{project}
      test('Create an issue with missing required fields(invalid input)', function(done) {
       chai.request(server)
          .keepOpen()
        .post('/api/issues/tests')
        .send(
          {issue_title: 'all fields',
          created_by: 'functional test',
          })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.error, 'required field(s) missing');

          done();
        });
      });
//VIEW
// View issues on a project: GET request to /api/issues/{project}
      test('View all issues (valid input)', function(done) {
       chai.request(server)
          .keepOpen()
        .get('/api/issues/tests')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.isArray(res.body);

          done();
        });
      });
// View issues on a project with one filter: GET request to /api/issues/{project}
      test('View issues with one filter(valid input)', function(done) {
       chai.request(server)
          .keepOpen()
        .get('/api/issues/tests')
        .query({
          issue_title: 'all fields'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.isArray(res.body);
          res.body.forEach((item)=>{
            assert.equal(item.issue_title, 'all fields')
          })

          done();
        });
      });
// View issues on a project with multiple filters: GET request to /api/issues/{project}
      test('View issues with multiple filters (valid input)', function(done) {
       chai.request(server)
          .keepOpen()
        .get('/api/issues/tests')
        .query({
          issue_title: 'all fields',
          issue_text: 'full valid test'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.isArray(res.body);
          res.body.forEach((item)=>{
            assert.equal(item.issue_title, 'all fields')
            assert.equal(item.issue_text, 'full valid test')
          })

          done();
        });
      });
//UPDATE
// Update one field on an issue: PUT request to /api/issues/{project}
      test('update one field on an issue (valid input)', function(done) {

       chai.request(server)
          .keepOpen()
        .put('/api/issues/tests')
        .send(
          {_id: testID,
          issue_title: 'new title',
          })
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.result, 'successfully updated')
          assert.equal(res.body._id, testID)

          done();
        });
      });
// Update multiple fields on an issue: PUT request to /api/issues/{project}
      test('update multiple fields on an issue (valid input)', function(done) {

       chai.request(server)
          .keepOpen()
        .put('/api/issues/tests')
        .send(
          {_id: testID,
          issue_title: 'new title',
          issue_text: 'new text'
          })
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.result, 'successfully updated')
          assert.equal(res.body._id, testID)

          done();
        });
      });
// Update an issue with missing _id: PUT request to /api/issues/{project}
      test('update issue with missing id (invalid input)', function(done) {

       chai.request(server)
          .keepOpen()
        .put('/api/issues/tests')
        .send(
          {
          issue_title: 'new title'
          })
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.error, 'missing _id')


          done();
        });
      });
// Update an issue with no fields to update: PUT request to /api/issues/{project}
      test('update no fields on an issue (invalid input)', function(done) {

       chai.request(server)
          .keepOpen()
        .put('/api/issues/tests')
        .send(
          {_id: testID
          })
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.error, 'no update field(s) sent')
          assert.equal(res.body._id, testID)

          done();
        });
      });
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
      test('update an issue with an invalid id (invalid input)', function(done) {

       chai.request(server)
          .keepOpen()
        .put('/api/issues/tests')
        .send(
          {_id: 125654654,
          status_text: 'new text'
          })
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.error, 'could not update')
          assert.equal(res.body._id, 125654654)

          done();
        });
      });
//DELETE
// Delete an issue: DELETE request to /api/issues/{project}
    test('delete an issue (valid input)', function(done) {

       chai.request(server)
          .keepOpen()
        .delete('/api/issues/tests')
        .send(
          {_id: testID
          })
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.result, 'successfully deleted')
          assert.equal(res.body._id, testID)

          done();
        });
      });
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    test('delete an issue with an invalid id(invalid input)', function(done) {

       chai.request(server)
          .keepOpen()
        .delete('/api/issues/tests')
        .send(
          {_id: 125654654,
          issue_text: 'new text'
          })
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.error, 'could not delete')
          assert.equal(res.body._id, 125654654)

          done();
        });
      });
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
    test('delete an issue with missing id(invalid input)', function(done) {

       chai.request(server)
          .keepOpen()
        .delete('/api/issues/tests')
        .send(
          {})
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.error, 'missing _id')

          done();
        });
      });

    });

});
