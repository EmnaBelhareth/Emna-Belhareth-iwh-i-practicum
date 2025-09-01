require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/********  ROUTE 1 - Homepage to display all Existing Plants in Hubspot ********/ 
 
app.get('/', async (req, res) => {
    const properties = ['plant_name', 'type', 'growthstage', 'family'].join(',');

    const url = `https://api.hubapi.com/crm/v3/objects/p_plants?properties=${properties}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    console.log("url",url)

    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Plants Homepage', data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching plants');
    }
});

/******** ROUTE 2 - Render the HTML form to create a Plant ********/
 
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});


/******** ROUTE 3 - Handle form submission to create a new Plant ********/ 

app.post('/update-cobj', async (req, res) => {
    const newPlant = {
    properties: {
        plant_name: req.body.plant_name,
        type: req.body.type,
        family: req.body.family,
        growthstage: req.body.growthstage
    }
};


    const url = 'https://api.hubapi.com/crm/v3/objects/p_plants';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, newPlant, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating plant');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
