## Getting Started with Multi-Tenant Landing Pages

### Quick Start Guide

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

#### 3. Test Different Tenants

**Option A: Edit hosts file** (Recommended for local testing)

Add to your hosts file:
- Windows: `C:\Windows\System32\drivers\etc\hosts`
- Mac/Linux: `/etc/hosts`

```
127.0.0.1 default.localhost
127.0.0.1 publisher-1.localhost
127.0.0.1 publisher-2.localhost
```

Then visit:
- http://default.localhost:3000
- http://publisher-1.localhost:3000
- http://publisher-2.localhost:3000

**Option B: Use localhost** (loads default tenant)

```
http://localhost:3000
```

### Adding Your First Tenant

1. Open `config/tenants.json`
2. Add a new tenant configuration:

```json
"my-publisher": {
  "id": "my-publisher",
  "name": "My Publisher Name",
  "template": "default",
  "branding": {
    "logo": "https://via.placeholder.com/200x60/...",
    "primaryColor": "#0066cc",
    "secondaryColor": "#ffcc00",
    "accentColor": "#ff6600",
    "font": "inter"
  },
  "features": {
    "speakers": true,
    "statistics": true,
    "readings": true,
    "media": false,
    "newsletter": true
  },
  "content": {
    "hero": {
      "title": "Your Amazing Title",
      "description": "Your compelling description",
      "image": "https://via.placeholder.com/1920x1080/...",
      "ctaText": "Get Started",
      "ctaLink": "https://your-cms-url.com"
    },
    "statistics": [
      { "label": "Users", "value": "10000", "suffix": "+" }
    ],
    "assetCategories": [
      {
        "id": "category-1",
        "title": "Category Name",
        "description": "Description here",
        "image": "https://via.placeholder.com/800x600/...",
        "itemCount": 100,
        "link": "https://your-cms-url.com/category"
      }
    ],
    "speakers": [],
    "footer": {
      "description": "Your footer description",
      "links": [],
      "social": [],
      "copyright": "© 2025 Your Company"
    }
  },
  "cmsLinks": {
    "store": "https://your-cms-url.com"
  }
}
```

3. Save the file
4. Visit http://my-publisher.localhost:3000

No rebuild needed! 🎉

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Customizing Colors

Colors are automatically applied via CSS variables. Just change them in the tenant config:

```json
"branding": {
  "primaryColor": "#1a237e",    // Main brand color
  "secondaryColor": "#ffd600",  // Accent color
  "accentColor": "#00bfa5"      // Optional highlight color
}
```

The system automatically generates lighter and darker shades!

### Customizing Fonts

Supported fonts (loaded from Google Fonts):
- `inter` (default)
- `roboto`
- `open-sans`
- `lato`
- `montserrat`

Just set `"font": "roboto"` in branding config.

### Choosing a Template

Available templates:
- `default` - Full-featured with all sections
- `magazine` - Editorial focus (no speakers)
- `minimal` - Coming soon

Set in tenant config:
```json
"template": "default"
```

### Deployment

#### Deploy to Vercel

```bash
vercel
```

#### Deploy to Netlify

```bash
netlify deploy --prod
```

### Need Help?

- Read the full [README.md](./README.md)
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Review example configs in `config/tenants.json`

### Common Issues

**Issue**: Subdomain doesn't work locally  
**Solution**: Edit your hosts file (see Option A above)

**Issue**: Changes not appearing  
**Solution**: Config changes are instant, but CSS might need a hard refresh (Ctrl+Shift+R)

**Issue**: Build errors  
**Solution**: Run `npm install` and check that all dependencies are installed

---

**Ready to build?** Start by modifying the default tenant in `config/tenants.json`! 🚀

