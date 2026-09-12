# Varias fotos por obra

## Qué se va a construir

- Cada obra podrá guardar una foto principal y varias tomas adicionales.
- En el panel, la carga de una obra nueva permitirá elegir varias fotos juntas.
- Las obras ya cargadas tendrán una acción para agregar más fotos sin volver a completar sus datos.
- En la vista individual, las fotos se podrán recorrer con flechas, indicadores y gesto lateral en celular.
- Cada toma conservará el giro 360° y el zoom actuales.
- La portada seguirá usando la primera foto como imagen principal.
- Al borrar una obra, también se eliminarán todas sus fotos guardadas.

## Detalles técnicos

- Agregar a `artworks` una lista de rutas de imágenes, conservando `imagen_url` para compatibilidad y como portada.
- Adaptar la resolución de enlaces privados para devolver todas las tomas de cada obra.
- Subir los archivos con nombres únicos asociados al catálogo para evitar reemplazos accidentales.
- Actualizar la renumeración posterior al borrado para trasladar todas las fotos de cada obra.
- Verificar la carga, el cambio de toma, el giro y la visualización en teléfono y escritorio.
