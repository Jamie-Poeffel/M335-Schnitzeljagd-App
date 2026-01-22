import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CongratsPage } from './congrats.page';

describe('CongratsPage', () => {
  let component: CongratsPage;
  let fixture: ComponentFixture<CongratsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CongratsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
