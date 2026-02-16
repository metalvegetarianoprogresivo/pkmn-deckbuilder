# ⚡ Guía Rápida de 5 Minutos

## 🎯 Opción 1: Upload Manual (MÁS FÁCIL)

### 1️⃣ Crea el Repositorio
```
1. Ve a github.com
2. Click en "+" → "New repository"
3. Nombre: pokemon-deckbuilder
4. Public ✅
5. Create repository
```

### 2️⃣ Sube los Archivos
```
1. En tu repo nuevo, click "uploading an existing file"
2. Arrastra todos estos archivos:
   - index.html ⭐ (EL MÁS IMPORTANTE)
   - README.md
   - LICENSE
   - .gitignore
   - CONTRIBUTING.md
3. Commit changes
```

### 3️⃣ Activa GitHub Pages
```
1. Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: main
4. Folder: / (root)
5. Save
6. ⏳ Espera 2 minutos
```

### 4️⃣ ¡Listo!
```
Tu sitio estará en:
https://TU-USUARIO.github.io/pokemon-deckbuilder/
```

---

## 🎯 Opción 2: Usar Git (RÁPIDO)

### Si tienes Git instalado:

```bash
# 1. Navega a la carpeta con tus archivos
cd /ruta/a/tus/archivos

# 2. Inicializa Git
git init

# 3. Agrega archivos
git add .

# 4. Primer commit
git commit -m "Initial commit"

# 5. Conecta con GitHub (REEMPLAZA CON TU URL)
git remote add origin https://github.com/TU-USUARIO/pokemon-deckbuilder.git

# 6. Sube
git branch -M main
git push -u origin main
```

### Luego:
```
1. Ve a tu repo en GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main, Folder: / (root)
5. Save
```

---

## 🎯 Opción 3: Script Automático

Si tienes Linux/Mac:

```bash
# 1. Da permisos al script
chmod +x deploy.sh

# 2. Ejecuta
./deploy.sh

# 3. Sigue las instrucciones en pantalla
```

---

## ✅ Verificación

Después de 2 minutos, visita:
```
https://TU-USUARIO.github.io/TU-REPO/
```

Deberías ver el deckbuilder funcionando! 🎉

---

## 🆘 Si algo sale mal

### Error 404
```
1. Ve a Settings → Pages
2. Verifica Branch: main, Folder: / (root)
3. Click Save otra vez
4. Espera 2-3 minutos más
5. Limpia caché (Ctrl + F5)
```

### Sitio no se actualiza
```
1. Limpia caché del navegador
2. Espera 5 minutos
3. Verifica en Actions que deploy fue exitoso
```

### No aparece nada
```
1. Verifica que index.html esté en la raíz
2. Verifica que el archivo se llame exactamente "index.html"
3. Revisa que el archivo no esté vacío
```

---

## 📞 Necesitas Ayuda?

1. Lee DEPLOYMENT.md (guía detallada)
2. Abre un Issue en GitHub
3. Contacta a la comunidad

---

## 🎉 ¡Eso es todo!

Solo 3 pasos y tu deckbuilder está en vivo! 🚀

**Comparte el link con tu comunidad de Pokémon TCG!** 🎴
