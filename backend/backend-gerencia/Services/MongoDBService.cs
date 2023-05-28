using MongoDB.Bson;
using MongoDB.Driver;

namespace backend_gerencia.Services
{
    public class MongoDBService
    {
        private MongoClient _client;
        public MongoDBService()
        {
            const string connectionUri = "mongodb+srv://psad:<senhadeteste123>@cluster0.n9t6h8l.mongodb.net/?retryWrites=true&w=majority";
            var settings = MongoClientSettings.FromConnectionString(connectionUri);
            // Set the ServerApi field of the settings object to Stable API version 1
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);
            // Create a new client and connect to the server
            _client = new MongoClient(settings);
            // Send a ping to confirm a successful connection
            try
            {
                var result = _client.GetDatabase("admin").RunCommand<BsonDocument>(new BsonDocument("ping", 1));
                Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        public string GetTable(string databaseName, string attributeName)
        {
            var database = _client.GetDatabase(databaseName);
            var collection = database.GetCollection<BsonDocument>("users").ToJson();
            

            return collection;
        }
    }
}
