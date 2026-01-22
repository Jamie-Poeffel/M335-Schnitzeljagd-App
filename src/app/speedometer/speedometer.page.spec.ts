import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeedoMeterPage } from './speedometer.page';

describe('SpeedoMeterPage', () => {
  let component: SpeedoMeterPage;
  let fixture: ComponentFixture<SpeedoMeterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedoMeterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
