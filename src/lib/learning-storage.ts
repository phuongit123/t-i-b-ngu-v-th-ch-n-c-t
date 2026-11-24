let account = '';

export function setLearningStorageAccount(id: string | null): void {
  account = id ?? '';
}

export function learningStorageKey(key: string, owner = account): string {
  return owner ? `${key}:${encodeURIComponent(owner)}` : key;
}
