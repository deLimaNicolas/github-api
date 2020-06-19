/* eslint-disable no-undef */
import getRepositoriesByOrg from '../utils/github.js';

describe('testing github utils -- using organizations : IBM && Microsoft', () => {
  it('should return object containing repositories, pageInfo and lastCursor -- no after', async () => {
    const test = await getRepositoriesByOrg({orgName:'IBM'});
    const { repositories: r1, pageInfo: p1, lastCursor: l1 } = test;

    expect(r1).toBeTruthy();
    expect(p1).toBeTruthy();
    expect(l1).toBeTruthy();

    const test2 = await getRepositoriesByOrg({orgName:'microsoft'});
    const { repositories: r2, pageInfo: p2, lastCursor: l2 } = test2;

    expect(r2).toBeTruthy();
    expect(p2).toBeTruthy();
    expect(l2).toBeTruthy();
  });

  it('should return object containing repositories, pageInfo and lastCursor -- passing after', async () => {
    const test = await getRepositoriesByOrg({orgName:'IBM'});
    const { repositories: r1, pageInfo: p1, lastCursor: l1 } = test;

    expect(r1).toBeTruthy();
    expect(p1).toBeTruthy();
    expect(l1).toBeTruthy();

    const test2 = await getRepositoriesByOrg({orgName:'IBM', after: l1});
    const { repositories: r2, pageInfo: p2, lastCursor: l2 } = test2;

    expect(r2).toBeTruthy();
    expect(p2).toBeTruthy();
    expect(l2).toBeTruthy();
  });

  it('should have no assertions checking if array is sorted by stars DESC', async () => {
    const test = await getRepositoriesByOrg({orgName:'IBM'});
    const { repositories: r1 } = test;
    const r1Length = r1.length - 1;
    
    try{
      r1.forEach((({stars}, i) => {
        if(!(i < r1Length )) return;
        else if(stars < r1[i + 1].stars) throw 'SORT_BROKEN';
      }));
    }catch(e){
      expect(e).toBe('SORT_BROKEN');
    }
    expect.assertions(0);
  });
});