import { Component, Input } from '@angular/core';

export type LogoVariant = 'full' | 'mark';

@Component({
  selector: 'jhi-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  /**
   * 'full' : icône smartphone + colis + traits + texte « Tuni Sales » (par défaut)
   * 'mark' : icône seule (smartphone + colis), utilisée en navbar et favicon
   */
  @Input() variant: LogoVariant = 'full';

  /** Hauteur en px. La largeur s'adapte au ratio. */
  @Input() size = 48;
}
