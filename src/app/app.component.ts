import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';

import { tap } from 'rxjs';

import { ParagraphsService } from './shared/services/api/paragraphs.service';
import { IParagraph } from './shared/interfaces/paragraph';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  paragraphs$: IParagraph[];

  constructor(
    private service: ParagraphsService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.service.paragraphs$.pipe(
      tap((data) => {
        this.zone.run(() => {
          this.paragraphs$ = data.present;
          this.cdr.markForCheck();
        });
      })
    ).subscribe();
  }
}
