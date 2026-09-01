# 04 - Velocidad Progresiva por Nivel

**Estado:** Approved
**Depende de:** SPEC 01 (01-arkanoid-jugable), SPEC 02 (02-cinco-niveles)
**Fecha:** 2026-09-01

## Objetivo

Subir la velocidad base de la bola de 5 a 6 y hacer que aumente un 15% acumulativo en cada nivel, de forma que el nivel 5 sea notablemente más rápido que el nivel 1.

## Alcance

**Incluido:**

- Cambiar `BALL_SPEED` (hoy `5`) a una velocidad base de `6`.
- La velocidad de la bola aumenta un 15% acumulativo por cada nivel respecto a la base: Nivel 1 = 6, Nivel 2 = 6.9, Nivel 3 = 7.935, Nivel 4 ≈ 9.1252, Nivel 5 ≈ 10.494.
- La magnitud del vector de velocidad de la bola (`vx`, `vy`) en el lanzamiento inicial, en `resetBall()` (tras perder una vida) y en el rebote contra la paleta usa siempre la velocidad del nivel actual (`currentLevelIndex`), no una constante fija.
- Los rebotes contra paredes y bloques (que hoy solo invierten el signo de `vx`/`vy`) siguen preservando la magnitud vigente sin cambios de lógica.
- El ángulo variable de rebote en la paleta según el punto de impacto se mantiene igual; solo cambia que la magnitud resultante usa la velocidad del nivel en vez de la constante `BALL_SPEED` fija.
- Al perder una vida dentro de un nivel, la bola se relanza con la velocidad de ese mismo nivel (no se resetea a la base).
- Al reiniciar partida (desde Game Over o Victoria), la partida vuelve al nivel 1 y por lo tanto a la velocidad base (6).

**Explícitamente fuera de alcance (specs futuros si se desean):**

- Cualquier tope máximo de velocidad distinto al valor natural del nivel 5 (~10.494): no se introduce un cap adicional, la progresión simplemente termina en el nivel 5.
- Cambiar `PADDLE_SPEED` u otro parámetro de dificultad no relacionado a la velocidad de la bola.
- Aumentar la velocidad de forma continua dentro de un mismo nivel (ej. cuanto más tiempo pasa) o por otros triggers (ej. cada N bloques rotos): el incremento ocurre únicamente en las transiciones de nivel.
- Indicar visualmente en el HUD la velocidad actual: el HUD sigue mostrando solo Score, Nivel X/5 y corazones de vidas, sin cambios de spec 03.

## Modelo de datos

No se introduce estructura de datos nueva. Se reemplaza la constante `BALL_SPEED` por una función/lookup `getBallSpeedForLevel(levelIndex)` (o arreglo derivado) que calcula `6 * (1.15 ** levelIndex)`, y se usa ese valor en vez de `BALL_SPEED` en los tres puntos donde hoy se calcula `vx`/`vy` a partir de la constante (lanzamiento inicial, `resetBall()`, rebote en paddle dentro de `updateBall()`).

## Plan de implementación

1. **Reemplazar `BALL_SPEED` fija por velocidad derivada del nivel.** Agregar `BASE_BALL_SPEED = 6` y `BALL_SPEED_GROWTH = 1.15`, y una función `getBallSpeedForLevel(currentLevelIndex)` que retorne `BASE_BALL_SPEED * (BALL_SPEED_GROWTH ** currentLevelIndex)`. El sistema queda funcional: el juego sigue arrancando y jugándose igual, con la nueva velocidad base 6 en el nivel 1.
2. **Usar la velocidad del nivel en el lanzamiento inicial y en `resetBall()`.** Sustituir las referencias a `BALL_SPEED` en la inicialización de `ball` y en `resetBall()` por `getBallSpeedForLevel(currentLevelIndex)`. El sistema queda funcional: al perder una vida, la bola se relanza a la velocidad correcta del nivel en curso.
3. **Usar la velocidad del nivel en el rebote contra la paleta.** Sustituir `BALL_SPEED` por `getBallSpeedForLevel(currentLevelIndex)` en el cálculo de `ball.vx`/`ball.vy` dentro del bloque `hitsPaddle` de `updateBall()`, manteniendo el ángulo variable existente sin cambios. El sistema queda funcional: los rebotes en la paleta mantienen ángulo variable y la magnitud correcta según nivel.
4. **Verificar progresión y reinicio.** Confirmar que al avanzar de nivel (tecla de continuar en "Nivel X completado") la bola relanzada tiene la velocidad mayor correspondiente al nuevo nivel, y que reiniciar partida (desde Game Over o Victoria) vuelve al nivel 1 con la velocidad base 6. El sistema queda funcional como juego completo con dificultad progresiva de principio a fin.

## Criterios de aceptación

- [ ] La bola arranca el nivel 1 con velocidad base 6 (antes 5), en vez del valor anterior.
- [ ] Al pasar del nivel 1 al nivel 2, la velocidad de la bola aumenta (magnitud del vector mayor tras el relanzamiento en el nuevo nivel).
- [ ] La progresión de velocidad por nivel sigue 15% acumulativo: Nivel 1 = 6, Nivel 2 = 6.9, Nivel 3 = 7.935, Nivel 4 ≈ 9.1252, Nivel 5 ≈ 10.494.
- [ ] Al perder una vida dentro de un nivel, la bola se relanza con la velocidad de ese mismo nivel, no con la velocidad base.
- [ ] El ángulo variable de rebote en la paleta según punto de impacto sigue funcionando igual que antes, solo con la magnitud de velocidad correspondiente al nivel actual.
- [ ] Los rebotes contra paredes y bloques siguen invirtiendo el signo de `vx`/`vy` sin alterar la magnitud vigente.
- [ ] Al reiniciar partida (desde Game Over o Victoria), la velocidad vuelve a la base (6) del nivel 1.
- [ ] No se agregó ningún archivo `package.json`, bundler ni dependencia externa; el juego sigue corriendo abriendo `index.html` directamente.

## Decisiones tomadas y descartadas

- **Velocidad base 6 (antes 5, +20%)** en vez de un valor mayor o mantener 5: el usuario pidió explícitamente subir la velocidad por defecto, y un +20% da un aumento perceptible sin hacer el nivel 1 injugable.
- **+15% acumulativo por nivel** en vez de un incremento absoluto fijo o una tabla manual: crece de forma suave en los primeros niveles y se vuelve notablemente más difícil hacia el nivel 5 (~1.75x la base), sin necesidad de mantener 5 valores hardcodeados a mano.
- **La velocidad se mantiene al perder una vida dentro del mismo nivel** en vez de resetearse a la base: evita que perder una vida "premie" al jugador con una bola más lenta, manteniendo la dificultad consistente con el nivel en curso.
- **Sin tope máximo de velocidad** en vez de un cap arbitrario: el juego tiene solo 5 niveles fijos (spec 02), por lo que el valor máximo natural (~10.494 en nivel 5) ya está acotado sin necesidad de lógica adicional.
- **Reinicio de partida vuelve a la velocidad base** en vez de recordar la última velocidad alcanzada: consistente con el spec 02, donde reiniciar partida siempre vuelve al nivel 1 con vidas y puntaje en su estado inicial.
