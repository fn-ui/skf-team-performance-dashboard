
export function exportCSV(
  filename = "export.csv",
  rows = [],
  options = {}
) {

  try {

    if (!Array.isArray(rows) || rows.length === 0) {

      alert("No data to export");

      return;
    }


    const {
      columns = null,
      headers = null,
    } = options;


    const keys =
      columns ||
      Object.keys(rows[0]);


    const escapeValue = (
      value
    ) => {

      if (
        value === null ||
        value === undefined
      ) {
        return "";
      }

      if (
        value instanceof Date
      ) {
        value =
          value.toISOString();
      }

      if (
        typeof value ===
        "object"
      ) {
        value =
          JSON.stringify(value);
      }

      const stringValue =
        String(value);

      if (
        stringValue.includes(",") ||
        stringValue.includes("\n") ||
        stringValue.includes('"')
      ) {

        return `"${stringValue.replace(
          /"/g,
          '""'
        )}"`;
      }

      return stringValue;
    };


    const headerRow =
      headers || keys;


    const csvRows = rows.map(
      (row) =>
        keys
          .map((key) =>
            escapeValue(
              row[key]
            )
          )
          .join(",")
    );


    const csvContent = [
      headerRow.join(","),
      ...csvRows,
    ].join("\n");

    const BOM = "\uFEFF";

    const blob = new Blob(
      [BOM + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );


    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      filename.endsWith(".csv")
        ? filename
        : `${filename}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);

  } catch (error) {

    console.error(
      "CSV EXPORT ERROR:",
      error
    );

    alert(
      "Failed to export CSV"
    );
  }
}
