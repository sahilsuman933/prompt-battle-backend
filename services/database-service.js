import db from "../database";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const DB = {
  async fetchData(collectionName) {
    let data = [];
    const usersCollectionRef = collection(db, collectionName);
    const query = await getDocs(usersCollectionRef);

    // Filter Data
    query.docs.map((doc) => {
      let field = doc._document.data.value.mapValue.fields;
      let id =
        doc._document.key.path.segments[
          doc._document.key.path.segments.length - 1
        ];
      let tempObject = { id };

      for (const key in field) {
        for (const valueType in field[key]) {
          tempObject[key] = field[key][valueType];
        }
      }

      data = [...data, tempObject];
    });

    return data;
  },
  async updateData(collectionName, id, data) {
    const userDoc = doc(db, collectionName, id);
    await updateDoc(userDoc, data);
  },
};

export default DB;
