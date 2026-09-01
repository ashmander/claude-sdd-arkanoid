# 01 - Arkanoid Jugable

**Estado:** Implemented
**Depende de:** Ninguno
**Fecha:** 2026-08-30

## Objetivo

Construir una versión completa y jugable de Arkanoid en HTML/CSS/JS sin dependencias, con paleta controlada por teclado, un nivel fijo de bloques, física de rebote clásica, sonido, animaciones de explosión y ciclo de vidas/puntaje/game-over/victoria.

## Alcance

**Incluido:**

- `index.html` como punto de entrada, con un `<canvas>` de 480x640 px fijo.
- Carga y uso de `assets/spritesheet.js` (`loadSpritesheet`, `drawSprite`, `drawFrame`, `SPRITES`, `EXPLOSION_FRAMES`, `EXPLOSION_DURATION`) tal como existen hoy, sin modificarlos.
- Paleta (paddle) controlada con teclado: flechas izquierda/derecha y A/D.
- Una sola bola, con rebote en paredes (izquierda, derecha, arriba) y en la paleta.
- Rebote en la paleta con ángulo variable según el punto de impacto (más cerca del borde = más lateral, centro = casi vertical).
- Un único layout de bloques fijo (hardcodeado en el código), usando los 7 colores definidos en `SPRITES.blocks` (gray, red, yellow, cyan, magenta, hotpink, green) solo como variedad visual.
- Todos los bloques se rompen en 1 golpe y otorgan el mismo puntaje.
- Sistema de vidas: 3 vidas iniciales; perder la bola (cae debajo de la paleta) resta 1 vida y relanza la bola desde la paleta.
- Puntaje simple: contador que suma al romper cada bloque, visible en pantalla durante el juego.
- Pantalla de inicio con mensaje/tecla para lanzar la bola y comenzar.
- Pausa/reanudación durante el juego (tecla P o Espacio).
- Pantalla de Game Over cuando se pierden las 3 vidas, con opción de reiniciar.
- Pantalla de Victoria cuando se rompen todos los bloques del nivel, con opción de reiniciar.
- Reproducción de `assets/sounds/ball-bounce.mp3` en cada rebote (paredes y paleta).
- Reproducción de `assets/sounds/break-sound.mp3` al romper un bloque.
- Animación de explosión (`EXPLOSION_FRAMES` del color correspondiente, duración `EXPLOSION_DURATION`) en la posición del bloque al romperse.
- Loop de juego basado en `requestAnimationFrame`.

**Explícitamente fuera de alcance (specs futuros si se desean):**

- Múltiples niveles o generación aleatoria de niveles.
- Power-ups (bolas extra, paleta más ancha, etc.).
- Bloques con más de 1 golpe de resistencia o puntaje diferenciado por color.
- Control por mouse/touch.
- Persistencia de puntaje entre sesiones (localStorage, high scores).
- Responsive/adaptación a distintos tamaños de pantalla.
- Múltiples bolas simultáneas.

## Modelo de datos

No se introduce persistencia ni estructuras complejas. El estado del juego vive en memoria, en variables/objetos JS dentro del script principal (por ejemplo `game.state`, `game.lives`, `game.score`, `paddle`, `ball`, `blocks[]`), sin necesidad de esquema versionado por ser todo efímero (se resetea al recargar la página o reiniciar partida).

## Plan de implementación

