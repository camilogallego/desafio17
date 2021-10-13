const productsOptions = require('./options/mariaDB');
const productsKnex = require('knex')(productsOptions);

const products = [
    {
        title: "Producto 1",
        price: 2310.91,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png"
    },
    {
        title: "Producto 2",
        price: 9999.99,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-128.png"
    },
    {
        title: "Producto 3",
        price: 11500.00,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/plane-paper-toy-science-school-128.png"
    },
    {
        title: "Producto 4",
        price: 488.99,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-128.png"
    },
    {
        title: "Producto 5",
        price: 12257.00,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/plane-paper-toy-science-school-128.png"
    }
];

productsKnex('products').insert(products)
    .then(() => console.log("Productos agregados"))
    .catch(e => {
        console.log(e)
        productsKnex.destroy();
    });