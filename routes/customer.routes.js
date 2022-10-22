const Customer = require("../models/Customer.model");
const Purchase = require("../models/Purchase.model");
const router = require("express").Router();
const mongoose = require("mongoose");

// =========== CREATE A NEW CUSTOMER ============

router.get('/customers/create', (req, res, next) => {
    res.render('customers/new-customer')
})

router.post('/customers/create', (req, res ,next) => {
    console.log(req.body);
    const customerToCreate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        apartmentNumber: req.body.apartmentNumber,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    }

    Customer.create(customerToCreate)
    .then(newlyCreatedCustomer => {
        res.redirect('/customers/customers', {newlyCreatedCustomer});
    }).catch(err => {
        res.redirect('/customers/create');
    })
})


// =========== READ LIST OF CUSTOMERS ============

router.get('/customers', (req, res, next) => {
    Customer.find()
    .then((customersFromDb) => {
        console.log('Customers from DB ===>' , {customersFromDb});
        customersData = {customers: customersFromDb}
        res.render('customers/customers', customersData);
    })
    .catch(error => {
        console.log({error});
    })
})

// ============ READ SPECIFIC CUSTOMER DETAILS ============

router.get('/customers/:customerId', (req, res, next) => {
    console.log('params: req.params.customerId ===> ', {params: req.params.customerId});

    Customer.findById(req.params.customerId)
    .populate('purchases')
    .then(customersFromDb => {
        console.log('The clicked on customer: ', customersFromDb);
        res.render('customers/customer-details', customersFromDb);
    })
    .catch(error => {
        console.log({error});
    })
})


// =========== UPDATE CUSTOMER DETAILS ============

router.get('/customers/:id/update-customer', (req, res, next) => {
    Customer.findById(req.params.id)
    .then((customerFromDb) => {
        console.log('Update customer ===> ', customerFromDb);
        res.render('customers/update-customer', customerFromDb)
    })
})

router.post('/customers/:id', (req, res, next)=>{
    const customerToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        apartmentNumber: req.body.apartmentNumber,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    }

    Customer.findByIdAndUpdate(req.params.id, customerToUpdate)
    .then(theUpdatedCustomer => {
        console.log('The updated customer ===> ', theUpdatedCustomer);
        res.redirect(`/customers/${theUpdatedCustomer.id}`);
    }).catch(error => {
        console.log({error});
    })
})


// =========== DELETE CUSTOMER ============

router.post('/customers/delete/:customerId', (req, res, next) => {
  
    Customer.findByIdAndDelete(req.params.customerId)
    .then(() => {res.redirect('/customers')})
    .catch(err => console.log(err));
});


module.exports = router;
