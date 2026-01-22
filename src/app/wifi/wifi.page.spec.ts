import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WifiPage } from './wifi.page';

describe('WifiPage', () => {
  let component: WifiPage;
  let fixture: ComponentFixture<WifiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
