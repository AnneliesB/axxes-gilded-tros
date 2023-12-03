export const isSmellyItem = (name) => {
  return ['Duplicate Code', 'Long Methods', 'Ugly Variable Names'].includes(name);
}

export const isBackstagePass = (name) => {
  return ['Backstage passes for Re:Factor', 'Backstage passes for HAXX'].includes(name);
}

export const isGoodWine = (name) => {
  return ['Good Wine'].includes(name);
}

// "B-DAWG Keychain", being a legendary item, never has to be sold or decreases in Quality
export const isLegendaryItem = (name) => {
  return ['B-DAWG Keychain'].includes(name);
}

export const isDefaultItem = (name) => {
  return !isSmellyItem(name)
    && !isBackstagePass(name)
    && !isGoodWine(name)
    && !isLegendaryItem(name);
}

  // The Quality of an item is never more than 50
  export const sumWithMaxLimit = (num1, num2) => {
    const sum = num1 + num2;
    return sum <= 50 ? sum : 50;
  }

  // The Quality of an item is never negative
  export const subtractWithMinZero = (num1, num2) => {
    const result = num1 - num2;
    return result >= 0 ? result : 0;
  }
