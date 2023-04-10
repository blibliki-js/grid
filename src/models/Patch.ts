import staticPatches from "staticPatches";
import db from "./db";
import PatchConfig, { IConfig } from "./PatchConfig";

export interface IPatch {
  id?: number;
  name: string;
  staticId?: string;
  config?: IConfig;
}

export default class Patch implements IPatch {
  id: number;
  name: string;
  staticId: string;
  config: IConfig;

  static populate() {
    staticPatches.forEach((data) => {
      const { id: staticId, name, ...config } = data;
      const patch = new Patch({
        staticId,
        name,
        config: config,
      });
      patch.save();
    });
  }

  static async find(id: number) {
    const patch = await db.patches.where("id").equals(id).first();

    if (!patch) throw Error("Patch not found");

    return patch;
  }

  constructor(props: {
    id?: number;
    name: string;
    staticId?: string;
    config?: IConfig;
  }) {
    Object.assign(this, props);
  }

  async save() {
    const { id, name, staticId } = this;
    if (staticId && id) throw Error("Static patch can't be saved");

    return await db.transaction("rw", db.patches, db.patchConfigs, async () => {
      this.id = await db.patches.put(new Patch({ id, name, staticId }));

      await (await this.patchConfig()).save();
    });
  }

  async delete() {
    return await db.transaction("rw", db.patches, db.patchConfigs, async () => {
      await db.patches.where("id").equals(this.id).delete();
      await db.patchConfigs.where("patchId").equals(this.id).delete();
    });
  }

  private async patchConfig() {
    if (!this.id) throw Error("Patch not initialized");

    const existedConfig = await db.patchConfigs
      .where("patchId")
      .equals(this.id)
      .first();

    const conf = existedConfig || new PatchConfig({ patchId: this.id });
    conf.config = this.config;

    return conf;
  }
}
