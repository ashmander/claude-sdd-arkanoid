# 05 - Selector de Nivel y Velocidad Base

**Estado:** Approved
**Depende de:** SPEC 01 (01-arkanoid-jugable), SPEC 02 (02-cinco-niveles), SPEC 04 (04-velocidad-progresiva-por-nivel)
**Fecha:** 2026-09-01

## Objetivo

Agregar a la pantalla de inicio dos selectores con botones -/+ (nivel de arranque 1-5 y velocidad base 1-10) que definen desde dónde y con qué dificultad arranca la partida, sin alterar la lógica existente de progresión de nivel ni el 15% de crecimiento de velocidad por nivel.

## Alcance

**Incluido:**

- Dos selectores en la pantalla de inicio (`gameState === 'start'`): "Nivel" (1 a 5) y "Velocidad inicial" (1 a 10), cada uno con botones HTML reales `-`/`+` y el valor actual mostrado entre ambos.
- Los botones se implementan como elementos `<button>` en `index.html`, ubicados debajo/alrededor del `<canvas>` (no dibujados dentro del canvas), con su propio CSS y listeners en `game.js`.
- Nivel por defecto: 1. Velocidad base por defecto: 6 (igual al comportamiento actual del spec 04).
- El botón `-`/`+` de nivel clamea entre 1 y 5; el de velocidad clamea entre 1 y 10 (enteros, paso 1).
- Al presionar ESPACIO en la pantalla de inicio, la partida arranca con `currentLevelIndex = nivelSeleccionado - 1` y usando `velocidadSeleccionada` como base para `getBallSpeedForLevel`, en vez de siempre nivel 1 y base fija 6.
- `getBallSpeedForLevel(levelIndex)` sigue calculando `baseBallSpeed * (BALL_SPEED_GROWTH ** levelIndex)` sin cambios de fórmula; solo `baseBallSpeed` deja de ser una constante fija (`BASE_BALL_SPEED = 6`) y pasa a ser el valor elegido en el selector.
- La progresión de nivel al completar bloques se mantiene intacta: si se arranca en nivel 3 y se completa, se avanza a nivel 4 (`currentLevelIndex += 1`), igual que hoy. Si se arranca en nivel 5 y se completa, se muestra Victoria (igual que hoy, por ser el último nivel).
- Vidas (3) y puntaje (0) arrancan siempre igual sin importar el nivel/velocidad seleccionados.
- Al reiniciar desde Game Over o Victoria (tecla R), se vuelve a la pantalla de inicio con los selectores mostrando la última selección hecha por el jugador (no vuelven al default), pudiendo ajustarla antes de presionar ESPACIO de nuevo.
- Los botones -/+ solo están activos y visibles durante `gameState === 'start'`; se ocultan/deshabilitan en cualquier otro estado (`playing`, `paused`, `levelComplete`, `gameover`, `victory`).

**Explícitamente fuera de alcance (specs futuros si se desean):**

- Cambiar el control de la paleta o de la bola a mouse/touch: los botones -/+ son la única interacción por mouse que se introduce, limitada a la pantalla de inicio; el gameplay sigue siendo 100% teclado como en spec 01.
- Selectores accesibles durante la partida en curso (pausa) o directamente en las pantallas de Game Over/Victoria sin pasar por la pantalla de inicio: los selectores viven únicamente en la pantalla de inicio.
- Guardar/recordar la selección entre recargas de página (localStorage): la selección solo persiste en memoria durante la sesión del navegador, se pierde al recargar `index.html`.
- Tope máximo de velocidad distinto a 10, o rango de nivel distinto a 1-5: los máximos ya están fijados por el pedido (velocidad base máxima 10) y por los 5 niveles existentes (spec 02).
- Indicar en el HUD durante el juego la velocidad base elegida: el HUD sigue mostrando solo Score, Nivel X/5 y corazones, sin cambios de spec 03.
- Cualquier validación de que el nivel/velocidad elegidos sean "justos" o balanceados: el jugador puede elegir cualquier combinación dentro de los rangos permitidos, incluyendo nivel 5 con velocidad 10.

## Modelo de datos

No se introduce persistencia. Se agregan dos variables de estado en memoria en `game.js`:

- `selectedLevel`: entero, 1 a 5, default `1`. Reemplaza el uso fijo de `currentLevelIndex = 0` al arrancar/reiniciar.
- `selectedBaseSpeed`: entero, 1 a 10, default `6`. Reemplaza la constante `BASE_BALL_SPEED = 6` como base de `getBallSpeedForLevel`.

`getBallSpeedForLevel(levelIndex)` pasa a leer `selectedBaseSpeed` en vez de la constante `BASE_BALL_SPEED` (que se elimina). `currentLevelIndex` se sigue usando exactamente igual que hoy (spec 02/04) para todo lo demás (layout de bloques, HUD, condición de Victoria, avance secuencial), solo que su valor inicial pasa a ser `selectedLevel - 1` en vez de siempre `0`.

En `index.html` se agregan elementos HTML (fuera del `<canvas>`) para los dos selectores: contenedor con label, botón `-`, valor actual, botón `+`, por cada uno de los dos selectores.

## Plan de implementación

