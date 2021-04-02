const express = require('express');
const router = express.Router();
const db = require('../db-mock/db');
const uuidv4 = require('uuid/v4');


router.get('/list', function (req, res) {
    res.send(db.shipments);
});

router.post('/add', function (req, res) {
    const request = req.body;
    const type = getType(request.type);
    const weight = getWeight(request.weight);
    const office = getOffice(request.office);

    const newShipment = {
        id: uuidv4(),
        type,
        origin: request.origin,
        destination: request.destination,
        delivered: request.delivered,
        weight,
        office
    };

    addToList(newShipment);
    res.send('Nova POSILjKA je uspesno dodata!');
});

router.post('/update', function (req, res) {
    const id = req.body.id;
    const updatedShipment = req.body;
    const shipment = getShipment(id);
    const updatedId = updateStatus(shipment, updatedShipment);
    res.send('POSILjKA (' + updatedId + ') je uspesno azurirana!');
});

router.post('/delete', function (req, res) {
    const id = req.body.id;
    const shipment = getShipment(id);
    const deletedId = deleteShipment(shipment);
    res.send('POSILjKA (' + deletedId + ') je uspesno izbrisana!');
});

router.post('/get', function (req, res) {
    const id = req.body.id;
    const shipment = getShipment(id);
    res.send(shipment);
});

function updateStatus(shipment, updatedShipment) {
    const pos = db.shipments.indexOf(shipment);
    db.shipments[pos] = updatedShipment;
    return shipment.id;
}

function getShipment(id) {
    const shipment = db.shipments.filter(element => element.id === id);

    if (shipment.length === 0) {
        const err = new Error('Ne postoji trazena POSILjKA (' + id + ')');
        err.status = 404;
        throw err;
    } else {
        return shipment[0];
    }
}

function deleteShipment(shipment) {
    const pos = db.shipments.indexOf(shipment);
    db.shipments.splice(pos, 1);
    return shipment.id;
}

function getType(selection) {
    const type = db.types.filter(type => type.id === selection);

    if (type.length === 0) {
        const err = new Error('Ne postoji trazena VRSTA POSILjKE (' + selection + ')');
        err.status = 500;
        throw err;
    } else {
        return type[0];
    }
}

function getWeight(selection) {
    const weight = db.weights.filter(weight => weight.id === selection);

    if (weight.length === 0) {
        const err = new Error('Ne postoji trazena KATEGORIJA TEZINE POSILjKE (' + selection + ')');
        err.status = 500;
        throw err;
    } else {
        return weight[0];
    }
}

function getOffice(selection) {
    const office = db.offices.filter(office => office.id === selection);

    if (office.length === 0) {
        const err = new Error('Ne postoji POSTA (' + selection + ') za trazenu POSILjKU');
        err.status = 500;
        throw err;
    } else {
        return office[0];
    }
}

function addToList(shipment) {
    db.shipments.push(shipment);
}

module.exports = router;