export function printElementById(id) {
  const el = document.getElementById(id);
  if (!el) {
    alert("Printable area not found");
    return;
  }

  const newWin = window.open("", "PrintWindow", "width=900,height=700");
  if (!newWin) {
    alert("Unable to open print window");
    return;
  }

  newWin.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>body{font-family: Arial, Helvetica, sans-serif; padding:20px;}</style>
      </head>
      <body>
        ${el.innerHTML}
      </body>
    </html>
  `);

  newWin.document.close();
  newWin.focus();
  setTimeout(() => {
    newWin.print();
    newWin.close();
  }, 500);
}
