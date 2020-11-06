const express = require('express');
const bodyParser = require(`body-parser`);
const uuid = require(`uuid`);
const data = require('./data.js');

const app = express();

app.use(bodyParser.json());

app.get(`/products`, (req, res) => {
    if(req.query.priceFrom && req.query.priceTo) {
        res.json(data.pizzas.filter(pizza => pizza.price >= parseInt(req.query.priceFrom) && pizza.price <= parseInt(req.query.priceTo)));
    } else {
        res.json(data.pizzas);
    }
})
app.post(`/order`, (req, res) => {
    const id = uuid.v4();
    data.orders.push({
        id,
        createdAt: Date.now(),
        products: req.body.products,
        time: req.body.time,
        address: req.body.address,
        status: 0
    });
    res.send({ status: `success`, orderId: id });
})
app.get(`/order/:orderId`, (req, res) => {
    const order = data.orders.find(order => order.id === req.params.orderId);
    if (!order) {
        res.status(404).json({ message: `order not found` })
    } else {
        res.send(order);
    }
})

app.delete(`/order/:orderId`, (req, res) => {
    const order = data.orders.find(order => order.id === req.params.orderId);
    if (!order) {
        res.status(404).json({ message: `order not found` })
    } else {
        order.status = 5;
        res.send(order);
    }
})

// cancelar un pedido

app.listen(3000, () => {
    console.log(`application listening in port 3000!`)
})

/**
 * Order status
 * 0: created
 * 1: in_progress
 * 2: completed
 * 3: in route
 * 4: delivered
 * 5: canceled
 */