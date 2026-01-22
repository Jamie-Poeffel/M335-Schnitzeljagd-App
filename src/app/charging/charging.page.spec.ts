import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChargingPage } from './charging.page';

describe('ChargingPage', () => {
  let component: ChargingPage;
  let fixture: ComponentFixture<ChargingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
