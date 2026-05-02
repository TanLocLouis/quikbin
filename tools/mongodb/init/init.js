db = db.getSiblingDB('quikbin');
db.bins.createIndex({ "closeBinAt": 1 }, { expireAfterSeconds: 0 });
db.bins.createIndex({ bin_id: 1 })