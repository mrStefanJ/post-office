const express = require('express');
const router = express.Router();
const db = require('../db-mock/db');
const uuidv4 = require('uuid/v4');

router.get('/list', function (req, res) {
    res.send(db.offices);
});

router.post('/add', function (req, res) {
    const request = req.body;

    const newOffice = {
        id: uuidv4(),
        PLZ: request.PLZ,
        name: request.name
    };

    addToList(newOffice);
    res.send('Nova POSTA je uspesno dodata!');
});

router.post('/update', function (req, res) {
    const id = req.body.id;
    const updatedOffice = req.body;
    const office = getOffice(id);
    console.log(office);
    const updatedId = updateOffice(office, updatedOffice);
    res.send('POSTA (' + updatedId + ') je uspesno azurirana!');
});

router.post('/delete', function (req, res) {
    const id = req.body.id;
    const office = getOffice(id);
    const deletedId = deleteOffice(office);
    res.send('POSTA (' + deletedId + ') je uspesno izbrisana!');
});

router.post('/get', function (req, res) {
    const id = req.body.id;
    const office = getOffice(id);
    res.send(office);
});

function updateOffice(office, updatedOffice) {
    const pos = db.offices.indexOf(office);
    db.offices[pos] = updatedOffice;
    return office.id;
}

function deleteOffice(office) {
    const pos = db.offices.indexOf(office);
    db.offices.splice(pos, 1);
    return office.id;
}

function getOffice(selection) {
    const office = db.offices.filter(office => office.id === selection);
    if (office.length === 0) {
        const err = new Error('Ne postoji trazena POSTA (' + selection + ')');
        err.status = 500;
        throw err;
    } else {
        return office[0];
    }
}

function addToList(shipment) {
    db.offices.push(shipment);
}

module.exports = router;
