import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';
import { of } from 'rxjs';
import { Player } from '../../types/player.types';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  const playerMock: Player = {
    name: 'pablo',
    state: 'choice',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when click CHOICE', () => {
    beforeEach(() => {
      component.player$ = of(playerMock);
      fixture.detectChanges();
      spyOn(component.onFinishStateEmt, 'emit');
    });
    it('should emit ROCK', fakeAsync(() => {
      const nativeElement = fixture.debugElement.nativeElement;
      const button = nativeElement.querySelector('#btChoice-rock');
      button.click();
      expect(component.onFinishStateEmt.emit).toHaveBeenCalledWith({
        state: 'choice',
        extra: 'rock',
      });
    }));

    it('should emit PAPER', fakeAsync(() => {
      const nativeElement = fixture.debugElement.nativeElement;
      const button = nativeElement.querySelector('#btChoice-paper');
      button.click();
      expect(component.onFinishStateEmt.emit).toHaveBeenCalledWith({
        state: 'choice',
        extra: 'paper',
      });
    }));

    it('should emit SCISSORS', fakeAsync(() => {
      const nativeElement = fixture.debugElement.nativeElement;
      const button = nativeElement.querySelector('#btChoice-scissors');
      button.click();
      expect(component.onFinishStateEmt.emit).toHaveBeenCalledWith({
        state: 'choice',
        extra: 'scissors',
      });
    }));
  });
});
