import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprPage } from './gdpr.page';

describe('GdprPage', () => {
  let component: GdprPage;
  let fixture: ComponentFixture<GdprPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdprPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdprPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
