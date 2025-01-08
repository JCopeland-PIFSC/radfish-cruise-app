import { name, version, stores } from "./config.js";
import { IndexedDBMethod } from "@nmfs-radfish/radfish";

export default new IndexedDBMethod(name, version, stores);
