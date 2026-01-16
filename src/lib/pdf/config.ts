export const AD_HOC_COLORS = [
    { name: 'black', class: 'bg-slate-900', ring: 'ring-slate-900', hex: '#0f172a' },
    { name: 'blue', class: 'bg-blue-600', ring: 'ring-blue-600', hex: '#2563eb' },
    { name: 'red', class: 'bg-red-600', ring: 'ring-red-600', hex: '#dc2626' },
    { name: 'green', class: 'bg-emerald-600', ring: 'ring-emerald-600', hex: '#059669' },
] as const;

export type AdHocColorName = typeof AD_HOC_COLORS[number]['name'];
