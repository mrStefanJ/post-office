const uuidv4 = require('uuid/v4');

const types = [
    { id: 0, name: 'Pismo' },
    { id: 1, name: 'Paket' }
];

const weights = [
    { id: 0, desc: 'Manje od 1 kg' },
    { id: 1, desc: 'Izmedu 1 i 5 kg' },
    { id: 2, desc: 'Vise od 5 kg' }
];

const offices = [
    {
        id: uuidv4(),
        PLZ: 11042,
        name: 'Vozdovac'
    },
    {
        id: uuidv4(),
        PLZ: 11050,
        name: 'Zvezdara'
    },
    {
        id: uuidv4(),
        PLZ: 11073,
        name: 'Novi Beograd'
    }
];

const shipments = [
    {
        id: uuidv4(),
        type: types[0],
        origin: true,
        destination: false,
        delivered: false,
        weight: weights[0],
        office: offices[0]
    },
    {
        id: uuidv4(),
        type: types[1],
        origin: true,
        destination: true,
        delivered: false,
        weight: weights[1],
        office: offices[1]
    },
    {
        id: uuidv4(),
        type: types[1],
        origin: true,
        destination: true,
        delivered: false,
        weight: weights[2],
        office: offices[2]
    }
];

module.exports = {
    types,
    weights,
    shipments,
    offices,
};