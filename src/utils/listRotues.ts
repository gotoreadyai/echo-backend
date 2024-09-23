import { Application } from 'express';

// Kolory dla metod HTTP
const methodColors: Record<string, string> = {
    GET: '\x1b[32m',    // Zielony
    POST: '\x1b[33m',   // Żółty
    PUT: '\x1b[34m',    // Niebieski
    DELETE: '\x1b[31m', // Czerwony
    PATCH: '\x1b[35m',  // Fioletowy
    OPTIONS: '\x1b[36m',// Turkusowy
    HEAD: '\x1b[37m',   // Biały
};

// Funkcja do generowania losowego koloru HSL
const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70;
    const lightness = 50;
    return `\x1b[38;2;${hslToRgb(hue, saturation, lightness).join(';')}m`;
};

// Funkcja do konwersji HSL na RGB
const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
};

export const listRoutes = (app: Application) => {
    const layers = app._router.stack.filter((layer: any) => layer.route || (layer.name === 'router' && layer.handle.stack));

    const maxMethodLength = Math.max(...layers
        .map((layer: any) => {
            if (layer.route) {
                return Object.keys(layer.route.methods)[0].length;
            } else if (layer.name === 'router') {
                return Math.max(...layer.handle.stack.map((routerLayer: any) => routerLayer.route ? Object.keys(routerLayer.route.methods)[0].length : 0));
            }
            return 0;
        })
    );

    const groupedRoutes: Record<string, Array<{ method: string, path: string }>> = {};
    const colorMap: Record<string, string> = {};

    layers.forEach((layer: any) => {
        if (layer.route) {
            const route = layer.route;
            const method = `${Object.keys(route.methods)[0].toUpperCase()}`;
            const path = route.path;

            const basePath = path.split('/')[1];

            if (!groupedRoutes[basePath]) {
                groupedRoutes[basePath] = [];
                colorMap[basePath] = generateRandomColor(); // Wygeneruj nowy kolor dla nowej grupy
            }

            groupedRoutes[basePath].push({ method, path });
        } else if (layer.name === 'router') {
            layer.handle.stack.forEach((routerLayer: any) => {
                if (routerLayer.route) {
                    const route = routerLayer.route;
                    const method = `${Object.keys(route.methods)[0].toUpperCase()}`;
                    const path = route.path;

                    const basePath = path.split('/')[1];

                    if (!groupedRoutes[basePath]) {
                        groupedRoutes[basePath] = [];
                        colorMap[basePath] = generateRandomColor(); // Wygeneruj nowy kolor dla nowej grupy
                    }

                    groupedRoutes[basePath].push({ method, path });
                }
            });
        }
    });

    Object.keys(groupedRoutes).forEach(basePath => {
        console.log(''); // Przerwa między grupami
        const color = colorMap[basePath];
        groupedRoutes[basePath].forEach(route => {
            const methodColor = methodColors[route.method] || '\x1b[37m'; // Domyślnie biały kolor
            const padding = ' '.repeat(maxMethodLength - route.method.length);
            console.log(`${methodColor}${route.method}${padding} ${color}${route.path}\x1b[0m`);
        });
    });
};
