import Dexie from "dexie";
import Patch from "./Patch";
import PatchConfig from "./PatchConfig";

let db: GridDatabase;

export class GridDatabase extends Dexie {
  patches!: Dexie.Table<Patch, number>;
  patchConfigs!: Dexie.Table<PatchConfig, number>;

  constructor() {
    super("GridDatabase");

    this.version(1).stores({
      patches: "++id, name, staticId",
      patchConfigs: "++id, patchId, config",
    });

    this.patches.mapToClass(Patch);
    this.patchConfigs.mapToClass(PatchConfig);
  }
}

export function getDb(): GridDatabase {
  if (db) return db;

  db = new GridDatabase();
  return db;
}
