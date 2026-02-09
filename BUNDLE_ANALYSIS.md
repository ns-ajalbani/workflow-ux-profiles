# Bundle Analysis

This project includes **rollup-plugin-visualizer** to analyze and visualize your bundle size.

## What It Does

The bundle analyzer:
- Visualizes bundle composition
- Shows file sizes (both raw and gzipped)
- Identifies the largest modules
- Helps optimize bundle size
- Generates an interactive HTML report

## How to Use

### 1. Build the Project

```bash
npm run build
```

### 2. View the Report

After building, open `dist/stats.html` in your browser to see:
- Interactive treemap visualization
- File sizes in bytes and gzipped
- Module breakdown
- Percentage of total bundle

### Automatic Opening

The analyzer is configured to automatically open `dist/stats.html` in your default browser after each build.

## Configuration

Located in `vite.config.ts`:

```typescript
visualizer({
  open: true,              // Auto-open in browser
  gzipSize: true,          // Show gzip sizes
  brotliSize: true,        // Show brotli sizes
  filename: 'dist/stats.html',
})
```

## Bundle Optimization Tips

1. **Large Modules**: Look for unexpectedly large files
2. **Duplicates**: Check if the same dependency appears multiple times
3. **Dead Code**: Use tree-shaking to remove unused code
4. **Code Splitting**: Lazy load heavy components
5. **Shared Dependencies**: Module Federation helps avoid duplication

## Current Bundle Breakdown

After the latest build:
- Total size: ~460 KB (raw)
- Gzipped: ~142 KB
- Largest: react-router-dom (~193 KB raw, ~63 KB gzipped)
- App bundle: ~181 KB raw (~57 KB gzipped)

## Next Steps

1. Review `dist/stats.html` to identify optimization opportunities
2. Consider lazy loading large components
3. Use dynamic imports for routes
4. Profile which dependencies contribute most to size

## More Information

- [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
