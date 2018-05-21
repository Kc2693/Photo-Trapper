const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use('/', express.static('public'));

app.locals.title = 'Photo Trapper Keeper';


app.get('/api/v1/photos', (request, response) => {
  database('photos').select()
    .then(photos => response.status(200).json(photos))
    .catch(error => response.status(500).json(error));
});

app.get('/api/v1/photos/:id', (req, res) => {
  const { id } = req.params;
  database('photos').select().where('id', id)
    .then((photo) => {
      res.status(200).json(photo);
    })
    .catch((error) => {
      res.status(500).json({error: 'Error retrieving photo'});
    });
});

app.post('/api/v1/photos', (request, response) => {
  const photo = request.body;

  for (let requiredParameter of ['title', 'url']) {
    if (!photo[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `You're missing a ${requiredParameter} property.`});
    }
  }

  database('photos').insert(photo, 'id')
  .then(photo => response.status(201).json({ id: photo[0]}))
  .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/photos/:id', (request, response) => {
  const { id } = request.params;

  if (!id) {
    return response
      .status(422)
      .send({ error: `You're missing an id property.` });
  }

  database('photos').where('id', id).del()
    .then(id => response.status(204).json({ message: `Deleted photo with id ${request.body.id}` }))
    .catch(error => response.status(404).json({error: 'Photo not found'}));
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = { app, database };
