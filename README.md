# alejo-chat

Asistente sobre el perfil profesional de Alejandro Ávila, publicado como **custom
element** para montarse en cualquier página, sin importar con qué esté construida.

```html
<script type="module" src="https://…/widgets/chat/v1.0.0/alejo-chat.js"></script>
<alejo-chat></alejo-chat>
```

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

`npm run build` deja en `dist/` el bundle y un `manifest.json` con la versión, el
tamaño y el `sha384` de integridad, que es lo que el shell verifica al cargarlo.

## Probarlo

Tras `npm run build`, abre `demo/index.html` con cualquier servidor estático.
