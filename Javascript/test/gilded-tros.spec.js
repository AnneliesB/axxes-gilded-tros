import { Item } from '../src/item';
import { GildedTros } from '../src/gilded-tros';

describe('GildedTros', () => {
  test('Test Item', () => {
    const items = [new Item('foo', 0, 0)];
    const app = new GildedTros(items);
    app.updateQuality();
    expect(app.items[0].name).toEqual('foo');
    expect(app.items[0].sellIn).toEqual(-1);
    expect(app.items[0].quality).toEqual(0);
  });

  describe('At the end of each day our system lowers both sellIn and quality for every item', () => {
    test('Should decrease sellIn and quality by one for every item', () => {
      const app = new GildedTros([
        new Item('item01', 15, 20),
        new Item('item02', 100, 50),
        new Item('item03', 50, 25),
      ]);
      app.updateQuality();
      expect(app.items[0].name).toEqual('item01');
      expect(app.items[0].sellIn).toEqual(14);
      expect(app.items[0].quality).toEqual(19);

      expect(app.items[1].name).toEqual('item02');
      expect(app.items[1].sellIn).toEqual(99);
      expect(app.items[1].quality).toEqual(49);

      expect(app.items[2].name).toEqual('item03');
      expect(app.items[2].sellIn).toEqual(49);
      expect(app.items[2].quality).toEqual(24);
    });
  });

  describe('Once the sell by date has passed, Quality degrades twice as fast', () => {
    test('Should decrease the quality once when the sell by date has not passed', () => {
      const app = new GildedTros([
        new Item('item01', 1, 21),
        new Item('item02', 1, 20),
        new Item('item03', 1, 1),
      ]);
      app.updateQuality();
      expect(app.items[0].name).toEqual('item01');
      expect(app.items[0].sellIn).toEqual(0);
      expect(app.items[0].quality).toEqual(20);

      expect(app.items[1].name).toEqual('item02');
      expect(app.items[1].sellIn).toEqual(0);
      expect(app.items[1].quality).toEqual(19);

      expect(app.items[2].name).toEqual('item03');
      expect(app.items[2].sellIn).toEqual(0);
      expect(app.items[2].quality).toEqual(0);
    });

    test('Should decrease the quality twice when the sell by date has passed', () => {
      const app = new GildedTros([
        new Item('item03', 0, 20),
        new Item('item04', -1, 18),
      ]);
      app.updateQuality();
      expect(app.items[0].name).toEqual('item03');
      expect(app.items[0].sellIn).toEqual(-1);
      expect(app.items[0].quality).toEqual(18);

      expect(app.items[1].name).toEqual('item04');
      expect(app.items[1].sellIn).toEqual(-2);
      expect(app.items[1].quality).toEqual(16);
    });
  });

  describe('The Quality of an item is never negative', () => {
    test('Should never decrease the quality below 0', () => {
      const app = new GildedTros([
        new Item('item01', 1, 0),
        new Item('item02', 0, 0),
        new Item('item03', -1, 0),
        new Item('Backstage passes for Re:Factor', -1, 0),
        new Item('Duplicate Code', -1, 1),
        new Item('Long Methods', -1, 1),
        new Item('Ugly Variable Names', -1, 1),
      ]);
      app.updateQuality();
      expect(app.items[0].name).toEqual('item01');
      expect(app.items[0].sellIn).toEqual(0);
      expect(app.items[0].quality).toEqual(0);

      expect(app.items[1].name).toEqual('item02');
      expect(app.items[1].sellIn).toEqual(-1);
      expect(app.items[1].quality).toEqual(0);

      expect(app.items[2].name).toEqual('item03');
      expect(app.items[2].sellIn).toEqual(-2);
      expect(app.items[2].quality).toEqual(0);

      expect(app.items[3].name).toEqual('Backstage passes for Re:Factor');
      expect(app.items[3].sellIn).toEqual(-2);
      expect(app.items[3].quality).toEqual(0);

      expect(app.items[4].name).toEqual('Duplicate Code');
      expect(app.items[4].sellIn).toEqual(-2);
      expect(app.items[4].quality).toEqual(0);

      expect(app.items[5].name).toEqual('Long Methods');
      expect(app.items[5].sellIn).toEqual(-2);
      expect(app.items[5].quality).toEqual(0);

      expect(app.items[6].name).toEqual('Ugly Variable Names');
      expect(app.items[6].sellIn).toEqual(-2);
      expect(app.items[6].quality).toEqual(0);
    });
  });

  describe('"Good Wine" actually increases in Quality the older it gets', () => {
    test('Should increase the quality by one until 50', () => {
      const app = new GildedTros([
        new Item('Good Wine', 10, 0),
        new Item('Good Wine', 5, 5),
        new Item('Good Wine', 0, 10),
        new Item('Good Wine', -10, 20),
        new Item('Good Wine', -11, 50),
      ]);
      app.updateQuality();
      expect(app.items[0].name).toEqual('Good Wine');
      expect(app.items[0].sellIn).toEqual(9);
      expect(app.items[0].quality).toEqual(1);

      expect(app.items[1].name).toEqual('Good Wine');
      expect(app.items[1].sellIn).toEqual(4);
      expect(app.items[1].quality).toEqual(6);

      expect(app.items[2].name).toEqual('Good Wine');
      expect(app.items[2].sellIn).toEqual(-1);
      expect(app.items[2].quality).toEqual(11);

      expect(app.items[3].name).toEqual('Good Wine');
      expect(app.items[3].sellIn).toEqual(-11);
      expect(app.items[3].quality).toEqual(21);

      expect(app.items[4].name).toEqual('Good Wine');
      expect(app.items[4].sellIn).toEqual(-12);
      expect(app.items[4].quality).toEqual(50);
    });
  });

  describe('The Quality of an item is never more than 50', () => {
    test('The quality should increase up to 50 max', () => {
      const app = new GildedTros([
        new Item('Good Wine', -10, 50),
        new Item('Backstage passes for Re:Factor', 3, 44),
        new Item('Backstage passes for Re:Factor', 8, 44),
        new Item('Backstage passes for Re:Factor', 8, 47),
        new Item('Backstage passes for Re:Factor', 8, 50),
        new Item('Backstage passes for HAXX', 8, 50),
      ]);
      app.updateQuality();
      expect(app.items[0].name).toEqual('Good Wine');
      expect(app.items[0].sellIn).toEqual(-11);
      expect(app.items[0].quality).toEqual(50);

      expect(app.items[1].name).toEqual('Backstage passes for Re:Factor');
      expect(app.items[1].sellIn).toEqual(2);
      expect(app.items[1].quality).toEqual(47);

      expect(app.items[2].name).toEqual('Backstage passes for Re:Factor');
      expect(app.items[2].sellIn).toEqual(7);
      expect(app.items[2].quality).toEqual(46);

      expect(app.items[3].name).toEqual('Backstage passes for Re:Factor');
      expect(app.items[3].sellIn).toEqual(7);
      expect(app.items[3].quality).toEqual(49);

      expect(app.items[4].name).toEqual('Backstage passes for Re:Factor');
      expect(app.items[4].sellIn).toEqual(7);
      expect(app.items[4].quality).toEqual(50);

      expect(app.items[5].name).toEqual('Backstage passes for HAXX');
      expect(app.items[5].sellIn).toEqual(7);
      expect(app.items[5].quality).toEqual(50);
    });
  });

  describe('"B-DAWG Keychain", being a legendary item, never has to be sold or decreases in Quality', () => {
    test('Should not change the sellIn and quality values for legendary items', () => {
      const app = new GildedTros([
        new Item('B-DAWG Keychain', 0, 80),
        new Item('B-DAWG Keychain', -10, 80),
        new Item('B-DAWG Keychain', -10, 10),
      ]);
      app.updateQuality();
      expect(app.items[0].name).toEqual('B-DAWG Keychain');
      expect(app.items[0].sellIn).toEqual(0);
      expect(app.items[0].quality).toEqual(80);

      expect(app.items[1].name).toEqual('B-DAWG Keychain');
      expect(app.items[1].sellIn).toEqual(-10);
      expect(app.items[1].quality).toEqual(80);

      expect(app.items[2].name).toEqual('B-DAWG Keychain');
      expect(app.items[2].sellIn).toEqual(-10);
      expect(app.items[2].quality).toEqual(80);
    });
  });

  describe('"Backstage passes" for very interesting conferences increases in Quality as its SellIn value approaches', () => {
    describe('Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but', () => {
      test('Should update the quality by one when sellIn is more than 10', () => {
        const app = new GildedTros([
          new Item('Backstage passes for Re:Factor', 20, 20),
          new Item('Backstage passes for HAXX', 15, 25),
        ]);
        app.updateQuality();

        expect(app.items[0].name).toEqual('Backstage passes for Re:Factor');
        expect(app.items[0].sellIn).toEqual(19);
        expect(app.items[0].quality).toEqual(21);

        expect(app.items[1].name).toEqual('Backstage passes for HAXX');
        expect(app.items[1].sellIn).toEqual(14);
        expect(app.items[1].quality).toEqual(26);
      });

      test('Should update the quality by two when sellIn equals or is less than 10 but more than 5', () => {
        const app = new GildedTros([
          new Item('Backstage passes for Re:Factor', 10, 25),
          new Item('Backstage passes for Re:Factor', 9, 25),

          new Item('Backstage passes for HAXX', 10, 25),
          new Item('Backstage passes for HAXX', 9, 25),
        ]);
        app.updateQuality();

        expect(app.items[0].name).toEqual('Backstage passes for Re:Factor');
        expect(app.items[0].sellIn).toEqual(9);
        expect(app.items[0].quality).toEqual(27);

        expect(app.items[1].name).toEqual('Backstage passes for Re:Factor');
        expect(app.items[1].sellIn).toEqual(8);
        expect(app.items[1].quality).toEqual(27);

        expect(app.items[2].name).toEqual('Backstage passes for HAXX');
        expect(app.items[2].sellIn).toEqual(9);
        expect(app.items[2].quality).toEqual(27);

        expect(app.items[3].name).toEqual('Backstage passes for HAXX');
        expect(app.items[3].sellIn).toEqual(8);
        expect(app.items[3].quality).toEqual(27);
      });

      test('Should update the quality by three when sellIn equals or is less than 5', () => {
        const app = new GildedTros([
          new Item('Backstage passes for Re:Factor', 5, 25),
          new Item('Backstage passes for Re:Factor', 4, 25),

          new Item('Backstage passes for HAXX', 5, 25),
          new Item('Backstage passes for HAXX', 4, 25),
        ]);
        app.updateQuality();

        expect(app.items[0].name).toEqual('Backstage passes for Re:Factor');
        expect(app.items[0].sellIn).toEqual(4);
        expect(app.items[0].quality).toEqual(28);

        expect(app.items[1].name).toEqual('Backstage passes for Re:Factor');
        expect(app.items[1].sellIn).toEqual(3);
        expect(app.items[1].quality).toEqual(28);

        expect(app.items[2].name).toEqual('Backstage passes for HAXX');
        expect(app.items[2].sellIn).toEqual(4);
        expect(app.items[2].quality).toEqual(28);

        expect(app.items[3].name).toEqual('Backstage passes for HAXX');
        expect(app.items[3].sellIn).toEqual(3);
        expect(app.items[3].quality).toEqual(28);
      });

      test('Should update the quality by three when sellIn equals 1', () => {
        const app = new GildedTros([
          new Item('Backstage passes for Re:Factor', 1, 25),
          new Item('Backstage passes for HAXX', 1, 25),
        ]);
        app.updateQuality();

        expect(app.items[0].name).toEqual('Backstage passes for Re:Factor');
        expect(app.items[0].sellIn).toEqual(0);
        expect(app.items[0].quality).toEqual(28);

        expect(app.items[1].name).toEqual('Backstage passes for HAXX');
        expect(app.items[1].sellIn).toEqual(0);
        expect(app.items[1].quality).toEqual(28);
      });
    });

    describe('Quality drops to 0 after the conference', () => {
      test('Should set the quality to 0 after the conference has happened', () => {
        const app = new GildedTros([
          new Item('Backstage passes for Re:Factor', 0, 50),
          new Item('Backstage passes for Re:Factor', -1, 0),

          new Item('Backstage passes for HAXX', 0, 50),
          new Item('Backstage passes for HAXX', -1, 0),
        ]);
        app.updateQuality();

        expect(app.items[0].name).toEqual('Backstage passes for Re:Factor');
        expect(app.items[0].sellIn).toEqual(-1);
        expect(app.items[0].quality).toEqual(0);

        expect(app.items[1].name).toEqual('Backstage passes for Re:Factor');
        expect(app.items[1].sellIn).toEqual(-2);
        expect(app.items[1].quality).toEqual(0);

        expect(app.items[2].name).toEqual('Backstage passes for HAXX');
        expect(app.items[2].sellIn).toEqual(-1);
        expect(app.items[2].quality).toEqual(0);

        expect(app.items[3].name).toEqual('Backstage passes for HAXX');
        expect(app.items[3].sellIn).toEqual(-2);
        expect(app.items[3].quality).toEqual(0);

      });
    });
  });

  describe('Smelly items ("Duplicate Code", "Long Methods", "Ugly Variable Names") degrade in Quality twice as fast as normal items', () => {
    test('Should decrease quality by two', () => {
      const app = new GildedTros([
        new Item('Duplicate Code', 3, 6),
        new Item('Long Methods', 1, 2),
        new Item('Ugly Variable Names', 10, 10),
        new Item('Ugly Variable Names', 5, 9),
        new Item('Ugly Variable Names', 1, 1),
      ]);
      app.updateQuality();
      expect(app.items[0].name).toEqual('Duplicate Code');
      expect(app.items[0].sellIn).toEqual(2);
      expect(app.items[0].quality).toEqual(4);

      expect(app.items[1].name).toEqual('Long Methods');
      expect(app.items[1].sellIn).toEqual(0);
      expect(app.items[1].quality).toEqual(0);

      expect(app.items[2].name).toEqual('Ugly Variable Names');
      expect(app.items[2].sellIn).toEqual(9);
      expect(app.items[2].quality).toEqual(8);

      expect(app.items[3].name).toEqual('Ugly Variable Names');
      expect(app.items[3].sellIn).toEqual(4);
      expect(app.items[3].quality).toEqual(7);

      expect(app.items[4].name).toEqual('Ugly Variable Names');
      expect(app.items[4].sellIn).toEqual(0);
      expect(app.items[4].quality).toEqual(0);
    });

    test('Should decrease quality by four for expired items', () => {
      const app = new GildedTros([
        new Item('Duplicate Code', 0, 6),
        new Item('Long Methods', 0, 2),
        new Item('Ugly Variable Names', 0, 10),
      ]);
      app.updateQuality();
      expect(app.items[0].name).toEqual('Duplicate Code');
      expect(app.items[0].sellIn).toEqual(-1);
      expect(app.items[0].quality).toEqual(2);

      expect(app.items[1].name).toEqual('Long Methods');
      expect(app.items[1].sellIn).toEqual(-1);
      expect(app.items[1].quality).toEqual(0);

      expect(app.items[2].name).toEqual('Ugly Variable Names');
      expect(app.items[2].sellIn).toEqual(-1);
      expect(app.items[2].quality).toEqual(6);
    });
  });
});
