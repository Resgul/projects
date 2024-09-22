import { Vec2 } from 'cc';

// Основная функция для генерации массива точек кривой
export function catmullRomSpline(points: Array<Vec2>, numSegments: number = 20) {
    if (points.length < 3) {
        throw new Error("Необходимо минимум 3 точки");
    }

    const curvePoints = [];

    for (let i = 0; i < points.length - 1; i++) {
        // Получаем соседние точки
        const p0 = points[i === 0 ? i : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

        // Генерация сегментов кривой между p1 и p2
        for (let j = 0; j < numSegments; j++) {
            const t = j / numSegments;

            const t2 = t * t;
            const t3 = t2 * t;

            const x = 0.5 * ((2 * p1.x) +
                (-p0.x + p2.x) * t +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

            const y = 0.5 * ((2 * p1.y) +
                (-p0.y + p2.y) * t +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

            curvePoints.push({ x, y });
        }
    }

    return curvePoints;
}