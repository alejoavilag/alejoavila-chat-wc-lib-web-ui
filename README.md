# alejo-chat

Asistente sobre el perfil profesional de Alejandro Ávila, publicado como **custom
element** para montarse en cualquier página, sin importar con qué esté construida.

```html
<script type="module" src="https://widgets.alejoavila.com/chat/v1.0.0/alejo-chat.js"></script>
<alejo-chat></alejo-chat>
```

El anfitrión no debería fijar esa versión a mano. Se lee del manifest, que además
trae el hash con el que verificar lo que se descarga:

```js
const base = "https://widgets.alejoavila.com/chat/";
const manifest = await (await fetch(base + "manifest.json")).json();

const script = document.createElement("script");
script.type = "module";
script.src = base + manifest.entry;
script.integrity = manifest.integrity;
script.crossOrigin = "anonymous";
document.head.append(script);
```

Si alguien alterara el bundle en el CDN, el navegador se niega a ejecutarlo.

## Decisiones

**Angular 22 Elements, sin Zone.js.** La detección de cambios es *zoneless* con
señales. Zone.js parchea temporizadores y promesas de forma global: un widget que
lo cargara alteraría el comportamiento de la página anfitriona. Un componente
embebible no tiene derecho a hacer eso.

**Shadow DOM.** Los estilos no salen ni entran. El anfitrión puede tener cualquier
hoja de estilos sin romper el widget, y el widget no puede romper al anfitrión.

**Arquitectura hexagonal.** El dominio no importa Angular; la aplicación depende de
un puerto, no de un adaptador. Una regla de ESLint rompe la compilación si un
import apunta hacia adentro.

```
src/domain/          entidades y la lógica de emparejamiento, sin framework
src/application/     el puerto AnswerProvider y el caso de uso ask
src/infrastructure/  adaptadores: hoy la base de conocimiento local
src/ui/              el componente Angular, un adaptador más
```

Hoy el único adaptador responde desde una base de conocimiento local con
ponderación por frecuencia inversa. Cuando exista el API, entra un segundo
adaptador contra el modelo y se cambia una línea del contenedor.

## Comandos

```
npm run build   compila, renombra el bundle y genera el manifest con su hash
npm test        pruebas del dominio y de la aplicación
npm run lint    incluye la regla de dirección de dependencias
```

`npm run build` deja el bundle en `dist/chat/v<version>/` y un `manifest.json`
estable en `dist/chat/` con la versión, el tamaño y el `sha384`. Las rutas con
versión se sirven inmutables y el manifest se revalida cada minuto, así que
publicar una versión nueva no invalida la caché de las anteriores.

CI vuelve a calcular el hash sobre el bundle construido y falla si no coincide
con el manifest, de modo que un artefacto alterado no llega a desplegarse.

El widget vive en su propio sitio de Hosting. Un despliegue de Firebase reemplaza
el contenido completo de un sitio: compartirlo con la landing haría que cada
despliegue borrara al otro.

## Probarlo

Tras `npm run build`, abre `demo/index.html` con cualquier servidor estático.
