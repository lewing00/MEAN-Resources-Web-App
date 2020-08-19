var express = require('express');
var router = express.Router();

/* GET resourcelist. */
router.get('/resourcecollection', function(req, res) {
  var db = req.db;
  var collection = db.get('resourcecollection');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

/* POST to addresource. */
router.post('/addresource', function(req, res) {
  var db = req.db;
  var collection = db.get('resourcecollection');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* DELETE to deleteresource. */
router.delete('/deleteresource/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('resourcecollection');
  var resourceToDelete = req.params.id;
  collection.remove({ '_id' : resourceToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;
