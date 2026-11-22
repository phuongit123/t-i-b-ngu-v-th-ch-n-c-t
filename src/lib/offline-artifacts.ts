function openArtifacts(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('affinity-academy-artifacts', 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('files'); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

interface StoredArtifact {
  bytes: ArrayBuffer;
  name: string;
  type: string;
  lastModified: number;
}

export async function writeOfflineArtifact(key: string, file: File): Promise<void> {
  const artifact: StoredArtifact = {
    bytes: await file.arrayBuffer(), name: file.name, type: file.type, lastModified: file.lastModified,
  };
  const db = await openArtifacts();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').put(artifact, key);
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
  } finally { db.close(); }
}

export async function readOfflineArtifact(key: string): Promise<File | null> {
  const db = await openArtifacts();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction('files').objectStore('files').get(key);
      request.onsuccess = () => {
        const record: StoredArtifact | File | undefined = request.result;
        if (!record) resolve(null);
        else if (record instanceof File) resolve(record);
        else resolve(new File([record.bytes], record.name, { type: record.type, lastModified: record.lastModified }));
      };
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}
