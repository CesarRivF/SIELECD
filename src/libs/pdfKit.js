import PDFDocument from "pdfkit-table";
import { fetchImage } from "../utils.js";

export async function buildTable(datosCotizacion, dataCallback, endCallback) {
  let doc = new PDFDocument({ margin: 30, size: "A4" });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const tableClient = {
    title: "Cotización ",
    subtitle: "Folio #" + datosCotizacion.id,
    headers: [
      {
        headerColor: "#e5793b",
        label: "Empresa",
      },
      {
        headerColor: "#e5793b",
        label: "Cliente",
      },
    ],
    rows: [
      ["SIELECD", datosCotizacion.cliente.nombre],
      [
        "Telefono: 618 495 0695",
        "Telefono: " + datosCotizacion.cliente.telefono,
      ],
      [
        "Domicilio: Maracaibo #104 Fracc. Guadalupe, 34220 Durango",
        "Domicilio: " + datosCotizacion.cliente.domicilio,
      ],
      [
        "Correo: sielecd@gmail.com",
        "Correo: " + datosCotizacion.cliente.correo,
      ],
    ],
  };
  // A4 595.28 x 841.89 (portrait) (about width sizes)
  // or columnsSize
  const logo = await fetchImage("https://i.postimg.cc/bw9MH6jM/sielecd.jpg");

  doc.image(logo, {
    fit: [250, 300],
    align: "center",
  });

  doc.y = 125;

  doc.text("Dias de vigencia: " + datosCotizacion.diasCotizacion);
  doc.text(
    "Fecha de creación: " + datosCotizacion.fechaCreacion.toLocaleDateString()
  );
  await doc.table(tableClient, {
    columnsSize: [265, 265],
    prepareHeader: () => {
      doc.font("Helvetica-Bold").fontSize(12);
    },
  });

  const dataProductos = datosCotizacion.productos.map((producto) => {
    const data = {
      qty: producto.cantidad,
      description: producto.producto.descripcion,
      unit: producto.producto.unidad,
      price: producto.producto.precio_unitario,
      price2: producto.cantidad * producto.producto.precio_unitario,
    };
    return data;
  });
  const total = datosCotizacion.productos.reduce(
    (acc, producto) =>
      acc + producto.cantidad * producto.producto.precio_unitario,
    0
  );
  const totales = [
    {
      key: "subtotal",
      options: { fontSize: 12 },
      price: "bold:Subtotal",
      price2: "bold: " + total / 1.16,
    },
    ,
    {
      key: "iva",
      options: { fontSize: 12 },
      price: "bold:IVA",
      price2: "bold: " + (total / 1.16) * 0.16,
    },
    ,
    {
      key: "total",
      options: { fontSize: 12 },
      price: "bold:Total",
      price2: "bold: " + total,
    },
  ];

  const table = {
    headers: [
      {
        label: "Cantidad",
        property: "qty",
        width: 70,
        renderer: null,
        align: "center",
        columnColor: "white",
      },
      {
        label: "Descripción",
        property: "description",
        width: 240,
        renderer: null,
        columnColor: "white",
      },
      {
        label: "Unidad",
        property: "unit",
        width: 60,
        renderer: null,
        align: "center",
        columnColor: "white",
      },
      {
        label: "Precio",
        property: "price",
        width: 80,
        renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {
          return isNaN(value) ? value : `$ ${Number(value).toLocaleString()}`;
        },
        align: "right",
        columnColor: "white",
      },
      {
        label: "Importe",
        property: "price2",
        width: 80,
        renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {
          return isNaN(value) ? value : `$ ${Number(value).toLocaleString()}`;
        },
        align: "right",
        columnColor: "white",
      },
    ],
    datas: dataProductos.concat(totales),
  };
  await doc.table(table, {
    padding: 5,
    prepareHeader: () => {
      doc.font("Helvetica-Bold").fontSize(10);
    },
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font("Helvetica").fontSize(9);
      //if (row.key === "total" || row.key === "iva" || row.key === "subtotal")
      //doc.addBackground(rectRow, "#c6e7ee", 0.15);
    },
  });
  // done!
  doc.end();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
