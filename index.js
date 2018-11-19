//--  Dependencies --//
import _ from 'lodash';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';

//-- Fake Data --//
import fakeData from './fakeData';

//-- DB Models --//
import HotelModel from './model/Hotel';

//-- DB Connect --//
const dbConnect = (callback) =>
    mongoose.connect('mongodb://localhost/AlMundo', { useNewUrlParser: true })
        .then(db => callback(db))
        .catch(error => console.log(error));

//-- Port --//
const port = process.env.NODE_PORT || 3000;

//-- App --//
const app = express();

//-- Start Server App --//
function init(dataBase) {
    console.log('Connected With DataBase');
    console.log(`Server Listening on http://localhost:${port}`);
}

function saveHotel(req, res, _hotel) {
    _hotel.save(error => {
        if (error) console.log('Error: no es posible crear un nuevo hotel');
        else console.log('Success: se ha creado un nuevo hotel')
    });
}

//-- Public Directory --//
app.use(express.static(path.join(__dirname, '/../public')));

//-- Middleware's  --//
app
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

    //-- Routes  --//
    //  -- End Points || Queries --//

    .get('/getAllHotels', (req, res) => {
        HotelModel.find({}, (error, hotels) => {
            if (!!hotels) console.log('Warning: Sin Hoteles');

            if (error) res
                .status(404)
                .send({ message: 'Error: no se pueden obtener los hoteles' })
                .end();

            if (_.isEmpty(hotels)) fakeData.hotels.forEach((hotel, index, arr) => {
                const _hotel = new HotelModel(hotel);

                saveHotel(req, res, _hotel);
            });

            else res
                .status(200)
                .json({ message: 'Success: se han obtenido todo los hoteles', hotels })
                .end();
        });
    })

    .post('/createHotel', (req, res) => {
        if (req.body) {
            HotelModel.find({}, (error, hotels) => {
                if (error) res
                    .status(404)
                    .send({ message: 'Error: no es posible obtener los hoteles' })
                    .end();

                else {
                    const { name, image, stars, price } = req.body.hotel;
                    const _hotel = new HotelModel({ name, image, stars, price });

                    saveHotel(req, res, _hotel);
                }

                res
                    .status(200)
                    .send({ message: 'Success: se han obtenido todo los hoteles', hotels })
                    .end();
            });
        }
    });

//-- Connecting With DataBase --//
dbConnect((dataBase) =>
    //  Server Listening
    app.listen(port, (error) => {
        //-- Handler Error --//
        if (error) throw error;

        //-- Init Application --//
        init(dataBase);
    }));