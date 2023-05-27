const factory = require("./FactoryHandler");
const Cart = require("../Models/Cart");

exports.index = factory.index(Cart);
exports.create = factory.create(Cart);
exports.show = factory.show(Cart);
exports.update = factory.update(Cart);
exports.delete = factory.delete(Cart);
