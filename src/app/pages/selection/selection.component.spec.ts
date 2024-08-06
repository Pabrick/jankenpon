import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { SelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
  let component: SelectionComponent;
  let fixture: ComponentFixture<SelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionComponent);
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
