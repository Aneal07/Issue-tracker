'use strict';


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const { Schema } = mongoose;

const issueSchema = new Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean
});




module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res){
      let project = req.params.project;
      var Issue = mongoose.model(project, issueSchema);
      var { _id, issue_title, issue_text, created_by, assigned_to, status_text, created_on, updated_on, open } = req.query;
      var queries = {_id:_id, issue_title: issue_title, issue_text: issue_text, created_by:created_by, assigned_to: assigned_to, status_text: status_text, created_on: created_on, updated_on: updated_on, open: open}
      var filters = {}
      Object.entries(queries).forEach((item)=>{
        if(item[1]!==undefined){
          filters[item[0]] = item[1]
        }
      })
      if(filters.length == 0){
        Issue.find({}, (err, arr)=>
        {
          res.send(arr)
        })
      }else{
      Issue.find(filters, (err, arr)=>
          {
           res.send(arr);
          });
      }

    })

    .post(function (req, res){
      let project = req.params.project;
      var Issue = mongoose.model(project, issueSchema);
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
        res.json({error: 'required field(s) missing'})
      }else{
      Issue.create(
        {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to ? req.body.assigned_to : "",
          status_text: req.body.status_text ? req.body.status_text : "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true

        }, (err, issue)=>{
        if (err) return console.error(err);
        res.json(
          {
          issue_title: issue.issue_title,
          issue_text: issue.issue_text,
          created_by: issue.created_by,
          assigned_to: issue.assigned_to,
          status_text: issue.status_text,
          created_on: issue.created_on,
          updated_on: issue.updated_on,
          open: issue.open,
          _id: issue._id
          });
        return issue;
        })
      }

    })

    .put(function (req, res){
      let project = req.params.project;
      var Issue = mongoose.model(project, issueSchema);
      if (!req.body._id){
        res.json({error: 'missing _id'})
      }else{
            if(!req.body.issue_title && 
              !req.body.issue_text &&
              !req.body.created_by &&
              !req.body.assigned_to &&
              !req.body.status_text &&
              req.body.open==undefined){

              res.json({error: 'no update field(s) sent', _id: req.body._id})
            }else
            {    


        Issue.exists({_id: req.body._id}, (err, exists)=>{
          if(!exists){
            res.json({error: 'could not update', _id: req.body._id})
            return err
          }else{

            if(req.body.issue_title){
                Issue.findOneAndUpdate({_id: req.body._id},{issue_title: req.body.issue_title, updated_on: new Date()},(err,data)=>{
                    console.log("updated title")
                    return data
                })
                }

            if(req.body.issue_text){
                Issue.findOneAndUpdate({_id: req.body._id},{issue_text: req.body.issue_text, updated_on: new Date()},(err,data)=>{
                    console.log("updated text")
                    return data
                })
                }
            if(req.body.created_by){
                Issue.findOneAndUpdate({_id: req.body._id},{created_by: req.body.created_by, updated_on: new Date()},(err,data)=>{
                    console.log("updated created_by")
                    return data
                })
                }
            if(req.body.assigned_to){
                Issue.findOneAndUpdate({_id: req.body._id},{assigned_to: req.body.assigned_to, updated_on: new Date()},(err,data)=>{
                    console.log("updated assigned_to")
                    return data
                })
                }
            if(req.body.status_text){
                Issue.findOneAndUpdate({_id: req.body._id},{status_text: req.body.status_text, updated_on: new Date()},(err,data)=>{
                    console.log("updated status_text")
                    return data
                })
                }
            if(req.body.open!== undefined){
                Issue.findOneAndUpdate({_id: req.body._id},{open: req.body.open, updated_on: new Date()},(err,data)=>{
                    console.log("updated open")
                    return data
                })
                }


            res.json({result: 'successfully updated', _id: req.body._id})


          }
        }) 
      }



    }})

    .delete(function (req, res){
      let project = req.params.project;
      var Issue = mongoose.model(project, issueSchema);
      if (!req.body._id){
        res.json({error: 'missing _id'})
      }else{
        Issue.exists({_id: req.body._id}, (err, exists)=>{
          if(!exists){
            res.json({error: 'could not delete', _id: req.body._id})
            return err
          }else{
            Issue.findOneAndRemove({_id:req.body._id},(err, data)=>{
              res.json({result: 'successfully deleted', _id: req.body._id})
            })
          }
        })
      }
    });

};
