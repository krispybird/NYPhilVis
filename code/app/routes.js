var philProgram = require('./models/fetcher');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes	
	// sample api route
   app.get('/api/data', function(req, res) {
    // use mongoose to get all info in the database
    /*philProgram.find({}, {'_id': 0, 'school_state': 1, 'resource_type': 1, 'poverty_level': 1, 'date_posted': 1, 'total_donations': 1, 'funding_status': 1, 'grade_level': 1}, function(err, subjectDetails)*/ 

    /*var cursor = philProgram.find();
    cursor.each(function(err, details){
      if (err){
        res.send(err);
      }
      res.json(details);
    });*/
    
    philProgram.find({}, function(err, details) {
     // if there is an error retrieving, send the error.
         // nothing after res.send(err) will execute

        if (err){
          res.send(err);
        }
        res.json(details); // return all info in JSON format


      /*philProgram.find(
        { "$match": { "_id": userid } },
        { "$group": { "_id": , totalConcerts: {$sum: }
        ).count(err, details){*/
        /*philProgram.find(req.params, req.options, function(err, details){


        if (err){
          res.send(err);
        }
        res.json(details);

    });*/
   });

  });



 // frontend routes =========================================================
  /* app.get('*', function(req, res) {
  res.sendfile('./public/login.html');
 });*/
}