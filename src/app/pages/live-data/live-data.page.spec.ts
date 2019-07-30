import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDataPage } from './live-data.page';

describe('LiveDataPage', () => {
  let component: LiveDataPage;
  let fixture: ComponentFixture<LiveDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveDataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
