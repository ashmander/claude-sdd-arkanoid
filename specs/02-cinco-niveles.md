# 02 - Cinco Niveles

**Estado:** Implemented
**Depende de:** SPEC 01 (01-arkanoid-jugable)
**Fecha:** 2026-08-31

## Objetivo

Extender el Arkanoid jugable para que tenga 5 niveles con layouts de bloques distintos entre sí, progresión secuencial con vidas y puntaje acumulados, hasta mostrar la pantalla de Victoria al completar el nivel 5.

## Alcance

**Incluido:**

- 5 layouts de bloques distintos, hardcodeados como un array `levels[]` dentro de `game.js` (cada elemento define la disposición de bloques de ese nivel, reutilizando los 7 colores de `SPRITES.blocks` como variedad visual, igual que en el spec 01).
- Progresión secuencial: al romper todos los bloques de un nivel que no es el último, se muestra una pantalla breve "Nivel X completado" con una tecla para continuar; al presionarla se carga el siguiente nivel y la bola se relanza desde la paleta.
- Vidas y puntaje acumulados entre niveles: no se resetean al pasar de nivel, solo al perder las 3 vidas (Game Over) o al reiniciar partida.
- Velocidad base de la bola igual en todos los niveles (la que ya define el spec 01); la dificultad proviene únicamente de los layouts distintos.
- HUD actualizado durante el juego para mostrar "Nivel X / 5" junto al puntaje y las vidas ya existentes.
- Al completar el nivel 5, se reutiliza la pantalla de Victoria del spec 01 (con el puntaje final acumulado), con opción de reiniciar.
- Reiniciar partida (desde Game Over o desde Victoria) siempre vuelve al nivel 1, con 3 vidas y 0 puntos.

**Explícitamente fuera de alcance (specs futuros si se desean):**

- Generación aleatoria o procedural de niveles.
- Aumento progresivo de la velocidad de la bola u otros parámetros de dificultad entre niveles.
- Selección manual de nivel (menú de niveles, salto a un nivel específico).
- Persistencia de progreso o puntaje entre sesiones (localStorage, high scores).
- Retomar el nivel actual tras un Game Over (siempre se vuelve al nivel 1).
- Power-ups, bloques con más de 1 golpe de resistencia, control por mouse/touch, múltiples bolas: siguen fuera de alcance como ya definía el spec 01.

## Modelo de datos

- `levels`: array de 5 elementos dentro de `game.js`, uno por nivel. Cada elemento describe el layout de bloques de ese nivel (misma estructura por bloque que usa hoy el layout único del spec 01: posición y color), por ejemplo `levels[0]`, `levels[1]`, ..., `levels[4]`.
- `game.currentLevelIndex`: entero (0 a 4) que indica el nivel activo; reemplaza el layout fijo único que usaba `game.state` en el spec 01. Al reiniciar partida vuelve a `0`.
- El resto del estado (`game.state`, `game.lives`, `game.score`, `paddle`, `ball`, `blocks[]`) se mantiene igual que en el spec 01; `blocks[]` se repuebla en cada transición de nivel a partir de `levels[game.currentLevelIndex]`.
- No se introduce persistencia entre sesiones; todo sigue viviendo en memoria y se resetea al recargar la página o reiniciar partida.

## Plan de implementación

1. **Definir los 5 layouts en `levels[]`.** Crear el array `levels` en `game.js` con 5 disposiciones de bloques distintas (variando cantidad, posición y colores usando los 7 colores de `SPRITES.blocks`). El sistema queda funcional: el juego sigue arrancando con el nivel 1 (`levels[0]`) igual que el layout único del spec 01.
2. **Estado de nivel y HUD.** Agregar `game.currentLevelIndex`, poblar `blocks[]` a partir de `levels[game.currentLevelIndex]` en vez del layout hardcodeado fijo, y mostrar "Nivel X / 5" en el HUD junto a puntaje y vidas. El sistema queda funcional: se ve el nivel 1 con el HUD actualizado, comportándose igual que antes salvo por el indicador de nivel.
3. **Pantalla "Nivel X completado" y transición.** Al vaciarse `blocks[]` y no ser el último nivel, pausar el juego, mostrar la pantalla "Nivel X completado", y al presionar la tecla de continuar avanzar `currentLevelIndex`, repoblar `blocks[]` con el siguiente layout y relanzar la bola desde la paleta manteniendo vidas y puntaje. El sistema queda funcional: se puede jugar y completar el nivel 1, ver la pantalla de transición, y continuar al nivel 2.
4. **Victoria al completar el nivel 5.** Ajustar la condición de Victoria del spec 01 para que solo se dispare al vaciar `blocks[]` en el último nivel (`currentLevelIndex === levels.length - 1`), reutilizando la pantalla de Victoria existente con el puntaje final acumulado. El sistema queda funcional como juego completo de 5 niveles de principio a fin.
5. **Reinicio siempre a nivel 1.** Verificar que reiniciar desde Game Over o desde Victoria resetea `currentLevelIndex` a `0`, repuebla `blocks[]` con `levels[0]`, y resetea vidas a 3 y puntaje a 0. El sistema queda funcional con el ciclo completo: inicio → nivel 1..5 con transiciones → Game Over o Victoria → reinicio a nivel 1.

