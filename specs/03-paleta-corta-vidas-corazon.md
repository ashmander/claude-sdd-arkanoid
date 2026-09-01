# 03 - Paleta Corta y Vidas con Corazón

**Estado:** Draft
**Depende de:** SPEC 01 (01-arkanoid-jugable), SPEC 02 (02-cinco-niveles)
**Fecha:** 2026-09-01

## Objetivo

Reducir el ancho de la paleta en un 40% y reemplazar el texto "Lives: N" del HUD por un ícono de corazón (`assets/count-lives.png`) repetido una vez por cada vida restante.

## Alcance

**Incluido:**

- Reducir `PADDLE_W` en `game.js` de 162px a 97px (≈40% más corta), manteniendo el resto de la física de rebote (ángulo variable según punto de impacto) sin cambios.
- Cargar `assets/count-lives.png` como una imagen standalone (`new Image()` con su propio `onload`, independiente de `loadSpritesheet`/`ssImg`).
- En el HUD, eliminar el texto `Lives: ${ lives }` y dibujar en su lugar el ícono de corazón repetido horizontalmente una vez por cada vida restante (por ejemplo, 3 vidas = 3 corazones), en la misma zona superior derecha donde hoy vive el texto de vidas.
- El HUD sigue mostrando "Score" y "Nivel X / 5" como texto, sin cambios.
- Los corazones se actualizan inmediatamente al perder una vida (uno menos) y al reiniciar partida (vuelven a 3).

**Explícitamente fuera de alcance (specs futuros si se desean):**

- Cambiar el ancho de la paleta de forma progresiva entre niveles o como power-up: la paleta tiene un único ancho fijo (97px) en todo momento, igual que hoy es fijo en 162px.
- Animaciones al perder una vida (ej. corazón rompiéndose): se elimina el corazón directamente, sin transición.
- Cualquier otro rediseño visual del HUD (posición de Score/Nivel, fuente, etc.).
- Agregar el corazón al spritesheet existente (`spritesheet-breakout.png`/`spritesheet.js`): se mantiene como imagen aparte.

## Modelo de datos

No se introduce estado nuevo. Se reutiliza `lives` (ya existente en `game.js`) para determinar cuántos corazones dibujar. Se agrega una única variable de módulo para la imagen del corazón (por ejemplo `heartImg`) y una bandera/callback de carga análoga a como se maneja `ssImg` en `spritesheet.js`, pero cargada de forma independiente.

## Plan de implementación

1. **Reducir el ancho de la paleta.** Cambiar `PADDLE_W` de `162` a `97` en `game.js`. El sistema queda funcional: la paleta se ve y se controla igual que antes, solo más corta.
2. **Cargar la imagen del corazón.** Crear `heartImg = new Image()` con `heartImg.src = 'assets/count-lives.png'`, y postergar el dibujo de vidas hasta que `heartImg` esté cargada (patrón simple con `heartImg.onload` + bandera, sin bloquear el resto del arranque del juego). El sistema queda funcional: el juego sigue arrancando igual, la imagen se carga en paralelo.
3. **Dibujar corazones en el HUD en vez de texto.** Reemplazar la línea `ctx.fillText(\`Lives: ${ lives }\`, ...)` por un loop que dibuje `heartImg` con `ctx.drawImage` una vez por cada vida restante, alineados horizontalmente en la esquina superior derecha del canvas donde antes iba el texto. El sistema queda funcional: se ven N corazones representando las vidas actuales.
4. **Verificar actualización en vivo.** Confirmar que al perder una vida desaparece un corazón, y que al reiniciar partida (desde Game Over o Victoria) vuelven a dibujarse 3 corazones. El sistema queda funcional como HUD completo con corazones sincronizados al estado real de vidas.

## Criterios de aceptación

- [ ] La paleta mide 97px de ancho (antes 162px) y se controla igual con flechas/A-D dentro de los límites del canvas.
- [ ] El rebote de la bola contra la paleta sigue teniendo ángulo variable según el punto de impacto, sin cambios de comportamiento más allá del ancho.
- [ ] El HUD ya no muestra el texto "Lives: N"; en su lugar muestra tantos íconos de corazón (`assets/count-lives.png`) como vidas restantes.
- [ ] Al perder una vida, desaparece un corazón del HUD inmediatamente.
- [ ] Al reiniciar partida (desde Game Over o desde Victoria), vuelven a mostrarse 3 corazones.
- [ ] El HUD sigue mostrando correctamente "Score" y "Nivel X / 5" sin cambios de posición ni comportamiento.
- [ ] No se agregó ningún archivo `package.json`, bundler ni dependencia externa; el juego sigue corriendo abriendo `index.html` directamente.

## Decisiones tomadas y descartadas

- **97px (≈40% más corto)** en vez de una reducción menor (~25%) o un valor arbitrario: el usuario pidió explícitamente una paleta notablemente más corta, priorizando mayor dificultad sobre mantener el control cómodo actual.
- **Solo íconos de corazón, sin número acompañante** en vez de "❤ x3": es el estilo más limpio y típico de HUDs de vidas en juegos arcade, y evita mezclar texto e íconos en el mismo indicador.
- **Imagen standalone (`new Image()`)** en vez de integrar el corazón al spritesheet existente: evita editar `spritesheet-breakout.png`/`spritesheet.js` (que el spec 01 declara no modificar) solo para agregar un ícono nuevo; cargar una imagen aparte es igual de simple y no introduce dependencias.
- **Corazón desaparece sin animación** en vez de una transición al perder vida: mantiene este spec acotado a cambiar paleta y HUD, sin tocar el sistema de animaciones (`EXPLOSION_FRAMES`) ya existente para otro propósito.
