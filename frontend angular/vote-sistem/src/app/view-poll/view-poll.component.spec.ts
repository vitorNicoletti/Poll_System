import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPollComponent } from './view-poll.component';

describe('ViewPollComponent', () => {
  let component: ViewPollComponent;
  let fixture: ComponentFixture<ViewPollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
