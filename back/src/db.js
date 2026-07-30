import mongoose from 'mongoose';

async function removeObsoleteIndexes() {
    const projectsCollectionExists = await mongoose.connection.db
        .listCollections({ name: 'projects' }, { nameOnly: true })
        .hasNext();

    if (!projectsCollectionExists) {
        return;
    }

    const projectsCollection = mongoose.connection.collection('projects');
    const indexes = await projectsCollection.indexes();
    const obsoleteSlugIndex = indexes.find((index) => (
        index.name === 'slug_1'
        && index.unique === true
        && Object.keys(index.key || {}).length === 1
        && index.key.slug === 1
    ));

    if (obsoleteSlugIndex) {
        await projectsCollection.dropIndex(obsoleteSlugIndex.name);
        console.log('Removed obsolete projects slug index.');
    }
}

export async function connectDatabase() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('MONGO_URI is not set in the backend environment.');
    }

    await mongoose.connect(mongoUri);
    await removeObsoleteIndexes();
}
