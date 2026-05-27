import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Habit, HabitLog, Category, AppSettings } from "@/types";

interface HabitFlowDB extends DBSchema {
  habits: { key: string; value: Habit };
  logs: {
    key: string;
    value: HabitLog;
    indexes: { "by-habit-date": [string, string] };
  };
  categories: { key: string; value: Category };
  settings: { key: string; value: AppSettings & { id: string } };
}

let dbInstance: IDBPDatabase<HabitFlowDB> | null = null;
let dbOpening: Promise<IDBPDatabase<HabitFlowDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<HabitFlowDB>> {
  if (dbInstance) return Promise.resolve(dbInstance);
  if (dbOpening) return dbOpening;

  dbOpening = openDB<HabitFlowDB>("habitflow-db", 1, {
    upgrade(db) {
      db.createObjectStore("habits", { keyPath: "id" });
      const logStore = db.createObjectStore("logs", { keyPath: "id" });
      logStore.createIndex("by-habit-date", ["habitId", "date"]);
      db.createObjectStore("categories", { keyPath: "id" });
      db.createObjectStore("settings", { keyPath: "id" });
    },
  }).then((db) => {
    dbInstance = db;
    return db;
  });

  return dbOpening;
}
