const { MongoClient } = require('mongodb');
const { Client } = require('@elastic/elasticsearch');

async function seedData() {
  const mongoUrl = `mongodb://${encodeURIComponent(process.env.MONGO_INITDB_ROOT_USERNAME)}:${encodeURIComponent(encodeURIComponent(process.env.MONGO_INITDB_ROOT_PASSWORD))}@mongodb:27017`;
  const elasticUrl = 'http://elasticsearch:9200';

  const mongoClient = new MongoClient(mongoUrl);
  const elasticClient = new Client({ node: elasticUrl });

  try {
    await mongoClient.connect();
    const db = mongoClient.db(encodeURIComponent(process.env.MONGO_INITDB_DATABASE));

    const collection = db.collection('video_games');
    const documents = await collection.find().sort({ rating: 1 }).toArray();

    const CHUNK_SIZE = 500;

    console.log('Seeding data to ElasticSearch, please wait, it can take a while...')

    for (let i = 0; i < documents.length; i += CHUNK_SIZE) {
      const chunk = documents.slice(i, i + CHUNK_SIZE);
      const body = chunk.flatMap((doc) => [
        { index: { _index: 'video_games', _id: doc._id.toString() } },
        { ...doc, _id: undefined },
      ]);

      const response = await elasticClient.bulk({ refresh: true, body });

      if (response.errors === "true") {
        console.log(`Failed to seed data at chunk ${i}/${CHUNK_SIZE}:`, response.errors);
      }
    }
    console.log('Data seeded to ElasticSearch!')
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoClient.close();
    elasticClient.close();
  }
}

seedData();
