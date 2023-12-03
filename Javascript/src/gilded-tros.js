export class GildedTros {
  constructor(items) {
    this.items = items;
  }

  isSmellyItem(name) {
    return ['Duplicate Code', 'Long Methods', 'Ugly Variable Names'].includes(name);
  }

  isBackstagePass(name) {
    return ['Backstage passes for Re:Factor', 'Backstage passes for HAXX'].includes(name);
  }

  isGoodWine(name) {
    return ['Good Wine'].includes(name);
  }

  // "B-DAWG Keychain", being a legendary item, never has to be sold or decreases in Quality
  isLegendaryItem(name) {
    return ['B-DAWG Keychain'].includes(name);
  }

  isDefaultItem(name) {
    return !this.isSmellyItem(name)
      && !this.isBackstagePass(name)
      && !this.isGoodWine(name)
      && !this.isLegendaryItem(name);
  }

  // The Quality of an item is never more than 50
  sumWithMaxLimit(num1, num2) {
    const sum = num1 + num2;
    return sum <= 50 ? sum : 50;
  }

  // The Quality of an item is never negative
  subtractWithMinZero(num1, num2) {
    const result = num1 - num2;
    return result >= 0 ? result : 0;
  }

  //Smelly items degrade in Quality twice as fast as normal items
  handleSmellyItems(item) {
    if (item.sellIn < 0) {
      // Once the sell by date has passed, Quality degrades twice as fast
      item.quality = this.subtractWithMinZero(item.quality, 4);
    } else {
      item.quality = this.subtractWithMinZero(item.quality, 2);
    }
  }

  /**
   * "Backstage passes" for very interesting conferences increases in Quality as its SellIn value approaches;
   * Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but
   * Quality drops to 0 after the conference
   */
  handleBackstagePasses(item) {
    // All conferences with a sellIn more than 10: we increase the quality by 1 (max 50)
    if (item.sellIn > 10) {
      item.quality = this.sumWithMaxLimit(item.quality, 1);
    }

    // All conferences with a sellIn equals to 10, 9, 8, 7 or 6: we increase the quality by 2 (max 50)
    if (item.sellIn <= 10 && item.sellIn > 5) {
      item.quality = this.sumWithMaxLimit(item.quality, 2);
    }

    // All conferences with a sellIn equals to 5, 4, 3, 2, 1 or 0: we increase the quality by 3 (max 50)
    if (item.sellIn <= 5 && item.sellIn >= 0) {
      item.quality = this.sumWithMaxLimit(item.quality, 3);
    }

    // All conferences with a negative sell by date have a quality of 0
    if (item.sellIn < 0) {
      item.quality = 0;
    }
  }

  // "Good Wine" actually increases in Quality the older it gets
  handleGoodWine(item) {
    item.quality = this.sumWithMaxLimit(item.quality, 1);
  }

  // Legendary items always have Quality 80.
  // We set this value to 80, just in case the provided data is faulty.
  handleLegendaryItems(item) {
    item.quality = 80;
  }

  // At the end of each day our system lowers both (sellIn & quality) values for every item
  handleDefault(item) {
    if (item.sellIn < 0) {
      // Once the sell by date has passed, Quality degrades twice as fast
      item.quality = this.subtractWithMinZero(item.quality, 2);
    } else {
      item.quality = this.subtractWithMinZero(item.quality, 1);
    }
  }

  /**
   * In general: an item can never have its Quality increase above 50,
   * however legendary items always have Quality 80.
   * The Quality of an item is never negative.
   */
  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      const itemRef = this.items[i];
      // At the end of each day, the sellIn value decreases for all items except Legendary items
      if (!this.isLegendaryItem(itemRef.name)) {
        itemRef.sellIn--;
      }

      if (this.isSmellyItem(itemRef.name)) {
        this.handleSmellyItems(itemRef);
      }

      if (this.isBackstagePass(itemRef.name)) {
        this.handleBackstagePasses(itemRef);
      }

      if (this.isGoodWine(itemRef.name)) {
        this.handleGoodWine(itemRef);
      }

      if(this.isLegendaryItem(itemRef.name)) {
        this.handleLegendaryItems(itemRef);
      }
      
      // Any items that are not "Good Wine", "Legendary", "Smelly"
      // or "Backstage passes" are classified as "default"
      if (this.isDefaultItem(itemRef.name)) {
        this.handleDefault(itemRef);
      }
    }
  }
}
