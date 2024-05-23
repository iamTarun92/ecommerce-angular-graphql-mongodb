import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {

  @Input() rating: number = 0;
  @Input() readOnly: boolean = false;
  @Input() name: string = '';
  stars = [1, 2, 3, 4, 5];

  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();


  // Function to handle rating selection
  onRatingChanged(star: number) {
    if (!this.readOnly) {
      this.rating = star;
      this.ratingChange.emit(this.rating);
    }
  }

  isStarSelected(star: number): boolean {
    return star === this.rating;
  }
}
