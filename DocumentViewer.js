import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function DocumentViewer() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const loadDocs = async () => {
      const docsRef = collection(db, "documents");
      const snapshot = await getDocs(docsRef);
      const docList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocs(docList);
    };
    loadDocs();
  }, []);

  return (
    <div>
      <h2>Available Documents</h2>
      <ul>
        {docs.map(doc => (
          <li key={doc.id}>
            <strong>{doc.title}</strong>
            <div style={{ border: "1px solid #ff0000", padding: "10px", marginTop: "5px" }}>
              <p>{doc.content}</p> {/* Displayed only, not downloadable */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}