

const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  },
  //debug: true, 
};
const database = knex(knexConfig);

router.get('/', (req, res) => {
  // returns a promise
  database('cohorts')
    .then( cohorts => {
      res.status(200).json(cohorts);
    })
    .catch( error => { 
      res.status(500).json(error);
     })
  // get the cohorts from the database
  //res.send('Write code to retrieve all cohorts');
});

router.get('/:id', (req, res) => {
  // retrieve a role by id
  let id = req.params.id;
  database('cohorts').where(({ id }))
  .first() //prevents it from being passed back as an array
  .then( role => { res.status(200).json(role)})
  .catch(error => { res.status(500).json(error); })
});

router.get('/:id/students', (req, res) => {
    // retrieve a role by id
    let id = req.params.id;
    database('students').where(({ cohort_id: id }))
    //.first() //prevents it from being passed back as an array
    .then( students => { res.status(200).json(students)})
    .catch(error => { res.status(500).json(error); })
  });

router.post('/', (req, res) => {
  // add a role to the database
  // get back an array with the last id generated: ex: [3]
  database('cohorts').insert(req.body)
    .then( ids => { const id = ids[0];  
                    database('cohorts').where({ id })
                    .first()
                    .then( role => {
                        res.status(200).json(role);
                    });
                  
                  })//end then
    .catch( error => { res.status(200).json(error) })
  // res.send('Write code to add a role');
});

router.put('/:id', (req, res) => {
  // update cohorts
  database('cohorts').where( {id: req.params.id }).update(req.body).then( count => {
    if( count > 0 ) { //IF SUCCESful returns the number of records changed
        res.status(200).json( count)
    } else {
        res.status(404).json({ message: "record not found" })
    }
}) //end then
.catch(error => { res.status(500).json(error)})
  //res.send('Write code to modify a role');
});

router.delete('/:id', (req, res) => {
  // remove cohorts (inactivate the role)
  database('cohorts').where({ id: req.params.id })
             .del().then( count => { 
                            if (count > 0) {
                              res.status(204).end();
                            }
                            else {
                              res.status(404).json( {message: 'Record not found'});
                            }
             })//end then
             .catch( error => { res.status(500).json(error) ; })
  //res.send('Write code to remove a role');
});

module.exports = router;