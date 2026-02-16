#!/bin/bash

# 🚀 Script de Despliegue Rápido para GitHub Pages
# Universal Deckbuilder Pro - Pokémon TCG

echo "🎴 Universal Deckbuilder Pro - Deployment Script"
echo "================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    print_error "Git no está instalado. Por favor instala Git primero."
    exit 1
fi

print_success "Git está instalado"

# Verificar si estamos en un repositorio git
if [ ! -d ".git" ]; then
    print_info "Inicializando repositorio Git..."
    git init
    print_success "Repositorio Git inicializado"
else
    print_info "Repositorio Git ya existe"
fi

# Verificar si hay cambios
if [[ -n $(git status -s) ]]; then
    print_info "Hay cambios pendientes"
    
    # Mostrar archivos modificados
    echo ""
    print_info "Archivos modificados:"
    git status -s
    echo ""
    
    # Preguntar si desea hacer commit
    read -p "¿Deseas hacer commit de estos cambios? (s/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        # Agregar todos los archivos
        print_info "Agregando archivos..."
        git add .
        print_success "Archivos agregados"
        
        # Pedir mensaje de commit
        read -p "Mensaje de commit: " commit_message
        
        if [ -z "$commit_message" ]; then
            commit_message="Update: $(date '+%Y-%m-%d %H:%M:%S')"
        fi
        
        # Hacer commit
        git commit -m "$commit_message"
        print_success "Commit realizado: $commit_message"
    else
        print_warning "Commit cancelado"
        exit 0
    fi
else
    print_info "No hay cambios pendientes"
fi

# Verificar si hay remote configurado
if ! git remote | grep -q 'origin'; then
    print_warning "No hay remote 'origin' configurado"
    echo ""
    print_info "Para configurar el remote, ejecuta:"
    echo "git remote add origin https://github.com/TU-USUARIO/TU-REPO.git"
    echo ""
    exit 1
fi

# Obtener la URL del remote
remote_url=$(git remote get-url origin)
print_info "Remote configurado: $remote_url"

# Verificar branch actual
current_branch=$(git branch --show-current)

if [ -z "$current_branch" ]; then
    print_info "Creando branch main..."
    git checkout -b main
    current_branch="main"
    print_success "Branch main creada"
fi

print_info "Branch actual: $current_branch"

# Si no estamos en main, preguntar si cambiar
if [ "$current_branch" != "main" ]; then
    read -p "No estás en la branch 'main'. ¿Deseas cambiar? (s/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        git checkout main 2>/dev/null || git checkout -b main
        print_success "Cambiado a branch main"
    fi
fi

# Push a GitHub
echo ""
print_info "Subiendo cambios a GitHub..."
echo ""

if git push -u origin main; then
    print_success "¡Código subido exitosamente!"
    echo ""
    echo "🎉 ¡Despliegue completado!"
    echo ""
    print_info "Tu sitio estará disponible en aproximadamente 2 minutos en:"
    
    # Extraer usuario y repo de la URL
    if [[ $remote_url =~ github\.com[:/](.+)/(.+)(\.git)?$ ]]; then
        user="${BASH_REMATCH[1]}"
        repo="${BASH_REMATCH[2]}"
        repo="${repo%.git}"  # Remover .git si existe
        
        site_url="https://${user}.github.io/${repo}/"
        echo ""
        echo "🔗 $site_url"
        echo ""
        
        print_info "Pasos siguientes:"
        echo "1. Ve a tu repositorio en GitHub"
        echo "2. Settings → Pages"
        echo "3. Verifica que Source sea: 'Deploy from a branch'"
        echo "4. Branch: main, Folder: / (root)"
        echo "5. Espera 2 minutos y visita el link de arriba"
    fi
else
    print_error "Error al subir código"
    echo ""
    print_info "Posibles soluciones:"
    echo "1. Verifica tu conexión a internet"
    echo "2. Asegúrate de tener permisos en el repositorio"
    echo "3. Verifica que el remote esté bien configurado:"
    echo "   git remote -v"
    exit 1
fi

echo ""
print_success "¡Script completado!"
