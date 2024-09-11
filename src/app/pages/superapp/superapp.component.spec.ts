import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperappComponent } from './superapp.component';

describe('SuperappComponent', () => {
  let component: SuperappComponent;
  let fixture: ComponentFixture<SuperappComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuperappComponent]
    });
    fixture = TestBed.createComponent(SuperappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
