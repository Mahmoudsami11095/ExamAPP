import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPromo } from './auth-promo';

describe('AuthPromo', () => {
  let component: AuthPromo;
  let fixture: ComponentFixture<AuthPromo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPromo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthPromo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
