import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicencePage } from './licence.page';

describe('LicencePage', () => {
  let component: LicencePage;
  let fixture: ComponentFixture<LicencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
