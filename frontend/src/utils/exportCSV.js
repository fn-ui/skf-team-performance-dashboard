// ========================================
// 📄 EXPORT CSV
// ========================================

export function exportCSV(
  filename = "export.csv",
  rows = [],
  options = {}
) {

  try {

    // 🚫 NO DATA
    if (!Array.isArray(rows) || rows.length === 0) {

      alert("No data to export");

      return;
    }

    // ========================================
    // OPTIONS
    // ========================================

    const {
      columns = null,
      headers = null,
    } = options;

    // ========================================
    // GET KEYS
    // ========================================

    const keys =
      columns ||
      Object.keys(rows[0]);

    // ========================================
    // ESCAPE CSV VALUES
    // ========================================

    const escapeValue = (
      value
    ) => {

      if (
        value === null ||
        value === undefined
      ) {
        return "";
      }

      // 📅 FORMAT DATES
      if (
        value instanceof Date
      ) {
        value =
          value.toISOString();
      }

      // 📦 OBJECTS
      if (
        typeof value ===
        "object"
      ) {
        value =
          JSON.stringify(value);
      }

      const stringValue =
        String(value);

      // ESCAPE SPECIAL CHARS
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

    // ========================================
    // HEADER ROW
    // ========================================

    const headerRow =
      headers || keys;

    // ========================================
    // DATA ROWS
    // ========================================

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

    // ========================================
    // FINAL CSV
    // ========================================

    const csvContent = [
      headerRow.join(","),
      ...csvRows,
    ].join("\n");

    // UTF-8 BOM FOR EXCEL
    const BOM = "\uFEFF";

    const blob = new Blob(
      [BOM + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    // ========================================
    // DOWNLOAD
    // ========================================

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