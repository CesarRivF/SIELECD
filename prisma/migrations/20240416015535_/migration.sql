-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Producto_Cotizacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cotizacionId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "total" REAL,
    CONSTRAINT "Producto_Cotizacion_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Producto_Cotizacion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Producto_Cotizacion" ("cantidad", "cotizacionId", "id", "productoId", "total") SELECT "cantidad", "cotizacionId", "id", "productoId", "total" FROM "Producto_Cotizacion";
DROP TABLE "Producto_Cotizacion";
ALTER TABLE "new_Producto_Cotizacion" RENAME TO "Producto_Cotizacion";
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "logo" TEXT,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "domicilio" TEXT NOT NULL
);
INSERT INTO "new_Cliente" ("correo", "domicilio", "id", "logo", "nombre", "telefono") SELECT "correo", "domicilio", "id", "logo", "nombre", "telefono" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_correo_key" ON "Cliente"("correo");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
