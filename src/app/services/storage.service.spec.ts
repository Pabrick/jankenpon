import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let localStoreMock = {} as any;
  const mockScore = [
    {
      name: 'john',
      score: 3,
    },
    {
      name: 'judy',
      score: 2,
    },
  ];
  localStoreMock['jankenpon'] = JSON.stringify(mockScore);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);

    spyOn(window.localStorage, 'getItem').and.callFake((key) =>
      key in localStoreMock ? localStoreMock[key] : null
    );
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => (localStoreMock[key] = value + '')
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getScoreboard should parse data properly', () => {
    service.getScoreboard();
    expect(service.scoreboard).toEqual(mockScore);
  });

  describe('#getPlayer should return', () => {
    beforeEach(() => {
      service.getScoreboard();
    });

    it('a player when found', () => {
      expect(service.getPlayer('john')).toEqual(mockScore[0]);
    });

    it('"undefined" when NOT found', () => {
      expect(service.getPlayer('pablo')).toEqual(undefined);
    });
  });
});
