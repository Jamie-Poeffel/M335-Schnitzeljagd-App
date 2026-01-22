import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptCamLocPage } from './accept-cam-loc.page';

describe('AcceptCamLocPage', () => {
  let component: AcceptCamLocPage;
  let fixture: ComponentFixture<AcceptCamLocPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptCamLocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
