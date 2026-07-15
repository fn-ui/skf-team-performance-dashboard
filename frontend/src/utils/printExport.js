
export function printElementById(
  id,
  options = {}
) {

  try {

    const element =
      document.getElementById(id);

    if (!element) {

      alert(
        "Printable area not found"
      );

      return;
    }


    const {
      title = "Print Document",
      removeButtons = true,
      extraStyles = "",
    } = options;


    const clonedContent =
      element.cloneNode(true);

    if (removeButtons) {

      clonedContent
        .querySelectorAll("button")
        .forEach((btn) =>
          btn.remove()
        );
    }


    const printWindow =
      window.open(
        "",
        "_blank",
        "width=1000,height=800"
      );

    if (!printWindow) {

      alert(
        "Unable to open print window"
      );

      return;
    }


    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

        <head>

          <title>${title}</title>

          <meta charset="utf-8" />

          <style>

            * {
              box-sizing: border-box;
            }

            body {
              font-family:
                Arial,
                Helvetica,
                sans-serif;

              padding: 30px;

              color: #111827;

              background: white;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              margin-bottom: 10px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            table,
            th,
            td {
              border: 1px solid #d1d5db;
            }

            th,
            td {
              padding: 12px;
              text-align: left;
            }

            th {
              background: #f3f4f6;
            }

            img {
              max-width: 100%;
            }

            .no-print {
              display: none !important;
            }

            @media print {

              body {
                padding: 0;
              }

              button {
                display: none !important;
              }

            }

            ${extraStyles}

          </style>

        </head>

        <body>

          ${clonedContent.innerHTML}

        </body>

      </html>
    `);

    printWindow.document.close();


    printWindow.onload = () => {

      printWindow.focus();

      setTimeout(() => {

        printWindow.print();

        printWindow.close();

      }, 300);
    };

  } catch (error) {

    console.error(
      "PRINT ERROR:",
      error
    );

    alert(
      "Failed to print content"
    );
  }
}
