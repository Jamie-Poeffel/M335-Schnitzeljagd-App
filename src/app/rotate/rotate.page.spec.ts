import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RotatePage } from './rotate.page';

describe('RotatePage', () => {
  let component: RotatePage;
  let fixture: ComponentFixture<RotatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RotatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