## Criterios de aceptación

- [X] El juego arranca en el nivel 1 mostrando su layout de bloques correspondiente y el HUD muestra "Nivel 1 / 5".
- [X] Los 5 niveles tienen disposiciones de bloques visualmente distintas entre sí.
- [X] Al romper todos los bloques de un nivel que no es el 5, se muestra la pantalla "Nivel X completado"; al presionar la tecla de continuar se carga el siguiente nivel, la bola se relanza desde la paleta, y las vidas y el puntaje se mantienen sin resetear.
- [X] El HUD muestra el número de nivel actual actualizado correctamente en cada transición ("Nivel 2 / 5", "Nivel 3 / 5", etc.).
- [X] La velocidad base de la bola es la misma en todos los niveles.
- [X] Al romper todos los bloques del nivel 5, se muestra la pantalla de Victoria existente con el puntaje final acumulado.
- [X] Si se pierden las 3 vidas en cualquier nivel, se muestra Game Over; al reiniciar, la partida vuelve al nivel 1 con 3 vidas y 0 puntos.
- [X] Al reiniciar desde la pantalla de Victoria, la partida vuelve al nivel 1 con 3 vidas y 0 puntos.
- [X] No se agregó ningún archivo `package.json`, bundler ni dependencia externa; el juego sigue corriendo abriendo `index.html` directamente.

## Decisiones tomadas y descartadas

- **5 layouts hardcodeados distintos** en vez de generación aleatoria o repetir el mismo layout con variación de velocidad: da variedad real de juego percibida por el jugador y evita la complejidad de un generador procedural para una v2 enfocada en niveles.
- **Vidas y puntaje acumulados entre niveles** en vez de resetear vidas por nivel: es el comportamiento clásico de Arkanoid y evita lógica extra de reseteo parcial de estado en cada transición.
- **Pantalla breve "Nivel X completado"** en vez de transición automática inmediata: mantiene el flujo consistente con las pantallas ya existentes (inicio/game over/victoria) del spec 01, dando al jugador una pausa clara entre niveles.
- **Velocidad de bola constante entre niveles** en vez de progresiva: mantiene este spec enfocado en agregar niveles (layouts) sin tocar la física ya definida y validada en el spec 01.
- **Reinicio siempre al nivel 1** en vez de retomar el nivel donde se perdió: consistente con el spec 01 (reiniciar = estado inicial completo) y más simple de implementar; retomar nivel queda fuera de alcance.
- **`levels[]` dentro de `game.js`** en vez de un archivo `levels.js` separado: consistente con el principio de "sin dependencias/build" del proyecto; no se justifica un archivo nuevo solo para 5 arreglos de datos.

## Riesgos identificados

- **Reutilización de coordenadas de bloques entre niveles:** si los 5 layouts se definen a mano, existe riesgo de bloques mal posicionados o solapados en algún nivel. Mitigación: verificar visualmente cada nivel al abrir el juego antes de dar el paso 1 por terminado.
- **Transición de nivel dejando la bola o la paleta en estado inconsistente:** al repoblar `blocks[]` y relanzar la bola, podría quedar velocidad o posición residual del nivel anterior. Mitigación: reutilizar exactamente la misma rutina de "relanzar bola desde la paleta" que ya usa el spec 01 al perder una vida, en vez de escribir una nueva.
