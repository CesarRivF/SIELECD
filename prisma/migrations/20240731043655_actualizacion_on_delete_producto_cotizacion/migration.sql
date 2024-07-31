-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Producto_Cotizacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cotizacionId" INTEGER NOT NULL,
    "productoId" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "total" REAL,
    CONSTRAINT "Producto_Cotizacion_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Producto_Cotizacion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Producto_Cotizacion" ("cantidad", "cotizacionId", "id", "productoId", "total") SELECT "cantidad", "cotizacionId", "id", "productoId", "total" FROM "Producto_Cotizacion";
DROP TABLE "Producto_Cotizacion";
ALTER TABLE "new_Producto_Cotizacion" RENAME TO "Producto_Cotizacion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
