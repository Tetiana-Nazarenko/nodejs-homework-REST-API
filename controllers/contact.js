const Contact = require('../schema/contacts');
const { validSchema, patchSchema } = require('../schema/contacts');

async function listContacts(req, res, next) {
    try {
        const results = await Contact.find().exec();
        res.json(results);
    } catch (error) {
        next(error);
    }
}

async function getContactById(req, res, next) {
    try {
        const { contactId } = req.params;
        const contact = await Contact.findById(contactId);
        if (contact === null) {
            return next();
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
}

async function removeContact(req, res, next) {
    try {
        const { contactId } = req.params;
        const contact = await Contact.findByIdAndDelete(contactId);
        if (contact === null) {
            return next();
        }
        return res.json({ message: 'contactdeleted' });
    } catch (error) {
        next(error);
    }
}

async function addContact(req, res, next) {
    try {
        const response = validSchema.validate(req.body);
        if (typeof response.error !== 'undefined') {
            return res.status(400).json({ message: response.error.message });
        }
        const data = await Contact.create(response.value);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
}

async function updateContact(req, res, next) {
    try {
        const { contactId } = req.params;
        const response = validSchema.validate(req.body);
        const isEmptyRequest = Object.keys(response.value).length === 0;

        if (isEmptyRequest) {
            return res.status(400).json({ message: 'missing fields' });
        }

        if (typeof response.error !== 'undefined') {
            const err = response.error.details
                .map(err => err.message)
                .join(', ');
            return res.json({ message: err });
        }

        const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
            new: true,
        });

        if (contact === null) {
            return next();
        }
        return res.json(contact);
    } catch (error) {
        next(error);
    }
}

async function updateStatusContact(req, res, next) {
    try {
        const { contactId } = req.params;
        const response = patchSchema.validate(req.body);
        const isEmptyRequest = Object.keys(response.value).length === 0;

        if (isEmptyRequest) {
            return res.status(400).json({ message: 'missing field favorite' });
        }
        if (typeof response.error !== 'undefined') {
            const err = response.error.details
                .map(err => err.message)
                .join(', ');
            return res.json({ message: err });
        }

        const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
            new: true,
        });
        if (contact === null) {
            return next();
        }
        return res.json(contact);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
};
