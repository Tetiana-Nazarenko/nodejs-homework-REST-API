const express = require('express');

const router = express.Router();

const contacts = require('../../models/contacts');

const { schema } = require('../../schema/contacts');

router.get('/', async (req, res, next) => {
    const data = await contacts.listContacts();

    data ? res.json(data) : res.status(500).json({ message: 'Not found!' });
});

router.get('/:contactId', async (req, res, next) => {
    const data = await contacts.getContactById(req.params.contactId);
    data ? res.json(data) : next();
});

router.post('/', async (req, res, next) => {
    const response = schema.validate(res.body);

    if (typeof response.error !== 'undefined') {
        return res.status(400).json({ message: 'missing required name field' });
    }

    const data = await contacts.addContact(response.value);
    res.status(201).json(data);
});

router.delete('/:contactId', async (req, res, next) => {
    const data = await contacts.removeContact(req.params.contactId);

    data ? res.json({ message: 'contact deleted' }) : next();
});

router.put('/:contactId', async (req, res, next) => {
    const response = schema.validate(req.body);

    if (Object.keys(response.value).length === 0) {
        return res.status(400).json({ message: 'missing fields' });
    }
    if (typeof response.error === 'undefined') {
        const data = await contacts.updateContact(
            req.params.contactId,
            req.body
        );
        return res.json(data);
    }
    res.json({ message: response.error.details[0].message });
});

router.patch('/:contactId/favorite', async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
        return res.status(400).json({ message: 'missing field favorite' });
    }
    try {
        const updatedContact = await contacts.updateStatusContact(contactId, {
            favorite,
        });

        if (updatedContact) {
            return res.status(200).json(updatedContact);
        } else {
            return res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        console.error('Помилка при оновленні статусу контакту:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
