exports.procesarArchivo = (event, context) => {
  console.log("Archivo procesado automáticamente");
  console.log("Nombre:", event.name);
  console.log("Tipo:", event.contentType);
  console.log("Tamaño:", event.size);
};