1. **Esqueleto HTML/CSS.** Crear `index.html` con el `<canvas id="game" width="480" height="640">`, estilos básicos centrando el canvas y un fondo oscuro, y la inclusión de `assets/spritesheet.js` y un nuevo `game.js`. Al abrir el archivo debe verse el canvas vacío en pantalla.
2. **Carga de sprites y dibujo estático del nivel.** En `game.js`, llamar a `loadSpritesheet` y, una vez cargado, dibujar la paleta fija, la bola fija y la grilla completa de bloques (layout hardcodeado) usando `drawSprite`. El sistema queda funcional mostrando un frame estático correcto.
3. **Movimiento de la paleta.** Implementar el loop con `requestAnimationFrame`, escuchar teclado (flechas/A-D) y mover la paleta horizontalmente dentro de los límites del canvas. El sistema queda funcional: se puede mover la paleta con teclado.
4. **Movimiento y rebote de la bola.** Añadir velocidad a la bola, rebote contra paredes izquierda/derecha/arriba, rebote contra la paleta con ángulo variable según punto de impacto, y detección de caída (bola pasa debajo de la paleta). El sistema queda funcional: la bola rebota de forma jugable, aunque sin romper bloques todavía.
5. **Colisión con bloques y ruptura.** Detectar colisión bola-bloque, eliminar el bloque golpeado, rebotar la bola, sumar puntaje y disparar la animación de explosión (`EXPLOSION_FRAMES`) en la posición del bloque durante `EXPLOSION_DURATION` ms. El sistema queda funcional: se pueden romper bloques y ver el puntaje subir.
6. **Sonido.** Reproducir `ball-bounce.mp3` en cada rebote (pared/paleta) y `break-sound.mp3` al romper un bloque. El sistema queda funcional con feedback sonoro.
7. **Vidas, Game Over y Victoria.** Implementar contador de vidas (inicia en 3), restar vida y relanzar bola al caer, mostrar pantalla de Game Over al llegar a 0 vidas, y pantalla de Victoria al vaciar `blocks[]`. Ambas pantallas permiten reiniciar la partida (resetear estado). El sistema queda funcional como juego completo de principio a fin.
8. **Pantalla de inicio y pausa.** Añadir estado inicial "Presiona [tecla] para empezar" antes de lanzar la primera bola, y pausa/reanudación con P o Espacio durante el juego (congela el loop de física, mantiene el dibujo). El sistema queda funcional con el flujo completo: inicio → juego → pausa/reanudación → game over/victoria → reinicio.

## Criterios de aceptación

- [X] Abrir `index.html` directamente en el navegador (o servido estáticamente) muestra el canvas de 480x640 con la pantalla de inicio.
- [X] Presionar la tecla de inicio lanza la bola y comienza el juego.
- [X] Las flechas izquierda/derecha y las teclas A/D mueven la paleta dentro de los límites del canvas, sin salirse.
- [X] La bola rebota correctamente contra las paredes izquierda, derecha y superior.
- [X] La bola rebota contra la paleta con ángulo distinto según si golpea el centro o los bordes de la paleta.
- [X] Golpear un bloque lo elimina, dispara su animación de explosión del color correspondiente, reproduce `break-sound.mp3`, y suma puntos al marcador visible en pantalla.
- [X] Cada rebote contra pared o paleta reproduce `ball-bounce.mp3`.
- [X] Si la bola cae debajo de la paleta, se resta una vida y la bola se relanza desde la paleta, siempre que queden vidas.
- [X] Al llegar a 0 vidas se muestra la pantalla de Game Over con opción de reiniciar, y reiniciar devuelve el juego al estado inicial (3 vidas, 0 puntos, todos los bloques).
- [X] Al romper todos los bloques se muestra la pantalla de Victoria con opción de reiniciar.
- [X] Presionar P o Espacio durante el juego pausa el movimiento de la bola y la paleta; presionarla de nuevo reanuda.
- [X] No se agregó ningún archivo `package.json`, bundler ni dependencia externa; el juego corre abriendo `index.html` directamente.

## Decisiones tomadas y descartadas

- **Un solo nivel fijo** en vez de múltiples niveles o generación aleatoria: prioriza tener una versión jugable completa cuanto antes; niveles adicionales quedan para un spec futuro.
- **Todos los bloques iguales** (1 golpe, mismo puntaje) pese a tener 7 colores disponibles: el color es solo variedad visual del layout en esta v1; resistencia/puntaje diferenciado se descarta para no añadir complejidad de estado por bloque.
- **Teclado únicamente** (flechas/A-D) en vez de mouse: más simple de implementar y suficiente para una v1 jugable; control por mouse queda fuera de alcance.
- **Ángulo de rebote variable en la paleta** en vez de rebote simple tipo pared: es el comportamiento esperado/clásico de Arkanoid y da control real al jugador; se acepta la complejidad adicional porque es central a la sensación de juego.
- **Canvas fijo 480x640** en vez de responsive: evita tener que escalar coordenadas de colisión y sprites, reduciendo riesgo de bugs en la v1.
- **Sin persistencia de puntaje** (localStorage/high scores): no fue pedido y no aporta a que el juego sea "jugable"; se deja para un spec futuro si se desea.

## Riesgos identificados

- **Colisión bola-bloque con múltiples candidatos en el mismo frame:** si la bola se mueve rápido, podría solaparse con más de un bloque en un mismo frame. Mitigación: al detectar colisión, resolver solo el primer bloque impactado por frame y rebotar antes de seguir evaluando.
- **Autoplay de audio bloqueado por el navegador:** los navegadores modernos bloquean reproducir audio antes de una interacción del usuario. Mitigación: los sonidos solo se disparan tras la pantalla de inicio, que ya requiere una tecla presionada por el usuario.
