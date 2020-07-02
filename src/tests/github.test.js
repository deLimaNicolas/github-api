/* eslint-disable no-undef */
import {
  getRepositoriesByOrgPaginated,
  getLastArrElm,
} from '../utils/github.js';

describe('testing github utils -- using organizations : IBM && Microsoft', () => {
  it('should return object containing repositories, pageInfo and lastCursor -- no after', async () => {
    const test = await getRepositoriesByOrgPaginated({ orgName: 'Netflix' });
    const { repositories: r1, pageInfo: p1, lastCursor: l1 } = test;

    expect(r1).toBeTruthy();
    expect(p1).toBeTruthy();
    expect(l1).toBeTruthy();

    const test2 = await getRepositoriesByOrgPaginated({ orgName: 'microsoft' });
    const { repositories: r2, pageInfo: p2, lastCursor: l2 } = test2;

    expect(r2).toBeTruthy();
    expect(p2).toBeTruthy();
    expect(l2).toBeTruthy();
  });

  it('should return object containing repositories, pageInfo and lastCursor -- passing after', async () => {
    const test = await getRepositoriesByOrgPaginated({ orgName: 'IBM' });
    const { repositories: r1, pageInfo: p1, lastCursor: l1 } = test;

    expect(r1).toBeTruthy();
    expect(p1).toBeTruthy();
    expect(l1).toBeTruthy();

    const test2 = await getRepositoriesByOrgPaginated({
      orgName: 'IBM',
      after: l1,
    });
    const { repositories: r2, pageInfo: p2, lastCursor: l2 } = test2;

    expect(r2).toBeTruthy();
    expect(p2).toBeTruthy();
    expect(l2).toBeTruthy();
  });

  it('should have no assertions checking if array is sorted correctly by stars DESC', async () => {
    const test = await getRepositoriesByOrgPaginated({ orgName: 'IBM' });
    const { repositories: r1 } = test;
    const r1Length = r1.length - 1;

    try {
      r1.forEach(({ stars }, i) => {
        const isLastPosition = i >= r1Length;
        if (isLastPosition) return;
        else if (stars < r1[i + 1].stars) throw 'SORT_BROKEN'; //check if previous index is higher than current index
      });
    } catch (e) {
      expect(e).toBe('SORT_BROKEN');
    }
    expect.assertions(0);
  });
}, 150000);

describe('testing data manipulation utils', () => {
  it('should return last element of a given array', () => {
    const array = [1, 2, 3, 4, 5, 6];
    expect(getLastArrElm(array)).toBe(6);
  });
}, 150000);
