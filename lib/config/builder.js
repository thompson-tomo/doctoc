"use strict";

export class ConfigBuilder {
  constructor() {
    this.layers = [];
  }

  // Add a layer function: (currentConfig, context) => partialConfig
  use(layerFn) {
    this.layers.push(layerFn);
    return this;
  }

  // Build final config for a given context (e.g., filePath, syntax)
  build(context = {}) {
    let cfg = {};

    for (const layer of this.layers) {
      const partial = layer(cfg, context) || {};
      cfg = {
        ...cfg,
        ...Object.fromEntries(
          Object.entries(partial).filter(([_, v]) => v !== undefined)
        )
      };

    }

    return cfg; //Object.freeze(cfg);
  }
}
