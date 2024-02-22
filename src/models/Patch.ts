import { getDb } from "./db";
import PatchConfig, { IConfig } from "./PatchConfig";

export interface IPatch {
  id?: number;
  name: string;
  config?: IConfig;
}

export default class Patch implements IPatch {
  id: number;
  name: string;
  config: IConfig;

  static async find(id: number) {
    const patch = await getDb().patches.where("id").equals(id).first();

    if (!patch) throw Error("Patch not found");

    return patch;
  }

  constructor(props: { id?: number; name: string; config?: IConfig }) {
    Object.assign(this, props);
  }

  async save() {
    const db = getDb();
    const { id, name } = this;

    return await db.transaction("rw", db.patches, db.patchConfigs, async () => {
      this.id = await db.patches.put(new Patch({ id, name }));

      await (await this.patchConfig()).save();
    });
  }

  async delete() {
    const db = getDb();
    return await db.transaction("rw", db.patches, db.patchConfigs, async () => {
      await db.patches.where("id").equals(this.id).delete();
      await db.patchConfigs.where("patchId").equals(this.id).delete();
    });
  }

  private async patchConfig() {
    if (!this.id) throw Error("Patch not initialized");

    const existedConfig = await getDb()
      .patchConfigs.where("patchId")
      .equals(this.id)
      .first();

    const conf = existedConfig || new PatchConfig({ patchId: this.id });
    conf.config = this.config;

    return conf;
  }
}
