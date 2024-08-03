import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { SelectionPageComponent } from './selection-page.component';

describe('SelectionPageComponent', () => {
  let component: SelectionPageComponent;
  let fixture: ComponentFixture<SelectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when click', () => {
    beforeEach(() => {
      spyOn(component.router, 'navigate');
    });
    it('COMPUTER should navigate', fakeAsync(() => {
      const button =
        fixture.debugElement.nativeElement.querySelector('#btComputer');
      button.click();
      expect(component.router.navigate).toHaveBeenCalledWith(['./game']);
    }));

    it('LOCAL should navigate', fakeAsync(() => {
      const button =
        fixture.debugElement.nativeElement.querySelector('#btLocal');
      button.click();
      expect(component.router.navigate).toHaveBeenCalledWith(['./game']);
    }));
  });
});
