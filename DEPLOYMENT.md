# 🚀 Guía de Despliegue en GitHub Pages

Esta guía te llevará paso a paso para publicar tu Universal Deckbuilder Pro en GitHub Pages.

## 📋 Prerrequisitos

- ✅ Cuenta de GitHub
- ✅ Git instalado en tu computadora
- ✅ Navegador web

## 🎯 Método 1: Despliegue Rápido (Recomendado)

### Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Click en el botón **"+"** (arriba derecha) → **"New repository"**
3. Completa:
   - **Repository name**: `pkmn-deckbuilder`
   - **Description**: "Universal Deckbuilder Pro para Pokémon TCG"
   - **Public** (debe ser público para GitHub Pages gratis)
   - ✅ **Add a README file** (desmarca esto, ya tenemos uno)
4. Click **"Create repository"**

### Paso 2: Subir los Archivos

**Opción A: Usando GitHub Web (Más fácil)**

1. En tu nuevo repositorio, click **"uploading an existing file"**
2. Arrastra estos archivos:
   - `index.html`
   - `README.md`
   - `LICENSE`
   - `.gitignore`
   - `CONTRIBUTING.md`
3. En "Commit changes", escribe: `Initial commit`
4. Click **"Commit changes"**

**Opción B: Usando Git CLI**

```bash
# Navega a la carpeta donde están tus archivos
cd /ruta/a/tus/archivos

# Inicializa Git
git init

# Agrega los archivos
git add .

# Haz el primer commit
git commit -m "Initial commit: Universal Deckbuilder Pro"

# Conecta con tu repositorio de GitHub
git remote add origin https://github.com/metalvegetarianoprogresivo/pkmn-deckbuilder.git

# Renombra la branch a main (si es necesario)
git branch -M main

# Sube los archivos
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. En tu repositorio, ve a **"Settings"** (arriba derecha)
2. En el menú lateral izquierdo, click **"Pages"**
3. En **"Source"**, selecciona:
   - **Deploy from a branch**
4. En **"Branch"**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **"Save"**
6. ⏳ **Espera 1-2 minutos** mientras GitHub despliega tu sitio
7. 🎉 Verás un mensaje: **"Your site is live at https://metalvegetarianoprogresivo.github.io/pkmn-deckbuilder/"**

### Paso 4: Verificar

1. Click en el link que GitHub te proporcionó
2. Tu deckbuilder debe cargar perfectamente
3. Prueba todas las funciones:
   - ✅ Construir deck
   - ✅ Guardar/Cargar
   - ✅ Playtesting
   - ✅ Importar desde Limitless
   - ✅ Optimizador de matchups

## 🔄 Método 2: Con GitHub Actions (Automático)

Si seguiste el Método 1 y subiste la carpeta `.github/workflows/`, el despliegue será **automático**:

1. Cada vez que hagas `git push` a la branch `main`
2. GitHub Actions construirá y desplegará automáticamente
3. El sitio se actualizará en 1-2 minutos

### Ver el estado del despliegue

1. Ve a la pestaña **"Actions"** en tu repositorio
2. Verás el workflow "Deploy to GitHub Pages"
3. Click en el run más reciente para ver detalles
4. ✅ Verde = Éxito | ❌ Rojo = Error

## 🛠️ Actualizar el Sitio

### Desde GitHub Web

1. Ve a tu repositorio
2. Click en `index.html`
3. Click en el icono de lápiz (✏️) para editar
4. Haz tus cambios
5. Scroll abajo, escribe mensaje de commit
6. Click **"Commit changes"**
7. ⏳ Espera 1-2 minutos
8. 🎉 Tu sitio está actualizado

### Desde Git CLI

```bash
# Haz cambios en tus archivos locales

# Guarda los cambios
git add .
git commit -m "Descripción de tus cambios"

# Sube a GitHub
git push

# El sitio se actualizará automáticamente en 1-2 minutos
```

## 🔧 Troubleshooting

### Problema: "404 - Page not found"

**Solución:**
1. Ve a Settings → Pages
2. Verifica que el source sea `main` branch, `/ (root)` folder
3. Click "Save" otra vez
4. Espera 2-3 minutos
5. Intenta acceder de nuevo

### Problema: "El sitio no se actualiza"

**Solución:**
1. Limpia el caché del navegador (Ctrl + F5 o Cmd + Shift + R)
2. Espera 5 minutos (a veces tarda más)
3. Ve a Actions → verifica que el deploy fue exitoso
4. Si hay error en Actions, revisa los logs

### Problema: "CSS no se carga"

**Solución:**
- Todos los estilos están en `index.html`
- No hay archivos CSS externos
- Si algo no carga, verifica que `index.html` esté completo

### Problema: "Fonts no cargan"

**Solución:**
- Las fonts se cargan desde Google Fonts CDN
- Verifica tu conexión a internet
- Las fonts son: Playfair Display y DM Sans

## 📊 Configuraciones Avanzadas

### Dominio Personalizado

1. Compra un dominio (ejemplo: `mideckbuilder.com`)
2. En Settings → Pages → Custom domain
3. Ingresa tu dominio
4. Configura DNS en tu proveedor:
   - Tipo: `CNAME`
   - Name: `www`
   - Value: `TU-USUARIO.github.io`
5. Espera propagación DNS (hasta 48 horas)

### Analytics (Opcional)

Para agregar Google Analytics:

1. Obtén tu tracking ID de Google Analytics
2. Edita `index.html`
3. Agrega antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🎉 ¡Listo!

Tu Universal Deckbuilder Pro está ahora en vivo en:
**https://metalvegetarianoprogresivo.github.io/pkmn-deckbuilder/**

Comparte el link con la comunidad! 🎴

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía completa
2. Busca en GitHub Discussions del repo
3. Abre un Issue con detalles del problema
4. Contacta a la comunidad

## 📚 Recursos Adicionales

- [GitHub Pages Docs](https://docs.github.com/pages)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Git Tutorial](https://git-scm.com/docs/gittutorial)
