  
// contactController.js
// Import contact model
Contact = require('./contactModel');
// Handle index actions

const Redis = require('redis');
const redisClient = Redis.createClient();
const expiration = 3600; //Expiration = 1hour

exports.index = function (req, res) {
    redisClient.get("contacts", async (err, data) => {
        
        if (err) {
            failureJson(res, err);
        } else if (data) {
            res.json({
                status: "success",
                message: "Users retrieved successfully!",
                data: JSON.parse(data)
            });
        } else {
            Contact.get(function (err, contacts) {
                if (err) {
                    res.json({
                        status: "error",
                        message: err,
                    });
                } else {
                    redisClient.setex("contacts", expiration, JSON.stringify(contacts));
                    res.json({
                        status: "success",
                        message: "Contact details retrieved successfully!",
                        data: contacts
                    });
                }
            });
        }
    })
};

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Handle create contact actions
exports.new = function (req, res) {
    var contact = new Contact();
    contact.name = req.body.name ? req.body.name : contact.name;
    contact.gender = req.body.gender;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    if (contact.name == null) {
        res.json({
            message: 'Please input a name.',
            data: contact
        });
    } else if (contact.email == null) {
        res.json({
            message: 'Please input an email',
            data: contact
        });
    } else if (contact.name.match(/\d+/g)) {
        res.json({
            message: 'Invalid name input!',
            data: contact
        });
    } else if (String(contact.gender).toLowerCase() != "male"
        && String(contact.gender).toLowerCase() != "female") {
        res.json({
            message: 'Please input biological gender. Male / Female',
            data: contact
        });
    } else if (!validateEmail(contact.email)) {
        res.json({
            message: 'Invalid email input!',
            data: contact
        });
    } else if (isNaN(contact.phone)) {
        res.json({
            message: 'Invalid phone input!',
            data: contact
        });
    } else {
        contact.save(function (err) {
            // Check for validation error
            if (err)
                res.json(err);
            else
                res.json({
                    message: 'New contact created!',
                    data: contact
                });
        });
    }
};
// Handle view contact info
exports.view = function (req, res) {
    Contact.findOne({email: req.params.email}, function (err, contact) {
        if (!contact || err) {
            res.json({
                status: "failed",
                message: 'Contact details not loaded!',
                data: contact
            });
        } else {
            res.json({
                status: "success",
                message: 'Contact details loaded!',
                data: contact
            });
        }
    });
};
// Handle update contact info
exports.update = function (req, res) {
    Contact.findOne({email: req.params.email}, function (err, contact) {
        if (!contact || err) {
            res.json({
                status: "failed",
                message: 'Contact details not updated!',
                data: contact
            });
        } else {
            contact.name = req.body.name ? req.body.name : contact.name;
            contact.gender = req.body.gender;
            contact.email = req.body.email;
            contact.phone = req.body.phone;
            // save the contact and check for errors
            if (contact.name == null) {
                res.json({
                    message: 'Please input a name.',
                    data: contact
                });
            } else if (contact.email == null) {
                res.json({
                    message: 'Please input an email',
                    data: contact
                });
            } else if (contact.name.match(/\d+/g)) {
                res.json({
                    message: 'Invalid name input!',
                    data: contact
                });
            } else if (contact.gender != null && String(contact.gender).toLowerCase() != "male"
                && String(contact.gender).toLowerCase() != "female") {
                res.json({
                    message: 'Please input biological gender. Male / Female',
                    data: contact
                });
            } else if (!validateEmail(String(contact.email))) {
                res.json({
                    message: 'Invalid email input!',
                    data: contact
                });
            } else if (contact.phone != null && isNaN(contact.phone)) {
                res.json({
                    message: 'Invalid phone input!',
                    data: contact
                });
            } else {
                contact.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        message: 'Contact details updated!',
                        data: contact
                    });
                });
            }
        }
       
    });
};
// Handle delete contact
exports.delete = function (req, res) {
    Contact.findOneAndRemove({email: req.params.email}, function (err, contact) {
        if (err) {
            res.json({
                status: "failed",
                message: 'Contact details not deleted!',
                data: contact
            });
        } else {
            if (contact) {
                res.json({
                    status: "success",
                    message: 'Contact deleted!',
                    data: contact
                });
            } else {
                res.json({
                    status: "failed",
                    message: 'Contact details can not be found!',
                    data: contact
                });
            }
        }
    });
};