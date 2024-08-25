import { TestBed } from '@angular/core/testing';

import { TimelineManagerService } from './timeline-manager.service';

describe('TimelineManagerService', () => {
  let service: TimelineManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
