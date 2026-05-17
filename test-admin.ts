import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp({ projectId: config.projectId });
const db = getFirestore(app, config.firestoreDatabaseId); // Test Admin specific database

async function test() {
  try {
    const snap = await db.collection('users').limit(1).get();
    console.log("Success, size:", snap.size);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
