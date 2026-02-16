# 📸 Guía Visual Paso a Paso - GitHub Pages

## 🎯 Despliegue Completo en 10 Pasos

---

## Paso 1: Ir a GitHub

```
1. Abre tu navegador
2. Ve a: https://github.com
3. Inicia sesión (o crea cuenta si no tienes)
```

📸 **Deberías ver**: Tu dashboard de GitHub con tus repositorios

---

## Paso 2: Crear Nuevo Repositorio

```
1. Click en el botón "+" (arriba derecha)
2. Selecciona "New repository"
```

📸 **Deberías ver**: Formulario "Create a new repository"

---

## Paso 3: Configurar Repositorio

```
Completa el formulario:

Repository name: pkmn-deckbuilder

Description: Universal Deckbuilder Pro para Pokémon TCG
            (opcional pero recomendado)

Visibility: ● Public ✅ IMPORTANTE
           ○ Private

☐ Add a README file (NO marques esto)
☐ Add .gitignore (NO marques esto)  
☐ Choose a license (NO marques esto)
```

📸 **Deberías ver**: Formulario completado con "Public" seleccionado

```
4. Click en "Create repository" (botón verde)
```

---

## Paso 4: Ver Repositorio Vacío

📸 **Deberías ver**: Página con instrucciones de cómo subir código

```
Verás algo como:
"Quick setup — if you've done this kind of thing before"
...or create a new repository on the command line
...or push an existing repository from the command line
```

---

## Paso 5: Subir Archivos

```
1. Busca el texto: "uploading an existing file"
2. Click en ese link azul
```

📸 **Deberías ver**: Página con área para arrastrar archivos

```
Dice: "Drag files here to add them to your repository"
```

---

## Paso 6: Arrastrar Archivos

```
1. Abre la carpeta donde descargaste los archivos
2. Selecciona TODOS estos archivos:
   ✅ index.html (EL MÁS IMPORTANTE - 106 KB)
   ✅ README.md
   ✅ LICENSE
   ✅ .gitignore
   ✅ CONTRIBUTING.md
   ✅ DEPLOYMENT.md
   ✅ QUICKSTART.md
   ✅ deploy.sh
   ✅ Carpeta .github (con todo su contenido)

3. Arrástralos a la página de GitHub
```

📸 **Deberías ver**: 
- Lista de archivos cargándose
- Barra de progreso
- Checkmarks verdes cuando termine

---

## Paso 7: Hacer Commit

```
En la parte inferior de la página:

Commit message: Initial commit
                (puedes dejar el default)

☑ Commit directly to the main branch

1. Click "Commit changes" (botón verde)
```

📸 **Deberías ver**: Página de tu repositorio con todos los archivos listados

---

## Paso 8: Ir a Settings

```
1. Click en "Settings" (pestaña arriba derecha)
```

📸 **Deberías ver**: Página de configuración del repositorio con menú lateral izquierdo

---

## Paso 9: Activar GitHub Pages

```
En el menú lateral izquierdo:

1. Busca "Pages" (cerca del final)
2. Click en "Pages"
```

📸 **Deberías ver**: Página "GitHub Pages" con opciones de configuración

```
Configura así:

Build and deployment
├─ Source: Deploy from a branch ▼
│
└─ Branch: 
    ├─ Branch: main ▼
    ├─ Folder: / (root) ▼
    └─ [Save] ← Click aquí
```

📸 **Después de click en Save, deberías ver**:
Un banner azul que dice: "GitHub Pages source saved"

---

## Paso 10: Esperar y Visitar

```
1. ⏳ ESPERA 2-3 MINUTOS (es importante)
   
   GitHub está:
   - Procesando tu sitio
   - Generando la versión publicada
   - Desplegando a los servidores

2. Refresca la página (F5)

3. Deberías ver un banner verde:
   "Your site is live at https://metalvegetarianoprogresivo.github.io/pkmn-deckbuilder/"

4. Click en el link o cópialo

5. Abre en nueva pestaña
```

📸 **Deberías ver**: 
¡Tu Universal Deckbuilder Pro funcionando! 🎉
- Header morado con título
- Selector de decks
- Constructor de decks
- Optimizador de matchups
- Todo funcionando perfectamente

---

## ✅ Verificación Final

Prueba estas funciones:

```
☐ Selector de deck (click en Gardevoir/Dragapult/etc)
☐ Agregar carta manualmente
☐ Incrementar/Decrementar cantidad
☐ Contador de cartas (debe llegar a 60)
☐ Guardar deck
☐ Exportar decklist
☐ Playtesting (robar mano)
☐ Optimizador de matchups
☐ Importar desde Limitless
```

Si todo funciona: **¡ÉXITO!** 🎊

---

## 📋 Checklist Visual

Usa esto para verificar cada paso:

```
☐ Paso 1: Entré a GitHub
☐ Paso 2: Click en "+" → New repository
☐ Paso 3: Configuré nombre y Public
☐ Paso 4: Vi repositorio vacío
☐ Paso 5: Click en "uploading an existing file"
☐ Paso 6: Arrastré todos los archivos
☐ Paso 7: Hice commit
☐ Paso 8: Fui a Settings
☐ Paso 9: Activé Pages (main, / root)
☐ Paso 10: Esperé 2 min y visité el sitio
```

---

## 🆘 Problemas Comunes

### No veo el botón "uploading an existing file"

**Solución**: 
- Verifica que el repositorio esté vacío
- Si no está vacío, usa "Add file" → "Upload files"

### Error 404 al visitar el sitio

**Solución**:
1. Espera 2 minutos más
2. Verifica Settings → Pages → Branch sea "main"
3. Refresca tu navegador con Ctrl+F5
4. Limpia caché del navegador

### Los archivos no se suben

**Solución**:
- Verifica conexión a internet
- Prueba de uno en uno si son muchos archivos
- Asegúrate que ningún archivo sea > 100 MB
- El más importante es index.html (106 KB)

### El sitio carga pero se ve mal

**Solución**:
- Limpia caché del navegador
- Verifica que index.html se subió completo (106 KB)
- Refresca con Ctrl+F5 (forzar recarga)

### Dice "Your site is ready to be published"

**Solución**:
- Esto es normal, solo espera 1-2 minutos más
- Refresca la página de Settings → Pages
- Cuando esté listo dirá "Your site is live at..."

---

## 🎉 ¡Felicidades!

Si llegaste aquí, tu deckbuilder está:
✅ Publicado en internet
✅ Accesible 24/7
✅ Gratis en GitHub Pages
✅ Con tu propio URL

**Comparte tu link:**
```
https://metalvegetarianoprogresivo.github.io/pkmn-deckbuilder/
```

---

## 📱 Próximos Pasos

### Personalizar
- Edita README.md con tu nombre
- Cambia colores en el CSS (dentro de index.html)
- Agrega más decks al meta

### Actualizar
- Edita index.html en GitHub directamente
- O usa Git para subir cambios
- Cambios se despliegan automáticamente en 2 minutos

### Compartir
- Comparte en Reddit (r/pkmntcg)
- Comparte en Twitter/X
- Comparte en Discord de Pokémon TCG
- Agrega a tu perfil de Limitless

---

## 🎯 URL Final

Tu deckbuilder estará siempre en:
```
https://metalvegetarianoprogresivo.github.io/pkmn-deckbuilder/
```

¡Guarda ese link! 🔖

---

**¿Necesitas ayuda?** Lee DEPLOYMENT.md para más detalles.
