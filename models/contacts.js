const Contact = require('../schema/contacts');

const { randomUUID } = require('crypto');

async function listContacts() {
    //  Повертає масив контактів.

    const data = await Contact.find();
    return data;
}

async function getContactById(contactId) {
    //  Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
    const data = await listContacts();
    const contact = data.find(contact => contact.id === contactId) || null;
    return contact;
}

async function removeContact(contactId) {
    //  Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
    const data = await listContacts();

    const index = data.findIndex(contact => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const [result] = data.splice(index, 1);

    await Contact.findOneAndRemove({ _id: contactId });
    return result;
}

async function addContact({ name, email, phone }) {
    //  Повертає об'єкт доданого контакту.
    const data = await listContacts();

    const newContact = {
        id: randomUUID(),
        name,
        email,
        phone,
    };

    data.push(newContact);

    await Contact.create(newContact);
    return newContact;
}

async function updateContact(contactId, { name, email, phone }) {
    const data = await listContacts();
    const index = data.findIndex(item => item.id === contactId);

    if (index === -1) {
        return null;
    }
    const newData = {
        id: contactId,
        name: name || data[index].name,
        email: email || data[index].email,
        phone: phone || data[index].phone,
    };
    data[index] = { ...data[index], ...newData };

    await Contact.findByIdAndUpdate(contactId, newData);
    return data[index];
}

async function updateStatusContact(contactId, { favorite }) {
    try {
        const contact = await Contact.findByIdAndUpdate(
            contactId,
            { favorite },
            { new: true }
        );
        return contact;
    } catch (error) {
        console.error('Помилка при оновленні статусу контакту:', error.message);
        throw error;
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
