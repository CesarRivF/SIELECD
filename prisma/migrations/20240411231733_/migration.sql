-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cotizacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dias_cotizacion" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "total" REAL,
    "lugar_de_entrega" TEXT NOT NULL,
    "tiempo_de_ejecucion" INTEGER,
    CONSTRAINT "Cotizacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cotizacion" ("clienteId", "dias_cotizacion", "fecha_creacion", "id", "lugar_de_entrega", "tiempo_de_ejecucion", "total") SELECT "clienteId", "dias_cotizacion", "fecha_creacion", "id", "lugar_de_entrega", "tiempo_de_ejecucion", "total" FROM "Cotizacion";
DROP TABLE "Cotizacion";
ALTER TABLE "new_Cotizacion" RENAME TO "Cotizacion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
