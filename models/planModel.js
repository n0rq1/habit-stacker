const {required} = require('joi');
const mongoose = require('mongoose');


const habitSchema = mongoose.Schema({

});

module.exports = mongoose.model('Plan',  planSchema);