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
        headerColor: "#00AAFF",
        label: "Empresa",
      },
      {
        headerColor: "#00AAFF",
        label: "Cliente",
      },
    ],
    rows: [
      [
        "SIELECD Servicios de Ingenieria Electrica",
        datosCotizacion.cliente.nombre,
      ],
      [
        "Telefono: (618) 127 92 02",
        "Telefono: " + datosCotizacion.cliente.telefono,
      ],
      [
        "Domicilio: Maracaibo #104 Fracc. Guadalupe, 34220 Durango",
        "Domicilio: " + datosCotizacion.cliente.domicilio,
      ],
      [
        "Correo: adm.sielecd@gmail.com",
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

  doc.text("Dias de Vigencia: " + datosCotizacion.diasCotizacion);
  doc.text(
    "Fecha de Creación: " +
      datosCotizacion.fechaCreacion.toLocaleString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
  );
  if (datosCotizacion.suministroMaterial != null) {
    doc.text("Suministro de Material: " + datosCotizacion.suministroMaterial);
  }
  if (datosCotizacion.porcentajeAnticipo != 0) {
    doc.text(
      "Peticion de Anticipo: " +
        datosCotizacion.porcentajeAnticipo +
        " % lo que equivale a: $ " +
        (datosCotizacion.total * datosCotizacion.porcentajeAnticipo) / 100
    );
  }

  await doc.table(tableClient, {
    columnsSize: [265, 265],
    prepareHeader: () => {
      doc.font("Helvetica-Bold").fontSize(12);
    },
  });

  const dataProductos = datosCotizacion.productos.map((producto) => {
    const data = {
      qty: producto.cantidad,
      description: producto.descripcion,
      unit: producto.unidad,
      price: producto.precio_unitario,
      price2: producto.cantidad * producto.precio_unitario,
    };
    return data;
  });
  const total = datosCotizacion.total;
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
