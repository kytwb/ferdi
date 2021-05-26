import path from 'path';
import { app } from '@electron/remote';
import fs from 'fs-extra';

export function getServicePartitionsDirectory() {
  return path.join(app.getPath('userData'), 'Partitions');
}

export function removeServicePartitionDirectory(id = '', addServicePrefix = false) {
  const servicePartition = path.join(getServicePartitionsDirectory(), `${addServicePrefix ? 'service-' : ''}${id}`);

  return fs.remove(servicePartition);
}

export async function getServiceIdsFromPartitions() {
  const files = await fs.readdir(getServicePartitionsDirectory());
  return files.filter(n => n !== '__chrome_extension');
}
