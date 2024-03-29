const VALID_HEX_CHARS: string[] = "0123456789abcdef".split("");

export type RGBColor = {
  r: number;
  g: number;
  b: number;
};

export function isValidHex(hexOrNot?: string): boolean {
  if (hexOrNot === undefined) {
    return false;
  }

  if (hexOrNot.charAt(0) !== "#") {
    return false;
  }

  if (hexOrNot.slice(1).length !== 3 && hexOrNot.slice(1).length !== 6) {
    return false;
  }

  const invalidChars = hexOrNot
    .slice(1)
    .toLowerCase()
    .split("")
    .reduce(
      (acc, letter) => {
        if (VALID_HEX_CHARS.indexOf(letter) === -1) {
          return [...acc, letter];
        }

        return acc;
      },
      [] as string[]
    );

  if (invalidChars.length > 0) {
    return false;
  }

  return true;
}

export function isValidRGBColor({ r, g, b }: RGBColor) {
  if (r < 0 || r > 255 || Math.trunc(r) !== r) {
    return false;
  }

  if (g < 0 || g > 255 || Math.trunc(g) !== g) {
    return false;
  }

  if (b < 0 || b > 255 || Math.trunc(b) !== b) {
    return false;
  }

  return true;
}

export function getRGBFromHex(color: string): RGBColor {
  const rgbValue = {
    r: 0,
    g: 0,
    b: 0
  };

  if (!isValidHex(color)) {
    throw new Error("Not a valid hex color");
  }

  if (color.length === 7) {
    rgbValue.r = parseInt(`${color.slice(1, 3)}`, 16);
    rgbValue.g = parseInt(`${color.slice(3, 5)}`, 16);
    rgbValue.b = parseInt(`${color.slice(5)}`, 16);
  } else {
    rgbValue.r = parseInt(`${color.slice(1, 2)}${color.slice(1, 2)}`, 16);
    rgbValue.g = parseInt(`${color.slice(2, 3)}${color.slice(2, 3)}`, 16);
    rgbValue.b = parseInt(`${color.slice(3)}${color.slice(3)}`, 16);
  }

  return rgbValue;
}

export function getHexFromRGB({ r, g, b }: RGBColor): string {
  if (!isValidRGBColor({ r, g, b })) {
    throw new Error("Not a valid RGBColor");
  }

  const colorValue = [
    Number(r % 256).toString(16),
    Number(g % 256).toString(16),
    Number(b % 256).toString(16)
  ]
    .map(hexString => {
      if (hexString.length === 1) {
        return `0${hexString}`;
      }

      return hexString;
    })
    .join("");

  return `#${colorValue}`;
}

export function min(a: number, b: number): number {
  if (a < b) {
    return a;
  }

  return b;
}

export function max(a: number, b: number): number {
  if (b < a) {
    return a;
  }

  return b;
}

export function lightenHex(hex: string, amount: number) {
  if (!isValidHex(hex)) {
    throw new Error("Not a valid hex color");
  }

  if (amount < 0 || amount > 1) {
    throw new Error("Only values between 0 and 1 are valid");
  }

  if (amount === 1) {
    return getHexFromRGB({ r: 255, g: 255, b: 255 });
  }

  const rgbValue = getRGBFromHex(hex);

  const rNew = Math.floor(min(255, rgbValue.r * (1 + amount)));
  const gNew = Math.floor(min(255, rgbValue.g * (1 + amount)));
  const bNew = Math.floor(min(255, rgbValue.b * (1 + amount)));

  const newColor: RGBColor = {
    r: rNew,
    g: gNew,
    b: bNew
  };

  return getHexFromRGB(newColor);
}

export function darkenHex(hex: string, amount: number) {
  const rgbValue = getRGBFromHex(hex);

  if (amount < 0 || amount > 1) {
    throw new Error("Only values between 0 and 1 are valid");
  }

  if (amount === 1) {
    return getHexFromRGB({ r: 0, g: 0, b: 0 });
  }

  const rNew = Math.floor(max(255, rgbValue.r * (1 - amount)));
  const gNew = Math.floor(max(255, rgbValue.g * (1 - amount)));
  const bNew = Math.floor(max(255, rgbValue.b * (1 - amount)));

  const newColor: RGBColor = {
    r: rNew,
    g: gNew,
    b: bNew
  };

  return getHexFromRGB(newColor);
}
