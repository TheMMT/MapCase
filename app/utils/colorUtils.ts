export function getHueRotate(hexColor: string | undefined): number {
  if (!hexColor) return 0;
  
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  let h = 0;
  
  if (max !== min) {
    if (max === r) {
      h = 60 * ((g - b) / (max - min));
      if (g < b) h += 360;
    } else if (max === g) {
      h = 60 * ((b - r) / (max - min)) + 120;
    } else {
      h = 60 * ((r - g) / (max - min)) + 240;
    }
  }
  
  const blueMarkerHue = 240;
  
  return h - blueMarkerHue;
} 