1. **Agregar los elementos HTML de los selectores.** En `index.html`, debajo del `<canvas>`, agregar un contenedor con dos filas ("Nivel: [-] 1 [+]" y "Velocidad inicial: [-] 6 [+]") con IDs (`level-minus`, `level-plus`, `level-value`, `speed-minus`, `speed-plus`, `speed-value`) y CSS básico consistente con el fondo oscuro existente. El sistema queda funcional: el juego sigue arrancando y jugándose igual que antes, ahora con los controles visibles debajo del canvas (aunque todavía sin lógica).
2. **Estado y lógica de los selectores en `game.js`.** Agregar `selectedLevel` y `selectedBaseSpeed` con sus defaults, listeners de `click` en los 4 botones que incrementan/decrementan clameando a los rangos 1-5 y 1-10 respectivamente, y actualizan el texto de `level-value`/`speed-value`. El sistema queda funcional: se puede cambiar los valores mostrados en pantalla, aunque la partida todavía arranca igual que antes.
3. **Reemplazar `BASE_BALL_SPEED` por `selectedBaseSpeed`.** Eliminar la constante `BASE_BALL_SPEED` y hacer que `getBallSpeedForLevel` use `selectedBaseSpeed`. El sistema queda funcional: con los selectores en su default (Nivel 1, Velocidad 6) el comportamiento es idéntico al de spec 04.
4. **Usar `selectedLevel` al arrancar la partida.** Al presionar ESPACIO en `gameState === 'start'`, setear `currentLevelIndex = selectedLevel - 1` antes de poblar `blocks` y llamar a `resetBall()`/lanzar la bola, en vez de asumir que `currentLevelIndex` ya es `0`. Ajustar `resetGame()` para que ya no fuerce `currentLevelIndex = 0`, dejando que el siguiente arranque desde la pantalla de inicio use `selectedLevel` tal cual quedó. El sistema queda funcional: se puede elegir un nivel distinto a 1 y arrancar directamente ahí, con el layout y velocidad correctos.
5. **Mostrar/ocultar controles según el estado.** Los botones y valores de los selectores solo son interactuables y visibles durante `gameState === 'start'`; deshabilitarlos (o darles `display: none`) en cualquier otro estado. El sistema queda funcional como feature completa: pantalla de inicio con selectores → partida arrancada con esos valores → progresión/game over/victoria igual que antes → reinicio vuelve a la pantalla de inicio con la última selección.

## Criterios de aceptación

- [ ] La pantalla de inicio muestra dos selectores con botones `-`/`+`: "Nivel" (default 1) y "Velocidad inicial" (default 6).
- [ ] El botón `+` de nivel no supera 5; el botón `-` no baja de 1.
- [ ] El botón `+` de velocidad no supera 10; el botón `-` no baja de 1.
- [ ] Con los valores por defecto (Nivel 1, Velocidad 6) y presionando ESPACIO, el juego se comporta exactamente igual que antes de este spec (mismo layout de nivel 1, misma velocidad inicial 6).
- [ ] Seleccionando Nivel 5 y presionando ESPACIO, la partida arranca directamente en el layout del nivel 5, con vidas en 3 y puntaje en 0.
- [ ] Seleccionando Velocidad inicial 8, la velocidad de la bola al arrancar el nivel 1 corresponde a `8 * 1.15^0 = 8`, y si se avanza al nivel 2, a `8 * 1.15^1 = 9.2`.
- [ ] Si se arranca en Nivel 4 y se completa ese nivel, la partida avanza al Nivel 5 (no salta a otro valor), manteniendo la lógica secuencial existente.
- [ ] Si se arranca en Nivel 5 y se completa, se muestra la pantalla de Victoria (igual que si se hubiera llegado ahí jugando desde el nivel 1).
- [ ] Los botones de los selectores no están visibles/activos mientras `gameState` es `playing`, `paused`, `levelComplete`, `gameover` o `victory`.
- [ ] Al perder o ganar la partida y reiniciar con R, la pantalla de inicio vuelve a mostrar la última combinación de nivel/velocidad elegida (no el default), permitiendo cambiarla antes de presionar ESPACIO de nuevo.
- [ ] No se agregó ningún archivo `package.json`, bundler ni dependencia externa; el juego sigue corriendo abriendo `index.html` directamente.

## Decisiones tomadas y descartadas

- **Botones HTML reales fuera del canvas** en vez de dibujar los botones dentro del `<canvas>` con hit-testing manual de clicks: el usuario lo pidió explícitamente y evita reimplementar manejo de click/hover a mano para algo que HTML ya resuelve nativamente.
- **Selectores solo en la pantalla de inicio** (reutilizada también para el reinicio, ya que `resetGame()` vuelve a `gameState = 'start'`) en vez de agregar una pantalla de selección separada o repetir los selectores en Game Over/Victoria: la pantalla de inicio ya cumple ese rol al reiniciar, no hace falta una pantalla nueva.
- **La última selección persiste entre reinicios** (en memoria, durante la sesión) en vez de volver siempre al default: permite repetir rápidamente el mismo nivel/velocidad sin tener que reconfigurar los selectores cada vez que se pierde.
- **Rango de nivel 1-5** en vez de un rango distinto: coincide exactamente con los 5 niveles fijos que ya existen (spec 02); no tiene sentido permitir un valor fuera de ese rango.
- **Rango de velocidad entero 1-10, paso 1** en vez de decimales: el pedido fija el máximo en 10 y no pide granularidad fina; enteros simplifican los botones -/+ y la validación de rango.
- **`currentLevelIndex` inicial pasa a ser `selectedLevel - 1` en vez de forzarse siempre a 0 en `resetGame()`**: es el cambio central del spec — sin esto el selector de nivel no tendría efecto. La lógica de avance secuencial y de Victoria en el último nivel (spec 02/04) no se modifica, solo el punto de partida.
- **`getBallSpeedForLevel` usa `selectedBaseSpeed` en vez de mantener `BASE_BALL_SPEED` como constante paralela**: evita tener dos fuentes de verdad para la velocidad base; con el selector en su default (6) el resultado es idéntico al spec 04.
- **Sin persistencia en localStorage**: no fue pedido y el proyecto no tiene persistencia entre sesiones en ningún otro spec; se descarta para no introducir alcance extra.
