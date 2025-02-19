import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPollsComponent } from './all-polls.component';

describe('AllPollsComponent', () => {
  let component: AllPollsComponent;
  let fixture: ComponentFixture<AllPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPollsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
