import { TestBed } from '@angular/core/testing';

import { WithDocService } from './with-doc.service';

describe('WithDocService', () => {
  let service: WithDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WithDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
