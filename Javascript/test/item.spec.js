import { Item } from '../src/item';

describe('Item', () => {
  test('toString', () => {
    const item = new Item('Ring of Cleansening Code', 10, 20);
    expect(item.toString()).toMatchInlineSnapshot(`"Ring of Cleansening Code, 10, 20"`);
  });
});

