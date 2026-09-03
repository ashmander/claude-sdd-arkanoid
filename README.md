# Juego Arkanoid

Arkanoid/Breakout jugable, hecho en HTML, CSS y JavaScript puro, sin dependencias.

## Cómo jugar

Abrí `index.html` directamente en el navegador (o serví la carpeta con cualquier servidor estático). No hay build ni instalación.

- **Controles:** flechas ←/→ o A/D para mover la paleta.
- **Pantalla de inicio:** selectores +/- para elegir nivel inicial (1-5) y velocidad base (1-10), luego ESPACIO para arrancar.
- **Objetivo:** romper todos los bloques de cada nivel sin perder las 3 vidas. Hay 5 niveles con layouts distintos; la velocidad de la bola sube 15% acumulativo por nivel.

## Estructura del proyecto

- `index.html` — punto de entrada, canvas de 480x640px y botones del selector de nivel/velocidad.
- `game.js` — toda la lógica del juego: estados (`start`/jugando/game-over/victoria), los 5 niveles, física de paddle/bola, colisiones con bloques, explosiones, vidas (corazones), puntaje y el selector de nivel/velocidad inicial.
- `assets/spritesheet-breakout.png` + `assets/spritesheet.js` — atlas de sprites, loader `loadSpritesheet(cb)` y los rects `SPRITES`/`EXPLOSION_FRAMES`.
- `assets/count-lives.png` — ícono de corazón para el HUD de vidas.
- `assets/sounds/*.mp3` — efectos de sonido de rebote y rotura de bloques.
- `specs/` — specs del feature workflow (ver abajo), numeradas 01-05, todas en estado `Implemented`.

No hay build step, package.json, linter ni test suite. Al modificar el juego, probar abriendo `index.html` en el navegador.

## Workflow de specs

Este repo usa un workflow de dos comandos para features, instalado como skills en `.agents/skills/` y `.claude/skills/` (origen: `Klerith/fernando-skills`):

- **`/spec <descripción>`** — genera un spec interactivo a través de preguntas de clarificación y lo guarda en `specs/NN-slug.md` (numerado secuencialmente, slug en kebab-case) en estado `Draft`. No escribe código.
- **`/spec-impl <NN-slug>`** — implementa un spec, pero solo una vez que su estado se cambia manualmente a `Approved`. Crea una rama `spec-NN-slug` (controlado por `AutoCreateBranch` en `specs/.spec-config.yml`, default `true`) e implementa el plan paso a paso, pausando para revisión después de cada paso. Nunca hace commit automáticamente.

Antes de agregar una feature nueva, revisar si ya existe un spec relacionado en `specs/`. Para trabajo no trivial, preferir pasar por `/spec` en vez de improvisar.

## Convenciones

- Cero dependencias: no agregar bundler, paquetes npm ni frameworks. Seguir escribiendo HTML/CSS/JS vanilla.
- El contenido de specs y README por convención está en español (el skill sigue el idioma del prompt que lo inicia).
