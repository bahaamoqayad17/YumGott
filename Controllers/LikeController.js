const factory = require("./FactoryHandler");
const Like = require("../Models/Like");

exports.index = factory.index(Like);
exports.create = factory.create(Like);
exports.show = factory.show(Like);
exports.update = factory.update(Like);
exports.delete = factory.delete(Like);
