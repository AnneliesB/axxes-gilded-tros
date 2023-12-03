import {
  isSmellyItem,
  isBackstagePass,
  isGoodWine,
  isLegendaryItem,
  isDefaultItem,
  sumWithMaxLimit,
  subtractWithMinZero,
} from './gilded-tros.utils'
export class GildedTros {
  constructor(items) {
    this.items = items;
  }

  //Smelly items degrade in Quality twice as fast as normal items
  handleSmellyItems(item) {
    if (item.sellIn < 0) {
      // Once the sell by date has passed, Quality degrades twice as fast
      item.quality = subtractWithMinZero(item.quality, 4);
    } else {
      item.quality = subtractWithMinZero(item.quality, 2);
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
      item.quality = sumWithMaxLimit(item.quality, 1);
    }

    // All conferences with a sellIn equals to 10, 9, 8, 7 or 6: we increase the quality by 2 (max 50)
    if (item.sellIn <= 10 && item.sellIn > 5) {
      item.quality = sumWithMaxLimit(item.quality, 2);
    }

    // All conferences with a sellIn equals to 5, 4, 3, 2, 1 or 0: we increase the quality by 3 (max 50)
    if (item.sellIn <= 5 && item.sellIn >= 0) {
      item.quality = sumWithMaxLimit(item.quality, 3);
    }

    // All conferences with a negative sell by date have a quality of 0
    if (item.sellIn < 0) {
      item.quality = 0;
    }
  }

  // "Good Wine" actually increases in Quality the older it gets
  handleGoodWine(item) {
    item.quality = sumWithMaxLimit(item.quality, 1);
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
      item.quality = subtractWithMinZero(item.quality, 2);
    } else {
      item.quality = subtractWithMinZero(item.quality, 1);
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
      if (!isLegendaryItem(itemRef.name)) {
        itemRef.sellIn--;
      }

      if (isSmellyItem(itemRef.name)) {
        this.handleSmellyItems(itemRef);
      }

      if (isBackstagePass(itemRef.name)) {
        this.handleBackstagePasses(itemRef);
      }

      if (isGoodWine(itemRef.name)) {
        this.handleGoodWine(itemRef);
      }

      if(isLegendaryItem(itemRef.name)) {
        this.handleLegendaryItems(itemRef);
      }
      
      // Any items that are not "Good Wine", "Legendary", "Smelly"
      // or "Backstage passes" are classified as "default"
      if (isDefaultItem(itemRef.name)) {
        this.handleDefault(itemRef);
      }
    }
  }
}
