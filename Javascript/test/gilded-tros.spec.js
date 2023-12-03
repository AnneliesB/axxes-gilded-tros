import { Item } from '../src/item';
import { GildedTros } from '../src/gilded-tros';

describe('GildedTros', () => {
  test('Test Item', () => {
    const items = [new Item('foo', 0, 0)];
    const app = new GildedTros(items);
    app.updateQuality();
    expect(app.items[0].name).toEqual('foo');
  });
});
