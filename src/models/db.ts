import Dexie from "dexie";
import Patch from "./Patch";
import PatchConfig from "./PatchConfig";

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

const db = new GridDatabase();
db.on("populate", populate);

function populate() {
  Patch.populate();
}

export default db;
