# ChromeMind Assets

## Ícones da Extensão

Os ícones precisam estar nos seguintes tamanhos:
- `icon16.png` - 16x16px (barra de ferramentas)
- `icon48.png` - 48x48px (página de extensões)
- `icon128.png` - 128x128px (Chrome Web Store)

### Gerando Ícones

Use o arquivo `icon.svg` como base e converta para PNG:

**Método 1: Online (Rápido)**
1. Abra https://convertio.co/svg-png/
2. Upload do `icon.svg`
3. Baixe e redimensione para 16px, 48px, 128px

**Método 2: ImageMagick (Local)**
```bash
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png  
convert icon.svg -resize 128x128 icon128.png
```

**Método 3: Figma/Design Tool**
1. Importe o SVG
2. Exporte em PNG nos tamanhos necessários

### Design

- **Cor principal**: #1a73e8 (Google Blue)
- **Ícone**: 🧠 (representando IA)
- **Estilo**: Moderno, arredondado, clean
- **Fundo**: Gradiente azul

### Temporary Workaround

Para desenvolvimento, você pode usar ícones de placeholder online:
1. Baixe ícones de https://via.placeholder.com/
2. Renomeie para os tamanhos corretos
3. Substitua quando tiver os ícones finais

Exemplo:
```bash
curl -o icon16.png "https://via.placeholder.com/16x16/1a73e8/ffffff?text=AI"
curl -o icon48.png "https://via.placeholder.com/48x48/1a73e8/ffffff?text=AI"  
curl -o icon128.png "https://via.placeholder.com/128x128/1a73e8/ffffff?text=AI"
```