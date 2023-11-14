const express = require('express');

const router = express.Router();

const ctrlContact = require('../../controllers/contact.js');

const isValidId = require('../../middlewares/isValidId');

router.get('/', ctrlContact.listContacts);

router.get('/:contactId', isValidId, ctrlContact.getContactById);

router.post('/', ctrlContact.addContact);

router.delete('/:contactId', isValidId, ctrlContact.removeContact);

router.put('/:contactId', isValidId, ctrlContact.updateContact);

router.patch('/:contactId', isValidId, ctrlContact.updateStatusContact);

module.exports = router;
