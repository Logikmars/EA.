import mongoose from 'mongoose';

async function removeObsoleteUniqueIndex(collectionName, fieldName) {
    const collectionExists = await mongoose.connection.db
        .listCollections({ name: collectionName }, { nameOnly: true })
        .hasNext();

    if (!collectionExists) {
        return;
    }

    const collection = mongoose.connection.collection(collectionName);
    const indexes = await collection.indexes();
    const obsoleteIndexes = indexes.filter((index) => (
        index.unique === true
        && index.name !== `${fieldName}_optional_unique`
        && Object.keys(index.key || {}).length === 1
        && index.key[fieldName] === 1
    ));

    for (const index of obsoleteIndexes) {
        await collection.dropIndex(index.name);
        console.log(`Removed obsolete ${collectionName}.${fieldName} unique index.`);
    }
}

async function ensureOptionalUniqueIndex(collectionName, fieldName) {
    await removeObsoleteUniqueIndex(collectionName, fieldName);

    const collection = mongoose.connection.collection(collectionName);
    await collection.createIndex(
        { [fieldName]: 1 },
        {
            name: `${fieldName}_optional_unique`,
            unique: true,
            partialFilterExpression: {
                [fieldName]: { $type: 'string' },
            },
        }
    );
}

async function removeObsoleteIndexes() {
    await removeObsoleteUniqueIndex('projects', 'slug');
    await ensureOptionalUniqueIndex('projects', 'href');
    await ensureOptionalUniqueIndex('media', 'sourceUrl');
}

export async function connectDatabase() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('MONGO_URI is not set in the backend environment.');
    }

    await mongoose.connect(mongoUri);
    await removeObsoleteIndexes();
}
