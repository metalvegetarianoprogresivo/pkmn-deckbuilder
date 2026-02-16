# Contribuyendo a Universal Deckbuilder Pro

¡Gracias por tu interés en contribuir! 🎉

## 🚀 Cómo Contribuir

### Reportar Bugs 🐛

Si encontraste un bug, por favor abre un issue con:

1. **Descripción clara** del problema
2. **Pasos para reproducir**
3. **Comportamiento esperado** vs **comportamiento actual**
4. **Screenshots** si es posible
5. **Navegador y versión** que estás usando

### Sugerir Features ✨

Para sugerencias de nuevas características:

1. Abre un issue con el tag `enhancement`
2. Describe **qué** quieres agregar
3. Explica **por qué** sería útil
4. Proporciona **ejemplos** de uso si es posible

### Pull Requests 🔀

1. **Fork** el repositorio
2. **Crea una branch** desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-feature
   ```
3. **Haz tus cambios** con commits descriptivos
4. **Asegúrate** que el código funciona localmente
5. **Push** a tu fork:
   ```bash
   git push origin feature/mi-nueva-feature
   ```
6. **Abre un Pull Request** con descripción detallada

## 📋 Guías de Estilo

### Código JavaScript

```javascript
// ✅ BUENO: Nombres descriptivos
function updateDeckCount() {
  const total = calculateTotalCards();
  displayCount(total);
}

// ❌ MALO: Nombres poco claros
function upd() {
  const t = calc();
  disp(t);
}
```

### CSS

```css
/* ✅ BUENO: Clases descriptivas */
.deck-card-item {
  padding: 1rem;
  border-radius: 8px;
}

/* ❌ MALO: Clases crípticas */
.dc-i {
  padding: 1rem;
  border-radius: 8px;
}
```

### Commits

```bash
# ✅ BUENO: Descriptivo y claro
git commit -m "feat: agregar sistema de filtrado por tipo de carta"
git commit -m "fix: corregir error en contador de energías"
git commit -m "docs: actualizar README con nuevas features"

# ❌ MALO: Poco descriptivo
git commit -m "cambios"
git commit -m "fix bug"
git commit -m "update"
```

### Tipos de Commits

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Mantenimiento general

## 🧪 Testing

Antes de hacer un PR, asegúrate de probar:

1. ✅ Construcción de decks (agregar/remover cartas)
2. ✅ Sistema de guardado/carga
3. ✅ Playtesting (manos iniciales)
4. ✅ Importación desde Limitless
5. ✅ Optimizador de matchups
6. ✅ Responsive design (mobile/desktop)

## 📝 Áreas de Contribución

### 🔥 High Priority

- [ ] Integración real con API de Limitless
- [ ] Mejora de análisis de manos
- [ ] Más recomendaciones de matchups
- [ ] Optimización de performance

### ⭐ Medium Priority

- [ ] Imágenes de cartas
- [ ] Historial de cambios en decks
- [ ] Modo oscuro/claro
- [ ] Exportación a PDF

### 💡 Nice to Have

- [ ] PWA support
- [ ] Multi-idioma
- [ ] Calculadora de probabilidades
- [ ] Comparación de decks

## 🤔 ¿Tienes Preguntas?

No dudes en:
- Abrir un issue con tus dudas
- Comentar en PRs existentes
- Contactar a los maintainers

## 📜 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a hacer de este proyecto una experiencia libre de acoso para todos, sin importar:
- Edad
- Tamaño corporal
- Discapacidad
- Etnia
- Identidad de género
- Nivel de experiencia
- Nacionalidad
- Apariencia personal
- Raza
- Religión
- Identidad u orientación sexual

### Comportamiento Esperado

- ✅ Usar lenguaje acogedor e inclusivo
- ✅ Respetar diferentes puntos de vista
- ✅ Aceptar críticas constructivas con gracia
- ✅ Enfocarse en lo mejor para la comunidad
- ✅ Mostrar empatía hacia otros miembros

### Comportamiento Inaceptable

- ❌ Lenguaje o imágenes sexualizadas
- ❌ Trolling, comentarios insultantes
- ❌ Ataques personales o políticos
- ❌ Acoso público o privado
- ❌ Publicar información privada sin permiso

## 🎉 Reconocimientos

Todos los contribuidores serán listados en el README.

¡Gracias por contribuir! 🙌
