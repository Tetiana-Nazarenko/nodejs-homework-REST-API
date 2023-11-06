const fs = require('node:fs/promises');

const path = require('node:path');
const { randomUUID } = require('crypto');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
    //  Повертає масив контактів.

    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
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

    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
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

    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return newContact;
}

async function updateContact(contactId, { name, email, phone }) {
    const data = await listContacts();
    const index = data.findIndex(item => item.id === contactId);
    if (index === -1) {
        return null;
    }
    data[index] = {
        contactId,
        name: name || data[index].name,
        email: email || data[index].email,
        phone: phone || data[index].phone,
    };
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return data[index];
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
